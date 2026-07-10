import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const categories = ['timepieces', 'fragrances', 'audio', 'eyewear', 'leather', 'ambience']
const empty = { name: '', category: 'timepieces', priceRs: '', stock: '', image_url: '', description: '' }

const inputClass =
  'w-full border border-white/15 bg-charcoal px-4 py-3 text-bone outline-none transition-colors placeholder:text-taupe focus:border-gold'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    setProducts(data || [])
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setError('')
    setForm({
      name: p.name,
      category: p.category || 'timepieces',
      priceRs: String(p.price / 100),
      stock: String(p.stock ?? 0),
      image_url: p.image_url || '',
      description: p.description || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(empty)
    setError('')
  }

  const save = async () => {
    setError('')
    if (!form.name.trim() || form.priceRs === '') {
      setError('Name and price are required.')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Math.round(Number(form.priceRs) * 100), // rupees -> paisa
      stock: Number(form.stock) || 0,
      image_url: form.image_url.trim() || null,
      description: form.description.trim() || null,
    }
    const res = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload)
    setSaving(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    resetForm()
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    load()
  }

  const stockColor = (s) => (s <= 0 ? 'text-red-400' : s < 5 ? 'text-gold' : 'text-taupe')

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-[12px] uppercase tracking-wide2 text-gold">Admin</p>
      <h1 className="mt-3 font-serif text-5xl">Manage Products</h1>

      <div className="mt-10 border border-white/10 bg-charcoal/50 p-6">
        <h2 className="mb-5 font-serif text-2xl">
          {editingId ? 'Edit product' : 'Add a product'}
        </h2>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <input className={inputClass} placeholder="Name" value={form.name} onChange={set('name')} />
          <select className={inputClass} value={form.category} onChange={set('category')}>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-charcoal capitalize">
                {c}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            type="number"
            placeholder="Price in Rs. (e.g. 42000)"
            value={form.priceRs}
            onChange={set('priceRs')}
          />
          <input
            className={inputClass}
            type="number"
            placeholder="Stock (e.g. 8)"
            value={form.stock}
            onChange={set('stock')}
          />

          {/* Image: upload from computer (preferred) or paste a URL */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="h-20 w-20 flex-shrink-0 border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center border border-dashed border-white/15 text-[10px] uppercase tracking-luxe text-taupe">
                  No image
                </div>
              )}
              <div className="flex-1">
                <label className="inline-block cursor-pointer border border-gold px-5 py-2.5 text-[11px] uppercase tracking-luxe transition-colors hover:bg-gold hover:text-obsidian">
                  {uploading ? 'Uploading…' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <input
                  className={`${inputClass} mt-3`}
                  placeholder="…or paste an image URL"
                  value={form.image_url}
                  onChange={set('image_url')}
                />
              </div>
            </div>
          </div>

          <textarea
            className={`${inputClass} md:col-span-2`}
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={set('description')}
          />
        </div>
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving || uploading}
            className="group relative overflow-hidden border border-gold px-8 py-3 text-[12px] uppercase tracking-luxe disabled:opacity-50"
          >
            <span className="relative z-10 transition-colors group-hover:text-obsidian">
              {saving ? 'Saving…' : editingId ? 'Update product' : 'Add product'}
            </span>
            <span className="absolute inset-0 z-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0" />
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-[12px] uppercase tracking-luxe text-taupe transition-colors hover:text-bone"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-12 overflow-x-auto">
        {loading ? (
          <p className="text-taupe">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-[11px] uppercase tracking-luxe text-gold">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {p.image_url && (
                        <img src={p.image_url} alt="" className="h-10 w-10 flex-shrink-0 object-cover" />
                      )}
                      <span className="font-serif text-base text-bone">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize text-taupe">{p.category}</td>
                  <td className="py-3 pr-4 text-taupe">
                    Rs. {(p.price / 100).toLocaleString('en-PK')}
                  </td>
                  <td className={`py-3 pr-4 ${stockColor(p.stock)}`}>
                    {p.stock <= 0 ? 'Out' : p.stock}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => startEdit(p)}
                      className="mr-4 text-[11px] uppercase tracking-luxe text-bone transition-colors hover:text-gold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-[11px] uppercase tracking-luxe text-taupe transition-colors hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
