import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Hours from './components/Hours'
import InstagramFollow from './components/InstagramFollow'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Hours />
      <InstagramFollow />
      <Footer />
    </main>
  )
}