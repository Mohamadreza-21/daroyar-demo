import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { Toaster } from 'sonner'
import { useSessionSync } from '../../../features/auth/hooks/useAuthActions'
import RouteAnnouncer from './RouteAnnouncer'

export default function RootShell() {
  useSessionSync()
  useEffect(() => {
    const boot = document.getElementById('boot')
    if (!boot) return undefined
    boot.classList.add('is-hidden')
    const id = setTimeout(() => boot.remove(), 600)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      <Outlet />
      <RouteAnnouncer />
      <Toaster
        position="top-center"
        dir="rtl"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: 'var(--font-sans)' } }}
      />
      <ScrollRestoration />
    </>
  )
}
