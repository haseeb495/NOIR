import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const categories = ['Timepieces', 'Fragrances', 'Audio', 'Eyewear']

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/login')
  }

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled || open ? 'rgba(11,11,13,0.95)' : 'rgba(11,11,13,0)',
        paddingTop: scrolled ? 14 : 24,
        paddingBottom: scrolled ? 14 : 24,
      }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 border-b border-gold/15 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" onClick={() => setOpen(false)} className="font-serif text-2xl font-medium tracking-wide2">
          NOIR
        </Link>

        {/* desktop category nav */}
        <nav className="hidden items-center gap-9 text-[12px] uppercase tracking-luxe text-taupe md:flex">
          {categories.map((c) => (
            <Link key={c} to={`/category/${c.toLowerCase()}`} className="transition-colors hover:text-goldsoft">
              {c}
            </Link>
          ))}
        </nav>

        {/* desktop right side */}
        <div className="hidden items-center gap-6 text-[12px] uppercase tracking-luxe text-taupe md:flex">
          <Link to="/cart" className="transition-colors hover:text-goldsoft">
            Cart ({count})
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="transition-colors hover:text-goldsoft">
                  Admin
                </Link>
              )}
              <Link to="/orders" className="transition-colors hover:text-goldsoft">
                Orders
              </Link>
              <button onClick={handleSignOut} className="transition-colors hover:text-goldsoft">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="transition-colors hover:text-goldsoft">
              Sign in
            </Link>
          )}
        </div>

        {/* mobile: cart + hamburger */}
        <div className="flex items-center gap-5 md:hidden">
          <Link to="/cart" className="text-[12px] uppercase tracking-luxe text-taupe">
            Cart ({count})
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-6 w-7 flex-col justify-center gap-[5px]"
          >
            <span className={`h-px w-full bg-bone transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`h-px w-full bg-bone transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-px w-full bg-bone transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 text-[13px] uppercase tracking-luxe text-taupe">
              {categories.map((c) => (
                <Link
                  key={c}
                  to={`/category/${c.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-goldsoft"
                >
                  {c}
                </Link>
              ))}
              <div className="my-1 h-px w-full bg-gold/15" />
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="transition-colors hover:text-goldsoft">
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setOpen(false)} className="transition-colors hover:text-goldsoft">
                    Orders
                  </Link>
                  <button onClick={handleSignOut} className="text-left transition-colors hover:text-goldsoft">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="transition-colors hover:text-goldsoft">
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
