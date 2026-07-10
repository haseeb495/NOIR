// Vercel EDGE function at /api/webhook.
// Runs on the Edge runtime so we can read the EXACT raw body (req.text()),
// which Stripe needs to verify the signature. The default Node runtime under
// `vercel dev` re-serializes the body and breaks verification.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
})
// Edge uses Web Crypto for signature checks.
const cryptoProvider = Stripe.createSubtleCryptoProvider()

// Service role bypasses Row Level Security. Server-only — never in client code.
function db() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text() // the true raw body
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error('Webhook signature check failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    try {
      await fulfillOrder(event.data.object)
    } catch (err) {
      console.error('Fulfillment error:', err)
      return new Response('Fulfillment failed', { status: 500 })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

async function fulfillOrder(session) {
  const supabase = db()
  const sessionId = session.id

  // Idempotency: if we already saved this session, do nothing.
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()
  if (existing) {
    console.log('Order already saved for', sessionId)
    return
  }

  const userId = session.client_reference_id
  let cart = []
  try {
    cart = JSON.parse(session.metadata?.cart || '[]') // [[id, qty], ...]
  } catch {
    cart = []
  }
  if (cart.length === 0) {
    console.warn('No cart on session', sessionId)
    return
  }

  const ids = cart.map(([id]) => id)
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('id, name, price, category')
    .in('id', ids)
  if (pErr) throw pErr

  const items = cart.map(([id, qty]) => {
    const p = products.find((pr) => pr.id === id)
    if (!p) throw new Error(`Product not found: ${id}`)
    return { product_id: p.id, name: p.name, price: p.price, qty }
  })
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const { data: order, error: oErr } = await supabase
    .from('orders')
    .insert({ user_id: userId, total, status: 'paid', stripe_session_id: sessionId })
    .select()
    .single()
  if (oErr) throw oErr

  const rows = items.map((i) => ({ ...i, order_id: order.id }))
  const { error: iErr } = await supabase.from('order_items').insert(rows)
  if (iErr) throw iErr

  for (const i of items) {
    const { error: sErr } = await supabase.rpc('decrement_stock', {
      p_id: i.product_id,
      p_qty: i.qty,
    })
    if (sErr) console.error('Stock update failed for', i.product_id, sErr.message)
  }

  console.log('Saved order', order.id)
}
