import { useEffect, useRef, useState } from 'react'
import { gsap, finePointer, reducedMotion } from '../motion.js'

// Custom cursor for mouse users: a dot plus a trailing ring that grows over links and turns
// into a label (e.g. "View") over elements with data-cursor="…". Text fields keep the normal cursor.
export default function Cursor() {
  const root = useRef(null)
  const [enabled] = useState(() => finePointer() && !reducedMotion())

  useEffect(() => {
    if (!enabled) return
    const el = root.current
    const ring = el.querySelector('.cursor__ring')
    const dot = el.querySelector('.cursor__dot')
    const text = el.querySelector('.cursor__text')
    const html = document.documentElement
    html.classList.add('has-cursor')

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })
    const dotX = gsap.quickSetter(dot, 'x', 'px')
    const dotY = gsap.quickSetter(dot, 'y', 'px')
    let state = ''

    const setState = (next, label = '') => {
      if (next === state) return
      state = next
      el.dataset.state = next
      if (label) text.textContent = label
    }
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      if (!('visible' in el.dataset)) {
        gsap.set(ring, { x: e.clientX, y: e.clientY })
        el.dataset.visible = ''
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }
    const over = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      if (t.closest('input, textarea, select')) return setState('hidden')
      const labelled = t.closest('[data-cursor]')
      if (labelled) return setState('label', labelled.dataset.cursor)
      setState(t.closest('a, button, label, [role="button"]') ? 'link' : 'default')
    }
    const out = (e) => { if (!e.relatedTarget) delete el.dataset.visible }
    const down = () => { el.dataset.down = '' }
    const up = () => { delete el.dataset.down }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor__ring"><span className="cursor__text" /></div>
      <div className="cursor__dot"><i /></div>
    </div>
  )
}
