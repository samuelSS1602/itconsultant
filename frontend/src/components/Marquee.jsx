import { useEffect, useRef } from 'react'
import { gsap, lenis, reducedMotion } from '../motion.js'

// Infinite horizontal marquee. Content is rendered twice so the loop is seamless;
// the second copy is hidden from screen readers. It drifts on its own, speeds up and
// leans with the scroll, follows the scroll direction and slows down under the mouse.
export default function Marquee({ items, variant = 'big', reverse = false, speed = 40, label }) {
  const root = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return // the CSS fallback lets people scroll it by hand instead
    const el = track.current
    const box = root.current
    el.style.animation = 'none'
    let x = 0
    let half = 0
    let boost = 0
    let skew = 0
    let slow = 1
    let slowTarget = 1
    let dir = 1
    let visible = true

    const ro = new ResizeObserver(() => { half = el.scrollWidth / 2 })
    ro.observe(el)
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(box)
    const enter = () => { slowTarget = 0.25 }
    const leave = () => { slowTarget = 1 }
    box.addEventListener('pointerenter', enter)
    box.addEventListener('pointerleave', leave)

    const tick = (_, deltaMs) => {
      if (!visible || !half) return
      const v = lenis?.velocity ?? 0
      if (v) dir = Math.sign(v)
      boost += (Math.min(Math.abs(v), 60) / 6 - boost) * 0.08
      slow += (slowTarget - slow) * 0.08
      x -= (reverse ? -1 : 1) * dir * (half / speed) * (Math.min(deltaMs, 50) / 1000) * (1 + boost) * slow
      x = gsap.utils.wrap(-half, 0, x)
      skew += ((variant === 'big' ? gsap.utils.clamp(-8, 8, -v * 0.2) : 0) - skew) * 0.1
      el.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      io.disconnect()
      box.removeEventListener('pointerenter', enter)
      box.removeEventListener('pointerleave', leave)
      el.style.animation = ''
      el.style.transform = ''
    }
  }, [reverse, speed, variant])

  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={item + i} className={variant === 'big' && i % 2 ? 'is-outline' : ''}>
          <span>{item}</span>
          <svg className="marquee__mark" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      ref={root}
      className={`marquee marquee--${variant} ${reverse ? 'marquee--reverse' : ''}`}
      style={{ '--speed': `${speed}s` }}
      role="region"
      aria-label={label}
    >
      <div className="marquee__track" ref={track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
