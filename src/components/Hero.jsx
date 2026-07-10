import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const lineUp = {
  hidden: { y: '110%' },
  show: (i) => ({
    y: 0,
    transition: { duration: 1, delay: 0.25 + i * 0.14, ease: [0.2, 0.7, 0.2, 1] },
  }),
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient gold glow */}
      <div
        className="glow-drift pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(420px 420px at 70% 35%, rgba(200,163,91,0.16), transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-[1.25fr_0.9fr] md:py-28">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-[12px] uppercase tracking-wide2 text-gold"
          >
            A dark luxury concept store
          </motion.p>

          <h1 className="my-6 font-serif text-6xl font-normal leading-[0.96] md:text-8xl">
            {['Objects of', 'quiet', 'obsession.'].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  custom={i}
                  variants={lineUp}
                  initial="hidden"
                  animate="show"
                  className={`block ${i === 2 ? 'italic text-goldsoft' : ''}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-md text-base leading-loose text-taupe"
          >
            A curated edit of timepieces, fragrances, and finely made things — chosen
            for the few who notice the details everyone else misses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-9 flex items-center gap-5"
          >
            <Link
              to="/category/timepieces"
              className="group relative overflow-hidden border border-gold px-8 py-4 text-[12px] uppercase tracking-luxe"
            >
              <span className="relative z-10 transition-colors group-hover:text-obsidian">
                Explore the collection
              </span>
              <span className="absolute inset-0 z-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0" />
            </Link>
          </motion.div>
        </div>

        {/* floating object */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="relative hidden h-[430px] place-items-center md:grid"
        >
          <div className="spin-slow absolute h-[340px] w-[340px] rounded-full border border-gold/20" />
          <div className="spin-rev absolute h-[260px] w-[260px] rounded-full border border-dashed border-gold/20" />
          <div
            className="float relative h-[360px] w-[170px] rounded-t-[90px] rounded-b-[14px] border border-gold/30"
            style={{
              background: 'linear-gradient(160deg,#23232b 0%,#15151a 55%,#0e0e12 100%)',
              boxShadow: '0 40px 90px rgba(0,0,0,0.6), inset 0 0 60px rgba(200,163,91,0.05)',
            }}
          >
            <div
              className="absolute left-1/2 top-[54px] h-20 w-20 -translate-x-1/2 rounded-full border border-gold/50"
            />
            <div
              className="absolute left-1/2 top-[-26px] h-[30px] w-[54px] -translate-x-1/2 rounded-lg"
              style={{ background: 'linear-gradient(180deg,#E4C98A,#8a6e34)' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
