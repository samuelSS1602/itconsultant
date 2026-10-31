import { useLayoutEffect, useRef, useState } from 'react'
import { company, offices } from '../data.js'
import { gsap, reducedMotion } from '../motion.js'
import Logo from './Logo.jsx'

// Intro screen: counts to 100 while the fonts load, then lifts away in two layers to reveal the hero.
// Skipped entirely for visitors who prefer reduced motion.
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const done = useRef(onDone)
  done.current = onDone
  const [skip] = useState(reducedMotion)
  const [gone, setGone] = useState(skip)

  useLayoutEffect(() => {
    if (skip) {
      done.current()
      return
    }
    let alive = true
    const ctx = gsap.context(() => {
      const count = root.current.querySelector('.preloader__count')
      const city = root.current.querySelector('.preloader__city')
      const state = { v: 0 }
      const load = gsap.timeline()
        .to(state, {
          v: 100, duration: 1.6, ease: 'power3.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(state.v)).padStart(3, '0')
            city.textContent = offices[Math.min(offices.length - 1, Math.floor((state.v / 100) * offices.length))].city
          },
        })
        .to('.preloader__bar span', { scaleX: 1, duration: 1.6, ease: 'power3.inOut' }, 0)
        .from('.preloader__top > *', { yPercent: 120, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0)

      // The three words are stacked in a reel that steps up through a one-line window.
      const line = 100 / 3
      load.fromTo('.preloader__reel', { yPercent: line, autoAlpha: 1 }, { yPercent: 0, duration: 0.55, ease: 'expo.out' }, 0)
        .to('.preloader__reel', { yPercent: -line, duration: 0.55, ease: 'expo.inOut' }, 0.5)
        .to('.preloader__reel', { yPercent: -2 * line, duration: 0.55, ease: 'expo.inOut' }, 1.05)

      const fonts = Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2500))])
      Promise.all([fonts, load.then()]).then(() => {
        if (!alive) return
        ctx.add(() => {
          gsap.timeline({ onComplete: () => setGone(true) })
            .to('.preloader__inner', { y: -40, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
            .to('.preloader__panel--front', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
            .to('.preloader__panel--back', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<0.12')
            .add(() => done.current(), '<0.25')
        })
      })
    }, root)
    return () => {
      alive = false
      ctx.revert()
    }
  }, [skip])

  if (gone) return null
  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__panel preloader__panel--back" />
      <div className="preloader__panel preloader__panel--front">
        <div className="preloader__inner wrap">
          <div className="preloader__top">
            <Logo />
            <span>IT consultancy · since {company.founded}</span>
          </div>
          <p className="preloader__words">
            <span className="preloader__reel"><span>Plan.</span><span>Build.</span><span>Run.</span></span>
          </p>
          <div className="preloader__bottom">
            <p>
              <span className="preloader__label">Connecting offices</span>
              <span className="preloader__city">{offices[0].city}</span>
            </p>
            <span className="preloader__count">000</span>
          </div>
          <div className="preloader__bar"><span /></div>
        </div>
      </div>
    </div>
  )
}
