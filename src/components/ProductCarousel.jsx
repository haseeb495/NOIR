import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

// One category row. Pulls products of a given category from Supabase.
export default function ProductCarousel({ title, category }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (error) console.error(error)
        setProducts(data || [])
      })
  }, [category])

  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
          <Link
            to={`/category/${category}`}
            className="text-[12px] uppercase tracking-luxe text-gold transition-colors hover:text-goldsoft"
          >
            View all →
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
