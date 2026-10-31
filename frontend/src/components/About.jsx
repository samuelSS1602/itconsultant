import { useState } from 'react'
import { stats, team, testimonials, company } from '../data.js'
import SplitWords from './SplitWords.jsx'

const initials = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('')

export default function About() {
  const [i, setI] = useState(0)
  const t = testimonials[i]
  const go = (d) => setI((i + d + testimonials.length) % testimonials.length)

  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about__top">
          <div>
            <p className="eyebrow" data-reveal><span>04</span>About us</p>
            <h2 className="h2" data-split><SplitWords text={`Senior people, plain answers, since ${company.founded}.`} /></h2>
          </div>
          <div className="about__copy">
            <p className="about__lead" data-fill>
              <SplitWords text="XYZ started as three engineers who were tired of consultancies that sell big teams and deliver slides. Today we’re 180 people across six offices — and we still put senior engineers on every project, write in plain language and tell clients when something isn’t worth building." />
            </p>
            <p data-reveal>
              We’re certified partners of AWS, Microsoft Azure and Google Cloud, and hold ISO 27001
              and SOC 2 Type II certification.
            </p>
          </div>
        </div>

        <dl className="stats" data-draw="">
          {stats.map((s) => (
            <div key={s.label} className="stat" data-reveal>
              <dt>{s.label}</dt>
              <dd>
                <span aria-hidden="true" data-count={s.value}>{s.value}</span>
                <span className="sr-only">{s.value}</span>
              </dd>
            </div>
          ))}
        </dl>

        <figure className="quote" aria-live="polite" data-reveal>
          {/* Keyed so each new quote remounts and its words rise in again. */}
          <blockquote key={i} className="quote__text">
            <p><SplitWords text={`“${t.quote}”`} /></p>
          </blockquote>
          <figcaption>
            <span className="avatar" aria-hidden="true" key={`a${i}`}>{initials(t.name)}</span>
            <span className="quote__who" key={`w${i}`}><strong>{t.name}</strong><br />{t.role}</span>
            <span className="quote__nav">
              <button onClick={() => go(-1)} aria-label="Previous testimonial" data-magnetic="">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <span className="quote__count">{i + 1} / {testimonials.length}</span>
              <button onClick={() => go(1)} aria-label="Next testimonial" data-magnetic="">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </span>
          </figcaption>
        </figure>

        <div className="team">
          <h3 className="h3" data-reveal>Leadership</h3>
          <ul className="team__list">
            {team.map((m, idx) => (
              <li key={m.name} className="person" data-reveal>
                <span className={`person__photo tone-${idx}`} aria-hidden="true"><span>{initials(m.name)}</span></span>
                <strong>{m.name}</strong>
                <span>{m.role}</span>
                <span className="person__base">Based in {m.base}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
