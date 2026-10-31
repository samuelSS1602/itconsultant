import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { caseStudies, industries } from '../data.js'
import { gsap, lenis, MOTION, reducedMotion, useMotion } from '../motion.js'
import Motif from './Motif.jsx'
import SplitWords from './SplitWords.jsx'
import Button from './Button.jsx'

export default function Work() {
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const shown = caseStudies.filter((c) => filter === 'All' || c.industry === filter)
  const close = useCallback(() => setActive(null), [])

  // Cards wipe in as they reach the viewport; the offset column drifts at its own pace.
  // Re-runs for each filter, because the grid is rebuilt (see its key).
  const scope = useMotion((root, { conditions }) => {
    if (!conditions.motion) return
    const cards = gsap.utils.toArray('.case', root)
    cards.forEach((card) => {
      gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        onStart: () => { card.dataset.inview = '' },
      })
        .fromTo(card.querySelector('.case__art'),
          { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.4, ease: 'expo.inOut' })
        .from(card.querySelector('.case__zoom'), { scale: 1.4, duration: 1.8, ease: 'expo.out' }, 0.25)
        .from(card.querySelector('.case__metric'), { y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out' }, 0.8)
        .from(card.querySelectorAll('.case__text > *'), { y: 28, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.5)
    })
    if (conditions.wide) {
      cards.filter((_, i) => i % 2).forEach((card) => {
        gsap.fromTo(card, { y: 70 }, { y: -70, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }
  }, [filter], { motion: MOTION, wide: '(min-width: 641px)' })

  // The artwork tilts towards the mouse, with a soft glare where the pointer is.
  const tilt = (e) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return
    const art = e.currentTarget.querySelector('.case__art')
    const r = art.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    art.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
    art.style.setProperty('--rx', `${(0.5 - py) * 9}deg`)
    art.style.setProperty('--gx', `${px * 100}%`)
    art.style.setProperty('--gy', `${py * 100}%`)
  }
  const untilt = (e) => {
    const art = e.currentTarget.querySelector('.case__art')
    art.style.setProperty('--rx', '0deg')
    art.style.setProperty('--ry', '0deg')
  }

  return (
    <section className="section work" id="work" ref={scope}>
      <div className="wrap">
        <div className="work__head">
          <div>
            <p className="eyebrow" data-reveal><span>02</span>Case studies</p>
            <h2 className="h2" data-split><SplitWords text="Selected work" /></h2>
          </div>
          <div className="chips" role="group" aria-label="Filter projects by industry" data-reveal>
            {industries.map((ind) => (
              <button
                key={ind}
                className={`chip ${filter === ind ? 'is-active' : ''}`}
                aria-pressed={filter === ind}
                onClick={() => setFilter(ind)}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <ul className="work__grid" key={filter}>
          {shown.map((c) => (
            <li key={c.id} className="case">
              <button
                className="case__btn"
                onClick={() => setActive(c)}
                onPointerMove={tilt}
                onPointerLeave={untilt}
                aria-haspopup="dialog"
                data-cursor="View"
              >
                <div className="case__art">
                  <div className="case__zoom"><Motif kind={c.motif} color={c.color} /></div>
                  <span className="case__metric">
                    <strong>{c.metric}</strong>
                    <span>{c.metricLabel}</span>
                  </span>
                </div>
                <div className="case__text">
                  <p className="case__client">{c.client}<span>{c.industry}, {c.region}</span></p>
                  <h3 className="case__title">{c.title}</h3>
                  <span className="text-link">Read the case study</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {active && <CaseDialog item={active} onClose={close} />}
    </section>
  )
}

function CaseDialog({ item, onClose }) {
  const ref = useRef(null)
  const closing = useRef(false)

  // Animate out, then close for real (which fires the dialog's close event).
  const requestClose = useCallback(() => {
    const dlg = ref.current
    if (!dlg || closing.current) return
    closing.current = true
    if (reducedMotion()) return dlg.close()
    dlg.dataset.closing = ''
    gsap.to(dlg, { y: 40, opacity: 0, duration: 0.4, ease: 'power3.in', overwrite: 'auto', onComplete: () => dlg.close() })
  }, [])

  useLayoutEffect(() => {
    const dlg = ref.current
    if (!dlg.open) dlg.showModal()
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    document.documentElement.classList.add('dialog-open')
    const onCancel = (e) => { e.preventDefault(); requestClose() } // Escape key
    dlg.addEventListener('cancel', onCancel)
    dlg.addEventListener('close', onClose)

    const ctx = gsap.context(() => {
      if (reducedMotion()) return
      gsap.timeline()
        .from(dlg, { y: 70, opacity: 0, clipPath: 'inset(12% 5% 0% 5% round 22px)', duration: 0.9, ease: 'expo.out' })
        .from('.dialog__art .motif', { scale: 1.3, duration: 1.4, ease: 'expo.out' }, 0)
        .from('.dialog__content > :not(.dialog__cols), .dialog__cols > div > *', { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.035 }, 0.15)
    }, dlg)

    return () => {
      ctx.revert()
      dlg.removeEventListener('cancel', onCancel)
      dlg.removeEventListener('close', onClose)
      document.documentElement.classList.remove('dialog-open')
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [onClose, requestClose])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="case-title"
      data-lenis-prevent=""
      onClick={(e) => e.target === ref.current && requestClose()}
    >
      <div className="dialog__body">
        <button className="dialog__close" onClick={requestClose} aria-label="Close case study">
          <span /><span />
        </button>
        <div className="dialog__art" data-inview=""><Motif kind={item.motif} color={item.color} /></div>
        <div className="dialog__content">
          <p className="case__client">{item.client}<span>{item.industry}, {item.region}</span></p>
          <h3 id="case-title" className="dialog__title">{item.title}</h3>
          <div className="dialog__cols">
            <div>
              <h4>The challenge</h4>
              <p>{item.challenge}</p>
              <h4>What we did</h4>
              <p>{item.solution}</p>
            </div>
            <div>
              <h4>Results</h4>
              <ul className="results">
                {item.results.map((r) => <li key={r}>{r}</li>)}
              </ul>
              <h4>Services</h4>
              <p className="tags">{item.services.map((s) => <span key={s}>{s}</span>)}</p>
            </div>
          </div>
          <Button href="#contact" arrow onClick={requestClose}>Discuss a similar project</Button>
        </div>
      </div>
    </dialog>
  )
}
