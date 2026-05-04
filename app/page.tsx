import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Portfolio from '@/components/Portfolio'
import MeetingCTA from '@/components/MeetingCTA'
import About from '@/components/About'
import LimitedSpots from '@/components/LimitedSpots'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <Portfolio />
      <MeetingCTA />
      <About />
      <LimitedSpots />
      <Footer />
    </main>
  )
}
