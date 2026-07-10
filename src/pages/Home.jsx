import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import ProductCarousel from '../components/ProductCarousel'
import Reveal from '../components/Reveal'

export default function Home() {
  return (
    <div>
      <Hero />
      <Marquee />
      <ProductCarousel title="The Timepieces Edit" category="timepieces" />
      <ProductCarousel title="Fragrances" category="fragrances" />

      {/* atmospheric band */}
      <section className="relative my-10 overflow-hidden border-y border-gold/15 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(500px 300px at 50% 50%, rgba(200,163,91,0.10), transparent 70%)',
          }}
        />
        <Reveal>
          <p className="relative text-[12px] uppercase tracking-wide2 text-gold">Maison NOIR</p>
          <h2 className="relative mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            Quietly made for those who already know.
          </h2>
        </Reveal>
      </section>

      <ProductCarousel title="Audio" category="audio" />
      <ProductCarousel title="Eyewear" category="eyewear" />
    </div>
  )
}
