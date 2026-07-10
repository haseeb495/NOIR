import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        setOrders(data || [])
        setLoading(false)
      })
  }, [user])

  if (loading) return <p className="mx-auto max-w-4xl px-6 py-24 text-taupe">Loading…</p>

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-10 font-serif text-5xl">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-taupe">No orders yet. They will appear here after checkout.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {orders.map((o) => (
            <li key={o.id} className="py-5">
              <p className="font-serif text-xl">Order #{o.id}</p>
              <p className="text-sm text-taupe">
                Rs. {(o.total / 100).toLocaleString('en-PK')} · {o.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
