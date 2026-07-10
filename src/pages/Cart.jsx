import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { items, removeItem, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    // Hybrid model: must be signed in to pay. Send guests to login,
    // then bring them back to the cart.
    if (!user) {
      navigate('/login?redirect=/cart')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          userId: user.id,
          email: user.email,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Could not start checkout.')
      }
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h1 className="font-serif text-4xl">Your cart is empty</h1>
        <Link
          to="/"
          className="mt-6 inline-block text-[12px] uppercase tracking-luxe text-gold hover:text-goldsoft"
        >
          Browse the collection →
        </Link>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-10 font-serif text-5xl">Your Cart</h1>
      <ul className="divide-y divide-white/10">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-5 py-6">
            <img src={i.image_url} alt={i.name} className="h-20 w-20 flex-shrink-0 object-cover" />
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-luxe text-gold">{i.category}</div>
              <p className="font-serif text-xl">{i.name}</p>
              <p className="text-sm text-taupe">
                Rs. {(i.price / 100).toLocaleString('en-PK')} × {i.qty}
              </p>
            </div>
            <button
              onClick={() => removeItem(i.id)}
              className="text-[11px] uppercase tracking-luxe text-taupe transition-colors hover:text-bone"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      <div className="mt-10 flex items-center justify-between border-t border-gold/15 pt-8">
        <span className="font-serif text-2xl">
          Total: Rs. {(total / 100).toLocaleString('en-PK')}
        </span>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="group relative overflow-hidden border border-gold px-9 py-4 text-[12px] uppercase tracking-luxe disabled:opacity-50"
        >
          <span className="relative z-10 transition-colors group-hover:text-obsidian">
            {loading ? 'Redirecting…' : user ? 'Checkout' : 'Sign in to checkout'}
          </span>
          <span className="absolute inset-0 z-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0" />
        </button>
      </div>
    </div>
  )
}
