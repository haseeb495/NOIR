const items = ['Timepieces', 'Fragrances', 'Audio', 'Eyewear', 'Leather', 'Ambience']

export default function Marquee() {
  const loop = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-gold/15 py-5">
      <div className="marquee-track inline-block whitespace-nowrap">
        {loop.map((it, i) => (
          <span key={i} className="mx-8 font-serif text-2xl tracking-wide text-taupe">
            {it} <span className="text-gold">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
