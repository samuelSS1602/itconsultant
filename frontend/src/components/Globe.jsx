import { useEffect, useRef } from 'react'
import { lenis, reducedMotion } from '../motion.js'

// Rotating dotted globe for the hero, drawn on a canvas. Offices glow (amber while open),
// light travels along arcs between them, and the globe leans towards the mouse and spins
// faster while the page scrolls. Visitors who prefer reduced motion get a single still frame.

const DEG = Math.PI / 180
const TAU = Math.PI * 2
const TILT = 0.32 // look down slightly on the northern hemisphere
// Office pairs joined by arcs (indexes into the offices list).
const ROUTES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 4], [0, 5]]
const ARC_STEPS = 64
const LEVELS = 8

const toVec = (lat, lon) => [
  Math.cos(lat * DEG) * Math.sin(lon * DEG),
  Math.sin(lat * DEG),
  Math.cos(lat * DEG) * Math.cos(lon * DEG),
]

// Points spread evenly over a sphere (Fibonacci lattice).
function spherePoints(n) {
  const out = new Float32Array(n * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2
    const r = Math.sqrt(1 - y * y)
    out.set([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r], i * 3)
  }
  return out
}

// Great-circle arc between two points, lifted off the surface towards the middle.
function arcPoints(a, b) {
  const omega = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const lift = 0.05 + omega * 0.11
  const out = new Float32Array((ARC_STEPS + 1) * 3)
  for (let i = 0; i <= ARC_STEPS; i++) {
    const t = i / ARC_STEPS
    const s0 = Math.sin((1 - t) * omega) / Math.sin(omega)
    const s1 = Math.sin(t * omega) / Math.sin(omega)
    const h = 1 + lift * Math.sin(Math.PI * t)
    out.set([(a[0] * s0 + b[0] * s1) * h, (a[1] * s0 + b[1] * s1) * h, (a[2] * s0 + b[2] * s1) * h], i * 3)
  }
  return out
}

export default function Globe({ offices, open }) {
  const canvasRef = useRef(null)
  const openRef = useRef(open)
  openRef.current = open
  const redraw = useRef(null)
  const openKey = open.join()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const still = reducedMotion()
    const count = window.innerWidth < 640 ? 650 : 1200
    const dots = spherePoints(count)
    const sites = offices.map((o) => toVec(o.lat, o.lon))

    // How close each dot is to an office (0–1), so the land around offices glows warmer.
    const warmth = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      let best = -1
      for (const s of sites) best = Math.max(best, dots[i * 3] * s[0] + dots[i * 3 + 1] * s[1] + dots[i * 3 + 2] * s[2])
      warmth[i] = Math.max(0, (best - 0.95) / 0.05)
    }
    const arcs = ROUTES.map(([from, to], i) => ({ points: arcPoints(sites[from], sites[to]), to, delay: i * 0.85 }))
    const projected = new Float32Array((ARC_STEPS + 1) * 3)
    const cool = Array.from({ length: LEVELS }, () => [])
    const warm = Array.from({ length: 4 }, () => [])
    const coolFill = cool.map((_, l) => `rgba(242, 243, 239, ${(((l + 0.5) / LEVELS) * 0.78).toFixed(3)})`)
    const warmFill = warm.map((_, l) => `rgba(255, 181, 71, ${(0.35 + l * 0.18).toFixed(2)})`)

    let w = 0
    let h = 0
    let R = 0
    let spin = -48 * DEG // start with Europe, the Gulf and India facing the viewer
    let leanX = 0
    let leanY = 0
    let aimX = 0
    let aimY = 0

    const draw = (time) => {
      const sec = time / 1000
      const cx = w / 2
      const cy = h / 2
      const yaw = spin + leanY
      const pitch = TILT + leanX
      const cyw = Math.cos(yaw)
      const syw = Math.sin(yaw)
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)
      // Rotate a unit-sphere point and return screen x, y and depth (z > 0 faces the viewer).
      const project = (x, y, z, out, o) => {
        const x1 = x * cyw + z * syw
        const z1 = -x * syw + z * cyw
        const y2 = y * cp - z1 * sp
        out[o] = x1
        out[o + 1] = y2
        out[o + 2] = y * sp + z1 * cp
      }
      const p = projected

      ctx.clearRect(0, 0, w, h)

      // Orbit ring and rim
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(242, 243, 239, 0.07)'
      ctx.beginPath()
      ctx.ellipse(cx, cy, R * 1.32, R * 0.34, -0.38, 0, TAU)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(242, 243, 239, 0.12)'
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, TAU)
      ctx.stroke()

      // Dots, grouped by brightness so each group is a single fill
      for (let i = 0; i < count; i++) {
        project(dots[i * 3], dots[i * 3 + 1], dots[i * 3 + 2], p, 0)
        const z = p[2]
        const x = cx + p[0] * R
        const y = cy - p[1] * R
        if (z > 0 && warmth[i] > 0) {
          warm[Math.min(3, Math.floor(warmth[i] * z * 4))].push(x, y, 1 + z * 1.1)
        } else {
          const alpha = z > 0 ? 0.16 + 0.64 * z : 0.12 * (1 + z)
          cool[Math.min(LEVELS - 1, Math.floor((alpha / 0.8) * LEVELS))].push(x, y, z > 0 ? 0.7 + z * 0.9 : 0.6)
        }
      }
      const fillGroups = (groups, fills) => groups.forEach((list, l) => {
        if (!list.length) return
        ctx.fillStyle = fills[l]
        ctx.beginPath()
        for (let j = 0; j < list.length; j += 3) {
          ctx.moveTo(list[j] + list[j + 2], list[j + 1])
          ctx.arc(list[j], list[j + 1], list[j + 2], 0, TAU)
        }
        ctx.fill()
        list.length = 0
      })
      fillGroups(cool, coolFill)
      fillGroups(warm, warmFill)

      // Arcs: a faint path, plus a light that travels along it and ripples on arrival
      ctx.lineCap = 'round'
      for (const arc of arcs) {
        for (let j = 0; j <= ARC_STEPS; j++) project(arc.points[j * 3], arc.points[j * 3 + 1], arc.points[j * 3 + 2], p, j * 3)
        // A point is hidden only when it is behind the globe and inside its outline.
        const visible = (j) => p[j * 3 + 2] > 0 || p[j * 3] ** 2 + p[j * 3 + 1] ** 2 > 1
        const sx = (j) => cx + p[j * 3] * R
        const sy = (j) => cy - p[j * 3 + 1] * R

        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(122, 146, 255, 0.28)'
        ctx.beginPath()
        for (let j = 1; j <= ARC_STEPS; j++) {
          if (!visible(j) || !visible(j - 1)) continue
          ctx.moveTo(sx(j - 1), sy(j - 1))
          ctx.lineTo(sx(j), sy(j))
        }
        ctx.stroke()
        if (still) continue

        const cycle = 6
        const travel = 2.6
        const phase = ((((sec - arc.delay) % cycle) + cycle) % cycle) / travel
        const head = Math.min(phase, 1)
        const tail = Math.max(0, phase - 0.38)
        if (tail < 1) {
          const first = Math.floor(tail * ARC_STEPS)
          const last = Math.ceil(head * ARC_STEPS)
          ctx.lineWidth = 1.8
          for (let j = Math.max(1, first); j <= last; j++) {
            if (!visible(j) || !visible(j - 1)) continue
            const k = (j / ARC_STEPS - tail) / Math.max(0.001, head - tail)
            ctx.strokeStyle = `rgba(255, 200, 120, ${(Math.max(0, Math.min(1, k)) ** 2 * 0.95).toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(sx(j - 1), sy(j - 1))
            ctx.lineTo(sx(j), sy(j))
            ctx.stroke()
          }
          if (phase <= 1 && visible(last)) {
            ctx.fillStyle = '#FFE2B5'
            ctx.beginPath()
            ctx.arc(sx(last), sy(last), 2.2, 0, TAU)
            ctx.fill()
          }
        }
        if (phase > 1 && phase < 1.4) {
          const s = sites[arc.to]
          project(s[0], s[1], s[2], p, 0)
          if (p[2] > 0) {
            const k = (phase - 1) / 0.4
            ctx.lineWidth = 1.2
            ctx.strokeStyle = `rgba(255, 200, 120, ${((1 - k) * 0.9).toFixed(3)})`
            ctx.beginPath()
            ctx.arc(cx + p[0] * R, cy - p[1] * R, 4 + k * 18, 0, TAU)
            ctx.stroke()
          }
        }
      }

      // Offices: glow, core, pulse while open, and the city name
      ctx.font = '500 12px "Figtree Variable", system-ui, sans-serif'
      offices.forEach((office, i) => {
        const s = sites[i]
        project(s[0], s[1], s[2], p, 0)
        const fade = Math.max(0, Math.min(1, (p[2] + 0.1) / 0.3))
        if (!fade) return
        const x = cx + p[0] * R
        const y = cy - p[1] * R
        const isOpen = openRef.current[i]
        const rgb = isOpen ? '255, 181, 71' : '242, 243, 239'
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 20)
        glow.addColorStop(0, `rgba(${rgb}, ${0.45 * fade})`)
        glow.addColorStop(1, `rgba(${rgb}, 0)`)
        ctx.fillStyle = glow
        ctx.fillRect(x - 20, y - 20, 40, 40)
        ctx.fillStyle = `rgba(${rgb}, ${fade})`
        ctx.beginPath()
        ctx.arc(x, y, 3.2, 0, TAU)
        ctx.fill()
        if (isOpen && !still) {
          const k = ((sec + i * 0.37) % 2.4) / 2.4
          ctx.lineWidth = 1.2
          ctx.strokeStyle = `rgba(255, 181, 71, ${((1 - k) * 0.8 * fade).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(x, y, 4 + k * 16, 0, TAU)
          ctx.stroke()
        }
        ctx.fillStyle = `rgba(242, 243, 239, ${(0.8 * fade).toFixed(3)})`
        ctx.fillText(office.city, x + 10, y + 4)
      })

      // A small satellite on the orbit ring, hidden while it passes behind the globe
      if (!still) {
        const a = sec * 0.35
        const ex = Math.cos(a) * R * 1.32
        const ey = Math.sin(a) * R * 0.34
        const x = cx + ex * Math.cos(-0.38) - ey * Math.sin(-0.38)
        const y = cy + ex * Math.sin(-0.38) + ey * Math.cos(-0.38)
        const behind = Math.sin(a) < 0 && (x - cx) ** 2 + (y - cy) ** 2 < R * R
        if (!behind) {
          ctx.fillStyle = '#C9D3FF'
          ctx.beginPath()
          ctx.arc(x, y, 2.6, 0, TAU)
          ctx.fill()
        }
      }
    }

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, w > 900 ? 1.5 : 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = Math.min(w, h) * 0.36
      if (still) draw(0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    if (still) {
      redraw.current = () => draw(0)
      document.fonts?.ready.then(() => redraw.current?.()) // city labels in the brand font
      return () => { ro.disconnect(); redraw.current = null }
    }

    let raf = 0
    let last = 0
    const frame = (now) => {
      const dt = Math.min(now - (last || now), 50) / 1000
      last = now
      const velocity = lenis ? Math.abs(lenis.velocity) : 0
      spin += dt * (0.07 + Math.min(velocity, 60) * 0.006)
      leanX += (aimY - leanX) * 0.04
      leanY += (aimX - leanY) * 0.04
      draw(now)
      raf = requestAnimationFrame(frame)
    }
    // Only animate while the hero is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting) {
        last = 0
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(canvas)
    const onMove = (e) => {
      aimX = (e.clientX / window.innerWidth - 0.5) * 0.5
      aimY = (e.clientY / window.innerHeight - 0.5) * 0.3
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [offices])

  // The still frame is redrawn when an office opens or closes.
  useEffect(() => { redraw.current?.() }, [openKey])

  return <canvas ref={canvasRef} className="globe" aria-hidden="true" />
}
