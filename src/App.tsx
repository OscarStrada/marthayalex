import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from './components/HeroSection'
import ThreeBackground from './components/ThreeBackground'
import CountdownTimer from './components/CountdownTimer'
import OurStory from './components/OurStory'
import EventDetails from './components/EventDetails'
import Gallery from './components/Gallery'
import LocationSection from './components/LocationSection'
import RSVPForm from './components/RSVPForm'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    ScrollTrigger.refresh()
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <main style={{ backgroundColor: '#F5EDE3', minHeight: '100vh' }}>
      <ThreeBackground />
      <HeroSection />
      <CountdownTimer />
      <OurStory />
      <Gallery />
      <EventDetails />
      <LocationSection />
      <RSVPForm />
      <Footer />
    </main>
  )
}
