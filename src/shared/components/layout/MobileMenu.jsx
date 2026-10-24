import { memo, useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, LayoutDashboard, LogOut, User, X } from 'lucide-react'
import { buttonClass, ICON_BTN } from '../common/Button'
import Logo from '../common/Logo'
import { NAV_LINKS, BRAND } from '../../utils/constants'
import { useAuthStore } from '../../../features/auth/store/authStore'
import LogoutDialog from '../../../features/auth/components/LogoutDialog'
import { useUiStore } from '../../store/uiStore'
import { useDialogA11y, useLockBodyScroll } from '../../hooks/useUtils'
import { cn } from '../../utils/format'

const MENU_LINK = 'flex items-center gap-2.5 rounded-[14px] px-4 py-3.5 text-[16px] font-bold'

const MobileMenu = memo(function MobileMenu() {
  const open = useUiStore((s) => s.menuOpen)
  const close = useUiStore((s) => s.closeMenu)
  const user = useAuthStore((s) => s.user)
  const [confirming, setConfirming] = useState(false)
  const { pathname } = useLocation()
  useLockBodyScroll(open)
  const dialogRef = useDialogA11y(open, close)

  useEffect(() => {
    close()
  }, [pathname, close])

  const onLogout = useCallback(() => {
    close()
    setConfirming(true)
  }, [close])
  const closeConfirm = useCallback(() => setConfirming(false), [])

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[110]">
            <motion.div
              className="absolute inset-0 bg-[rgba(10,30,34,0.5)] backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              ref={dialogRef}
              tabIndex={-1}
              className="absolute top-0 bottom-0 start-0 flex w-[min(100%,420px)] flex-col bg-surface shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-label="منوی سایت"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.22, 0.8, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo />
                <button type="button" className={ICON_BTN} onClick={close} aria-label="بستن منو">
                  <X size={22} />
                </button>
              </div>
              <nav className="grid flex-1 content-start gap-1 p-4" aria-label="منوی موبایل">
                {NAV_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) => cn(MENU_LINK, isActive && 'bg-primary-50 text-primary-700')}
                  >
                    {l.label}
                  </NavLink>
                ))}
                {user?.role !== 'admin' && (
                  <NavLink to={user ? '/account/wishlist' : '/login'} className={MENU_LINK}>
                    <Heart size={18} /> علاقه‌مندی‌ها
                  </NavLink>
                )}
              </nav>
              <div className="grid gap-2.5 border-t border-line bg-surface px-5 pt-4 pb-5">
                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? '/admin' : '/account'} className={buttonClass({ block: true })}>
                      {user.role === 'admin' ? <LayoutDashboard size={18} /> : <User size={18} />}
                      {user.role === 'admin' ? 'پنل مدیریت' : 'پنل کاربری'}
                    </Link>
                    <button
                      type="button"
                      className={buttonClass({ variant: 'outline', block: true })}
                      onClick={onLogout}
                    >
                      <LogOut size={18} /> خروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={buttonClass({ block: true })}>
                      ورود به حساب
                    </Link>
                    <Link to="/register" className={buttonClass({ variant: 'outline', block: true })}>
                      ثبت‌نام
                    </Link>
                  </>
                )}
                <p className="text-center text-[13px] text-muted [&_a]:font-extrabold [&_a]:text-primary-700">
                  پشتیبانی: <a href={`tel:${BRAND.phoneRaw}`}>{BRAND.phone}</a>
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      <LogoutDialog open={confirming} onClose={closeConfirm} />
    </>
  )
})

export default MobileMenu
