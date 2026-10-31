import { steps } from '../data.js'
import { gsap, useMotion } from '../motion.js'
import SplitWords from './SplitWords.jsx'

// On large screens the section pins and the four stage cards slide sideways as you scroll,
// turning dark one by one. Elsewhere (and with reduced motion) they're a simple grid.
const HORIZONTAL = '(min-width: 961px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)'

export default function Process() {
  const scope = useMotion((root) => {
    const pin = root.querySelector('.process__pin')
    const track = root.querySelector('.process__track')
    const list = root.querySelector('.steps')
    const cards = [...list.children]
    root.dataset.horizontal = '' // switches the CSS to a single row of cards
    const distance = () => Math.max(0, list.scrollWidth - track.clientWidth)
    const range = { trigger: pin, start: 'top top', end: () => `+=${distance()}`, invalidateOnRefresh: true }

    // Stage 1 is lit from the start; each later stage lights up as its share of the scroll is reached.
    const light = (progress) => cards.forEach((card, i) => {
      card.toggleAttribute('data-active', i <= Math.floor(progress * cards.length))
    })
    gsap.to(list, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: { ...range, pin: true, scrub: 0.6, onUpdate: (self) => light(self.progress), onRefresh: (self) => light(self.progress) },
    })
    gsap.to('.process__bar span', { scaleX: 1, ease: 'none', scrollTrigger: { ...range, scrub: 0.6 } })

    return () => {
      delete root.dataset.horizontal
      cards.forEach((card) => delete card.dataset.active)
    }
  }, [], HORIZONTAL)

  return (
    <section className="process" id="process" ref={scope}>
      <div className="process__pin">
        <div className="wrap process__head">
          <div>
            <p className="eyebrow" data-reveal><span>03</span>Process</p>
            <h2 className="h2" data-split><SplitWords text="How we work" /></h2>
          </div>
          <p className="intro" data-reveal>
            The same four stages on every project, so you always know what happens next,
            what it costs and when you’ll see it.
          </p>
        </div>
        <div className="process__track">
          <ol className="steps wrap">
            {steps.map((s, i) => (
              <li key={s.name} className="step" data-reveal>
                <span className="step__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="step__body">
                  <p className="step__time">{s.duration}</p>
                  <h3 className="step__name">{s.name}</h3>
                  <p className="step__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap process__foot" aria-hidden="true">
          <div className="process__bar"><span /></div>
          <span className="process__hint">Keep scrolling</span>
        </div>
      </div>
    </section>
  )
}
