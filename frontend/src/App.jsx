import { useEffect, useState } from 'react'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Services from './components/Services.jsx'
import Work from './components/Work.jsx'
import Process from './components/Process.jsx'
import About from './components/About.jsx'
import Insights from './components/Insights.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { capabilities, clients } from './data.js'
import { lenis, startMotion, ScrollTrigger } from './motion.js'

export default function App() {
  // False while the intro screen is showing; the hero animates in once it lifts.
  const [ready, setReady] = useState(false)

  useEffect(() => startMotion(), [])

  useEffect(() => {
    if (!ready) {
      lenis?.stop()
      return
    }
    lenis?.start()
    ScrollTrigger.refresh()
  }, [ready])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="progress" aria-hidden="true"><span /></div>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <Marquee items={capabilities} variant="big" speed={48} label="Our capabilities" />
        <Services />
        <div className="clients">
          <p className="wrap clients__label">Trusted by teams at</p>
          <Marquee items={clients} variant="logos" reverse speed={60} label="Selected clients" />
        </div>
        <Work />
        <Process />
        <About />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
