import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else setMessage('Account created. You can sign in now.')
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="text-[12px] uppercase tracking-wide2 text-gold">Join NOIR</p>
      <h1 className="mb-8 mt-3 font-serif text-5xl">Create account</h1>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {message && <p className="mb-4 text-sm text-goldsoft">{message}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 w-full border border-white/15 bg-charcoal px-4 py-3 text-bone outline-none transition-colors placeholder:text-taupe focus:border-gold"
      />
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full border border-white/15 bg-charcoal px-4 py-3 text-bone outline-none transition-colors placeholder:text-taupe focus:border-gold"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="group relative w-full overflow-hidden border border-gold px-8 py-4 text-[12px] uppercase tracking-luxe disabled:opacity-50"
      >
        <span className="relative z-10 transition-colors group-hover:text-obsidian">
          {loading ? 'Creating…' : 'Create account'}
        </span>
        <span className="absolute inset-0 z-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0" />
      </button>
      <p className="mt-6 text-sm text-taupe">
        Have an account?{' '}
        <Link to="/login" className="text-gold hover:text-goldsoft">
          Sign in
        </Link>
      </p>
    </div>
  )
}
