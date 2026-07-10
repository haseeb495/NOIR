import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error)
        setProduct(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="mx-auto max-w-7xl px-6 py-24 text-taupe">Loading…</p>
  if (!product)
    return <p className="mx-auto max-w-7xl px-6 py-24 text-taupe">Product not found.</p>

  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock < 5

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative overflow-hidden border border-white/5 bg-charcoal2"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className={`h-full w-full object-cover ${outOfStock ? 'grayscale' : ''}`}
        />
        {outOfStock && (
          <div className="absolute left-4 top-4 border border-white/30 bg-obsidian/80 px-4 py-1.5 text-[11px] uppercase tracking-luxe text-bone backdrop-blur-sm">
            Out of stock
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="text-[12px] uppercase tracking-luxe text-gold">{product.category}</div>
        <h1 className="mt-3 font-serif text-5xl">{product.name}</h1>
        <div className="mt-4 text-2xl text-bone">
          Rs. {(product.price / 100).toLocaleString('en-PK')}
        </div>

        {lowStock && (
          <p className="mt-3 text-[12px] uppercase tracking-luxe text-gold">
            Only {String(product.stock).padStart(2, '0')} left in stock
          </p>
        )}

        <p className="mt-6 max-w-md leading-loose text-taupe">{product.description}</p>

        {outOfStock ? (
          <div className="mt-9 inline-block border border-white/15 px-9 py-4 text-[12px] uppercase tracking-luxe text-taupe">
            Out of stock
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="group relative mt-9 overflow-hidden border border-gold px-9 py-4 text-[12px] uppercase tracking-luxe"
          >
            <span className="relative z-10 transition-colors group-hover:text-obsidian">
              Add to cart
            </span>
            <span className="absolute inset-0 z-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0" />
          </button>
        )}
      </motion.div>
    </div>
  )
}
