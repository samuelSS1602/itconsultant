import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

// Decorative motion only runs for visitors who haven't asked their device to reduce it.
export const MOTION = '(prefers-reduced-motion: no-preference)'
const matches = (query) => window.matchMedia(query).matches
export const reducedMotion = () => matches('(prefers-reduced-motion: reduce)')
export const finePointer = () => matches('(hover: hover) and (pointer: fine)')

// The smooth-scroll instance. Null until the app has mounted.
export let lenis = null

// Runs GSAP code only while `query` matches, with selectors scoped to the returned ref.
// Everything it creates is reverted on unmount, when deps change or when the query stops matching.
export function useMotion(setup, deps = [], query = MOTION) {
  const scope = useRef(null)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(query, (context) => setup(scope.current, context), scope.current)
    return () => mm.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return scope
}

// Smooth scrolling, scroll-driven reveals, magnetic buttons and in-page links. Returns a cleanup function.
export function startMotion() {
  // Lenis turns its own smoothing off for reduced-motion visitors. allowNestedScroll lets
  // scrollable boxes (a long message in the textarea) scroll natively when they can.
  lenis = new Lenis({ lerp: 0.1, allowNestedScroll: true })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  document.addEventListener('click', onAnchorClick)
  const stopMagnetic = magnetic()
  const stopRefresh = refreshOnResize()
  const mm = gsap.matchMedia()
  mm.add(MOTION, reveals)
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return () => {
    mm.revert()
    stopMagnetic()
    stopRefresh()
    document.removeEventListener('click', onAnchorClick)
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

// Declarative scroll animations, driven by data attributes in the components.
function reveals() {
  // data-split: headings built with <SplitWords>; each word rises out of its own mask.
  gsap.utils.toArray('[data-split]').forEach((el) => {
    gsap.from(el.querySelectorAll('.sw > span'), {
      yPercent: 115, rotate: 5, duration: 1.2, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  // data-reveal: blocks fade up; siblings that share a parent follow one another.
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'))
    gsap.from(el, {
      y: 48, autoAlpha: 0, duration: 1.1, ease: 'expo.out',
      delay: (siblings.indexOf(el) % 6) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })

  // data-fill: a paragraph lights up word by word as it scrolls through the window.
  gsap.utils.toArray('[data-fill]').forEach((el) => {
    gsap.fromTo(el.querySelectorAll('.sw'), { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true },
    })
  })

  // data-draw: hairlines (drawn with a --draw scale in CSS) extend from the left.
  gsap.utils.toArray('[data-draw]').forEach((el) => {
    gsap.fromTo(el, { '--draw': 0 }, {
      '--draw': 1, duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
  })

  // data-count: numbers count up, keeping a prefix or suffix such as "+" or "%".
  const counters = gsap.utils.toArray('[data-count]').map((el) => {
    const [, pre = '', num = '', post = ''] = el.dataset.count.match(/^(\D*)([\d.,]+)(.*)$/) || []
    const end = parseFloat(num.replace(/,/g, ''))
    const text = el.firstChild // update the text node in place so React keeps its reference
    if (!text || Number.isNaN(end)) return null
    const decimals = (num.split('.')[1] || '').length
    const format = (v) => pre + (num.includes(',') ? Math.round(v).toLocaleString('en-US') : v.toFixed(decimals)) + post
    const state = { v: 0 }
    text.nodeValue = format(0)
    gsap.to(state, {
      v: end, duration: 2.2, ease: 'power3.out',
      onUpdate: () => { text.nodeValue = format(state.v) },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
    return () => { text.nodeValue = el.dataset.count }
  })

  // data-speed: gentle parallax against the scroll.
  gsap.utils.toArray('[data-speed]').forEach((el) => {
    const amount = () => window.innerHeight * (parseFloat(el.dataset.speed) || 0.1)
    gsap.fromTo(el, { y: () => amount() / 2 }, {
      y: () => -amount() / 2, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    })
  })

  // Reading-progress bar along the top of the window.
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

  return () => counters.forEach((restore) => restore?.())
}

// Buttons lean towards the cursor, and their hover fill grows from where the cursor came in.
function magnetic() {
  if (!finePointer() || reducedMotion()) return () => {}
  const bound = new WeakSet()
  const clamp = gsap.utils.clamp(-14, 14)

  const bind = (el) => {
    bound.add(el)
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    let rect = el.getBoundingClientRect()
    const origin = (e) => {
      el.style.setProperty('--x', `${e.clientX - rect.left}px`)
      el.style.setProperty('--y', `${e.clientY - rect.top}px`)
    }
    el.addEventListener('pointerenter', (e) => { rect = el.getBoundingClientRect(); origin(e) })
    el.addEventListener('pointermove', (e) => {
      xTo(clamp((e.clientX - rect.left - rect.width / 2) * 0.3))
      yTo(clamp((e.clientY - rect.top - rect.height / 2) * 0.3))
    })
    el.addEventListener('pointerleave', (e) => { origin(e); xTo(0); yTo(0) })
  }

  // Bound lazily on first hover (pointerover fires just before pointerenter), so buttons rendered later work too.
  const onOver = (e) => {
    const el = e.target.closest?.('[data-magnetic]')
    if (el && !bound.has(el)) bind(el)
  }
  document.addEventListener('pointerover', onOver)
  return () => document.removeEventListener('pointerover', onOver)
}

// In-page links glide to their section, then move keyboard focus there too.
function onAnchorClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const link = e.target.closest?.('a[href^="#"]')
  const id = link?.getAttribute('href').slice(1)
  const target = id && document.getElementById(id)
  if (!target || !lenis) return
  e.preventDefault()
  // Links inside the mobile menu or a dialog also close it, so scrolling can resume straight away
  // (while paused, the page is overflow: clip and can't be scrolled at all).
  lenis.start()
  lenis.scrollTo(target, {
    duration: 1.4,
    onComplete: () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    },
  })
}

// ScrollTrigger only re-measures on window resize, but accordions, filters and fonts change the page height too.
function refreshOnResize() {
  let height = document.documentElement.scrollHeight
  let timer
  const ro = new ResizeObserver(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (Math.abs(document.documentElement.scrollHeight - height) < 2) return
      ScrollTrigger.refresh()
      height = document.documentElement.scrollHeight
    }, 200)
  })
  ro.observe(document.body)
  return () => { ro.disconnect(); clearTimeout(timer) }
}
