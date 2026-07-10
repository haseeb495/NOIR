import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('category', slug)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        setProducts(data || [])
        setLoading(false)
      })
  }, [slug])

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-[12px] uppercase tracking-wide2 text-gold">Collection</p>
      <h1 className="mt-3 font-serif text-5xl capitalize md:text-6xl">{slug}</h1>

      {loading ? (
        <p className="mt-10 text-taupe">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-10 text-taupe">Nothing here yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
