import { useState } from 'react'
import { services } from '../data.js'
import SplitWords from './SplitWords.jsx'

export default function Services() {
  const [openId, setOpenId] = useState(services[0].id)

  return (
    <section className="section services" id="services">
      <div className="wrap split">
        <div className="split__intro">
          <p className="eyebrow" data-reveal><span>01</span>Services</p>
          <h2 className="h2" data-split><SplitWords text="What we do" /></h2>
          <p className="intro" data-reveal>
            Six services, one team. Start with one, or let us handle the whole stack —
            every project has a single lead who answers for the result.
          </p>
          <a href="#contact" className="text-link" data-reveal>Not sure what you need? Ask us</a>
        </div>

        <ul className="services__list">
          {services.map((s, i) => {
            const open = openId === s.id
            return (
              <li key={s.id} className={`service ${open ? 'is-open' : ''}`} data-draw="">
                <h3>
                  <button
                    className="service__head"
                    aria-expanded={open}
                    aria-controls={`svc-${s.id}`}
                    onClick={() => setOpenId(open ? null : s.id)}
                  >
                    <span className="service__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="service__name">{s.name}</span>
                    <span className="service__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`svc-${s.id}`} className="service__panel" role="region" aria-label={s.name}>
                  <div className="service__inner">
                    <p className="service__summary">{s.summary}</p>
                    <ul className="service__includes">
                      {s.includes.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                    <dl className="service__meta">
                      <div><dt>Typical timeline</dt><dd>{s.timeline}</dd></div>
                      <div><dt>Budget</dt><dd>{s.from}</dd></div>
                    </dl>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
