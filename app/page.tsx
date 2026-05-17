import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ValueProp from '@/components/ValueProp'
import Services from '@/components/Services'
import Features from '@/components/Features'
import MeetingCTA from '@/components/MeetingCTA'
import About from '@/components/About'
import LimitedSpots from '@/components/LimitedSpots'
import Footer from '@/components/Footer'
import BubbleBackground from '@/components/BubbleBackground'

export default function Home() {
  return (
    <main className="site-bubble-background">
      <BubbleBackground aria-hidden="true" />
      <Nav />
      <Hero />
      <ValueProp />
      <Services />
      <Features />
      <MeetingCTA />
      <About />
      <LimitedSpots />
      <Footer />
    </main>
  )
}
