import { useState } from 'react'
import { nav, services, company } from '../data.js'
import { sendForm } from '../hooks.js'
import { gsap, useMotion } from '../motion.js'
import Logo from './Logo.jsx'
import Button from './Button.jsx'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState({ ok: null, text: '' })

  // The giant wordmark rises letter by letter as the footer scrolls into view.
  const scope = useMotion(() => {
    gsap.from('.footer__mark span', {
      yPercent: 100, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: '.footer__mark', start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  })

  const subscribe = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg({ ok: false, text: 'Enter an email address like name@company.com.' })
      return
    }
    const res = await sendForm('Newsletter sign-up', { email })
    if (res.viaEmailApp) setMsg({ ok: true, text: 'Your email app should now open. Press send there to subscribe.' })
    else if (res.ok) { setMsg({ ok: true, text: 'Subscribed. The next issue arrives at the start of the month.' }); setEmail('') }
    else setMsg({ ok: false, text: res.error })
  }

  return (
    <footer className="footer" ref={scope}>
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__news">
            <h2 className="h3">One useful email a month</h2>
            <p>Practical notes on cloud, software and data. No sales pitches.</p>
            <form onSubmit={subscribe} className="news" noValidate>
              <label htmlFor="news-email" className="sr-only">Email address</label>
              <input id="news-email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <Button variant="light">Subscribe</Button>
            </form>
            {msg.text && <p className={`news__msg ${msg.ok ? 'is-ok' : 'is-err'}`} role="status">{msg.text}</p>}
          </div>
          <nav className="footer__cols" aria-label="Footer">
            <div>
              <h3>Company</h3>
              {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h3>Services</h3>
              {services.map((s) => <a key={s.id} href="#services">{s.name}</a>)}
            </div>
            <div>
              <h3>Get in touch</h3>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a>
              <a href="#contact">Office addresses</a>
            </div>
          </nav>
        </div>
        <p className="footer__mark" aria-hidden="true">
          {company.name.toLowerCase().split('').map((ch, i) => <span key={i}>{ch}</span>)}
        </p>
        <div className="footer__bottom">
          <Logo size={24} />
          <span>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</span>
          <span className="footer__legal">
            <a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Cookies</a>
            <a href="#top" className="footer__top-link">Back to top <span aria-hidden="true">↑</span></a>
          </span>
        </div>
      </div>
    </footer>
  )
}
