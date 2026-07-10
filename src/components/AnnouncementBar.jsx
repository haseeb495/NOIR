const messages = [
  'Complimentary shipping on orders above Rs. 5,000',
  '15-day hassle-free returns',
  'Authenticity guaranteed on every piece',
]

export default function AnnouncementBar() {
  return (
    <div className="border-b border-gold/15 bg-obsidian">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-6 py-2.5 text-[11px] uppercase tracking-luxe text-taupe">
        {messages.map((m, i) => (
          <span key={i} className={i === 0 ? '' : 'hidden md:inline'}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
