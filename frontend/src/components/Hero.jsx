import { useEffect, useRef } from 'react'
import { offices } from '../data.js'
import { useNow, officeTime } from '../hooks.js'
import { gsap, useMotion } from '../motion.js'
import Globe from './Globe.jsx'
import SplitWords from './SplitWords.jsx'
import Button from './Button.jsx'

export default function Hero({ ready }) {
  const now = useNow()
  const times = offices.map((o) => officeTime(now, o.tz))
  const openCount = times.filter((t) => t.open).length
  const intro = useRef(null)
  const readyRef = useRef(ready)
  readyRef.current = ready

  const scope = useMotion((root) => {
    // Plays once the intro screen lifts (see the effect below).
    intro.current = gsap.timeline({ paused: true })
      .from('.hero__title .sw > span', { yPercent: 120, rotate: 7, duration: 1.5, ease: 'expo.out', stagger: 0.055 })
      .from('.hero__globe', { autoAlpha: 0, scale: 0.6, rotate: -30, duration: 2.6, ease: 'expo.out' }, 0)
      .from('.hero__lead', { y: 30, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.55)
      .from('.hero__actions > *', { y: 30, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, 0.65)
      .from('.clocks__rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.6, ease: 'expo.inOut' }, 0.5)
      .from('.clocks__status, .clocks__list li', { y: 20, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, 0.8)
    if (readyRef.current) intro.current.play()

    // While the hero scrolls away the copy lifts and fades, and the globe sinks and grows.
    gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.hero__body', { yPercent: -22, autoAlpha: 0.2, ease: 'none' }, 0)
      .to('.hero__parallax', { yPercent: 16, scale: 1.12, ease: 'none' }, 0)

    return () => { intro.current = null }
  })

  useEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])

  return (
    <section className="hero" id="top" ref={scope}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__parallax">
          <div className="hero__globe">
            <Globe offices={offices} open={times.map((t) => t.open)} />
          </div>
        </div>
      </div>

      <div className="wrap hero__body">
        <h1 className="hero__title">
          <span className="line"><SplitWords text="We plan, build and run" /></span>{' '}
          <span className="line"><SplitWords text="the technology your" accent="technology" /></span>{' '}
          <span className="line"><SplitWords text="business depends on." /></span>
        </h1>
        <div className="hero__aside">
          <p className="hero__lead">
            XYZ is an IT consultancy for growing companies. From cloud and custom software to data,
            AI and security — one team takes it from first plan to everyday support, in 32 countries.
          </p>
          <div className="hero__actions">
            <Button href="#contact" arrow>Book a free consultation</Button>
            <Button href="#work" variant="ghost">See our work</Button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="clocks" aria-label="Our offices and their local time">
          <span className="clocks__rule" aria-hidden="true" />
          <div className="clocks__status">
            <p>
              <span className={`dot ${openCount ? 'dot--on' : ''}`} aria-hidden="true" />
              {openCount
                ? `${openCount} of ${offices.length} offices open right now`
                : 'All offices closed — our 24/7 support line is still answered'}
            </p>
            <a href="#services" className="scroll-cue">Scroll<i aria-hidden="true" /></a>
          </div>
          <ul className="clocks__list">
            {offices.map((o, i) => {
              const t = times[i]
              const [hh, mm] = t.time.split(':')
              return (
                <li key={o.city} className={t.open ? 'is-open' : ''}>
                  <span className="clocks__city">{o.city}</span>
                  <span className="clocks__time">{hh}<span className="clocks__colon">:</span>{mm}</span>
                  <span className="clocks__state">{t.open ? 'Open' : 'Closed'}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
