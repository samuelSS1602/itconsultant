import { useEffect, useState } from 'react'
import { nav } from '../data.js'
import { useHideOnScroll, useScrolled } from '../hooks.js'
import { lenis } from '../motion.js'
import Logo from './Logo.jsx'
import Button from './Button.jsx'

export default function Nav() {
  const scrolled = useScrolled()
  const hidden = useHideOnScroll()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Highlight the link for the section in the middle of the window.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -54% 0px' },
    )
    ;['#top', ...nav.map((n) => n.href), '#contact'].forEach((href) => {
      const el = document.querySelector(href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''} ${hidden && !open ? 'nav--hidden' : ''}`}>
      <div className="nav__inner wrap">
        <a href="#top" className="nav__logo" aria-label="XYZ home">
          <Logo />
        </a>
        <nav className="nav__links" aria-label="Main">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={active === item.href ? 'is-active' : ''}>
              <span className="roll"><span>{item.label}</span></span>
            </a>
          ))}
        </nav>
        <Button href="#contact" variant="light" className="nav__cta">Book a call</Button>
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span /><span />
        </button>
      </div>
      <div id="mobile-menu" className="nav__sheet" hidden={!open} data-lenis-prevent="">
        {nav.map((item, i) => (
          <a key={item.href} href={item.href} onClick={close} style={{ '--i': i }}>
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{item.label}
          </a>
        ))}
        <Button href="#contact" variant="light" onClick={close}>Book a call</Button>
      </div>
    </header>
  )
}
