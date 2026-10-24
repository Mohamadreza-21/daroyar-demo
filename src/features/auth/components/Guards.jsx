import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../store/authStore'
import ErrorState from '../../../shared/components/feedback/ErrorState'

export function RequireAuth() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}

export function RequireAdmin() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== 'admin') return <ErrorState status={403} />
  return <Outlet />
}

export function CustomerOnly() {
  const user = useAuthStore((s) => s.user)
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return <Outlet />
}
