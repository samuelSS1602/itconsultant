import { useEffect, useRef, useState } from 'react'
import { insights, faqs } from '../data.js'
import { gsap, finePointer, reducedMotion } from '../motion.js'
import Motif from './Motif.jsx'
import SplitWords from './SplitWords.jsx'

export default function Insights() {
  const [open, setOpen] = useState(0)
  const [hover, setHover] = useState(-1)
  // A floating preview card follows the mouse over the article list (mouse users only).
  const [preview] = useState(() => finePointer() && !reducedMotion())
  const card = useRef(null)

  useEffect(() => {
    if (!preview) return
    const el = card.current
    gsap.set(el, { yPercent: -50 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    const move = (e) => { xTo(e.clientX + 40); yTo(e.clientY) } // beside the cursor, so the title stays readable
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [preview])

  return (
    <section className="section insights" id="insights">
      <div className="wrap split">
        <div>
          <p className="eyebrow" data-reveal><span>05</span>Articles</p>
          <h2 className="h2" data-split><SplitWords text="Insights" /></h2>
          <ul className="articles" onPointerLeave={() => setHover(-1)}>
            {insights.map((a, idx) => (
              <li key={a.title} data-draw="">
                <a href="#insights" className="article" onPointerEnter={() => setHover(idx)}>
                  <span className="article__meta">{a.topic}<span>{a.minutes} min read</span></span>
                  <span className="article__title">{a.title}</span>
                  <time className="article__date">{a.date}</time>
                  <svg className="article__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="faq">
          <p className="eyebrow" data-reveal>FAQ</p>
          <h2 className="h2" data-split><SplitWords text="Common questions" /></h2>
          <ul className="faqs">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <li key={f.q} className={`faq ${isOpen ? 'is-open' : ''}`} data-draw="">
                  <h3>
                    <button aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                      {f.q}
                      <span className="service__icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`faq-${i}`} className="faq__panel">
                    <div><p>{f.a}</p></div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {preview && (
        <div className={`preview ${hover >= 0 ? 'is-on' : ''}`} ref={card} aria-hidden="true">
          <div className="preview__inner">
            <div className="preview__stack" style={{ transform: `translateY(${-Math.max(hover, 0) * 100}%)` }}>
              {insights.map((a) => (
                <div key={a.title} className="preview__slide">
                  <Motif kind={a.motif} color={a.color} />
                  <span>{a.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
