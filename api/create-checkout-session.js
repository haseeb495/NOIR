// Vercel serverless function. Runs at /api/create-checkout-session.
// Locally it runs via `vercel dev` (NOT `npm run dev`).
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// If your Stripe test account ever rejects 'pkr', switch this to 'usd'.
const CURRENCY = 'pkr'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { items, userId, email } = req.body || {}
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Look up prices AND stock server-side. Never trust the browser.
    const ids = items.map((i) => i.id)
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, image_url, stock')
      .in('id', ids)
    if (error) throw error

    // Refuse to oversell: check stock before creating the session.
    for (const i of items) {
      const p = products.find((pr) => pr.id === i.id)
      if (!p) {
        return res.status(400).json({ error: 'A product in your cart no longer exists.' })
      }
      if (p.stock < i.qty) {
        return res.status(400).json({
          error:
            p.stock <= 0
              ? `${p.name} is out of stock.`
              : `Only ${p.stock} of ${p.name} left — please lower the quantity.`,
        })
      }
    }

    const line_items = items.map((i) => {
      const p = products.find((pr) => pr.id === i.id)
      return {
        quantity: i.qty,
        price_data: {
          currency: CURRENCY,
          unit_amount: p.price,
          product_data: {
            name: p.name,
            images: p.image_url ? [p.image_url] : [],
          },
        },
      }
    })

    const origin = req.headers.origin || `https://${req.headers.host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: email || undefined,
      client_reference_id: userId || undefined,
      metadata: { cart: JSON.stringify(items.map((i) => [i.id, i.qty])) },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return res.status(500).json({ error: err.message })
  }
}
