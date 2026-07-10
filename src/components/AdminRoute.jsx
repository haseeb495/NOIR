import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, isAdmin, role, loading } = useAuth()
  if (loading) return <div className="p-12 text-center text-taupe">Loading…</div>
  if (!user) return <Navigate to="/login?redirect=/admin" replace />
  if (role === null) return <div className="p-12 text-center text-taupe">Loading…</div>
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
