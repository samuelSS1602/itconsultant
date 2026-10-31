import { useState } from 'react'
import { services, offices, company } from '../data.js'
import { sendForm } from '../hooks.js'
import { gsap, finePointer, useMotion } from '../motion.js'
import SplitWords from './SplitWords.jsx'
import Button from './Button.jsx'

const budgets = ['Under $15,000', '$15,000 – $50,000', '$50,000 – $150,000', 'Over $150,000', 'Not sure yet']
const empty = { name: '', email: '', company: '', country: '', service: '', budget: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [errors, setErrors] = useState({})

  // The section opens out from a rounded card to full width, and a soft light follows the mouse.
  const scope = useMotion((root) => {
    gsap.fromTo(root,
      { clipPath: 'inset(0% 3% 0% 3% round 48px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 25%', scrub: true } })
    if (!finePointer()) return
    const spot = root.querySelector('.contact__spot')
    gsap.set(spot, { xPercent: -50, yPercent: -50, x: root.offsetWidth * 0.7, y: 260 })
    const xTo = gsap.quickTo(spot, 'x', { duration: 1.2, ease: 'power3' })
    const yTo = gsap.quickTo(spot, 'y', { duration: 1.2, ease: 'power3' })
    const move = (e) => {
      const r = root.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
    }
    root.addEventListener('pointermove', move)
    return () => root.removeEventListener('pointermove', move)
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter an email address like name@company.com.'
    if (form.message.trim().length < 10) e.message = 'Tell us a little about your project (10 characters or more).'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus()
      return
    }
    const sent = {
      state: 'sent',
      message: `Thanks, ${form.name.trim().split(/\s+/)[0]}. A senior consultant will reply to ${form.email.trim()} within one business day.`,
    }
    // The hidden spam-trap box is only ever ticked by bots: act as if it worked and send nothing.
    if (ev.currentTarget.elements.botcheck.checked) return setStatus(sent)
    setStatus({ state: 'sending', message: '' })
    const res = await sendForm(`New enquiry from ${form.name.trim()}`, form)
    if (res.viaEmailApp) {
      setStatus({ state: 'sent', viaEmailApp: true }) // the form keeps its contents in case no email app opened
    } else if (res.ok) {
      setStatus(sent)
      setForm(empty)
    } else {
      setStatus({ state: 'error', message: res.error })
    }
  }

  const field = (k, label, props = {}) => (
    <div className={`field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input
        id={`f-${k}`}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        {...props}
      />
      {errors[k] && <p className="field__error" id={`e-${k}`}>{errors[k]}</p>}
    </div>
  )

  return (
    <section className="contact" id="contact" ref={scope}>
      <div className="contact__spot" aria-hidden="true" />
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <p className="eyebrow" data-reveal><span>06</span>Contact</p>
          <h2 className="h2" data-split><SplitWords text="Tell us what you’re working on." /></h2>
          <p className="intro" data-reveal>
            A senior consultant replies within one business day. The first 30-minute call is free,
            and we’re happy to sign an NDA first.
          </p>
          <dl className="contact__direct">
            <div data-reveal><dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
            <div data-reveal><dt>Phone</dt><dd><a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a></dd></div>
          </dl>
          <ul className="contact__offices">
            {offices.map((o) => (
              <li key={o.city} data-reveal><strong>{o.city}</strong><span>{o.address}</span></li>
            ))}
          </ul>
        </div>

        <div className="contact__form" data-reveal>
          {status.state === 'sent' ? (
            <div className="form form--done" role="status">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="22" pathLength="1" />
                <path d="M14 25l7 7 13-15" pathLength="1" />
              </svg>
              <h3>{status.viaEmailApp ? 'Check your email app' : 'Message sent'}</h3>
              <p>
                {status.viaEmailApp
                  ? <>We’ve opened a new email to <a href={`mailto:${company.email}`}>{company.email}</a> with your message in it. Press send there and we’ll reply within one business day.</>
                  : status.message}
              </p>
              <Button variant="ghost" onClick={() => setStatus({ state: 'idle', message: '' })}>
                {status.viaEmailApp ? 'Back to the form' : 'Send another message'}
              </Button>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              <div className="form__row">
                {field('name', 'Your name', { autoComplete: 'name' })}
                {field('email', 'Work email', { type: 'email', autoComplete: 'email' })}
              </div>
              <div className="form__row">
                {field('company', 'Company (optional)', { autoComplete: 'organization' })}
                {field('country', 'Country (optional)', { autoComplete: 'country-name' })}
              </div>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-service">What do you need help with?</label>
                  <select id="f-service" value={form.service} onChange={set('service')}>
                    <option value="">Choose a service</option>
                    {services.map((s) => <option key={s.id}>{s.name}</option>)}
                    <option>Something else</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="f-budget">Estimated budget</label>
                  <select id="f-budget" value={form.budget} onChange={set('budget')}>
                    <option value="">Choose a range</option>
                    {budgets.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className={`field ${errors.message ? 'has-error' : ''}`}>
                <label htmlFor="f-message">About your project</label>
                <textarea
                  id="f-message"
                  rows="5"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="What are you trying to achieve, and by when?"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'e-message' : undefined}
                />
                {errors.message && <p className="field__error" id="e-message">{errors.message}</p>}
              </div>
              {/* Spam trap: hidden from people, but bots tend to tick every box they find. */}
              <input type="checkbox" name="botcheck" className="botcheck" tabIndex={-1} aria-hidden="true" />
              {status.state === 'error' && <p className="form__error" role="alert">{status.message}</p>}
              <Button className="btn--wide" arrow disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Sending…' : 'Send message'}
              </Button>
              <p className="form__note">We only use your details to reply to you. No newsletters unless you ask.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
