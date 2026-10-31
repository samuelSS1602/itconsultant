import { useEffect, useState } from 'react'
import { company } from './data.js'

// Current time, refreshed every 20 seconds (enough for minute-level clocks).
export function useNow(interval = 20000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

// Local time and open/closed status for an office time zone.
export function officeTime(now, tz) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
  }).formatToParts(now)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const hour = parseInt(get('hour'), 10) % 24
  const weekday = get('weekday')
  const isWeekend = weekday === 'Sat' || weekday === 'Sun'
  const open = !isWeekend && hour >= 9 && hour < 18
  return { time: `${get('hour') === '24' ? '00' : get('hour')}:${get('minute')}`, weekday, open }
}

// True while the page is scrolled past `offset` pixels.
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

// True while the visitor scrolls down past `offset` pixels; false as soon as they scroll back up.
export function useHideOnScroll(offset = 480) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > offset && y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return hidden
}

// Send a form through Web3Forms (https://web3forms.com), which emails it to you, so the site needs no server.
// Until an access key is set (company.formKey in data.js), it opens the visitor's email app with the
// details filled in instead. Returns { ok, viaEmailApp, error }.
export async function sendForm(subject, fields) {
  const filled = Object.entries(fields).filter(([, value]) => value)
  if (!company.formKey) {
    const body = filled.map(([key, value]) => `${key[0].toUpperCase()}${key.slice(1)}: ${value}`).join('\n')
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return { ok: true, viaEmailApp: true }
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: company.formKey, subject, ...Object.fromEntries(filled) }), // `email` becomes the reply-to address
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.success) return { ok: true }
    return {
      ok: false,
      error: res.status === 429
        ? 'Too many messages in a short time. Try again in a few minutes, or email us directly.'
        : 'Your message couldn’t be sent. Try again, or email us directly.',
    }
  } catch {
    return { ok: false, error: 'Couldn’t reach the server. Check your connection, or email us directly.' }
  }
}
