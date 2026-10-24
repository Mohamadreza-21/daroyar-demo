import { memo, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Heart, LayoutDashboard, Menu, ShoppingBag, User } from 'lucide-react'
import { buttonClass, ICON_BTN } from '../common/Button'
import Logo from '../common/Logo'
import SearchBox from './SearchBox'
import { NAV_LINKS } from '../../utils/constants'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useCartBadge } from '../../../features/cart/hooks/useCart'
import { useCanWish, useWishlistIds } from '../../../features/wishlist/hooks/useWishlist'
import { useUiStore } from '../../store/uiStore'
import { cn, formatNumber } from '../../utils/format'

const DesktopNav = memo(function DesktopNav() {
  return (
    <nav className="flex gap-1 max-[1101px]:hidden" aria-label="منوی اصلی">
      {NAV_LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            cn(
              'relative rounded-[12px] px-3.5 py-2 font-bold text-ink-2 [transition:background_0.2s,color_0.2s] hover:bg-primary-50 hover:text-primary-700',
              isActive && 'bg-primary-50 text-primary-700',
            )
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
})

const CartButton = memo(function CartButton() {
  const count = useCartBadge()
  const openCart = useUiStore((s) => s.openCart)
  return (
    <button
      type="button"
      className={cn(ICON_BTN, 'max-[641px]:hidden')}
      onClick={openCart}
      aria-label={`سبد خرید، ${formatNumber(count)} کالا`}
    >
      <ShoppingBag size={22} />
      {count > 0 && (
        <span className="absolute top-[3px] start-[3px] min-w-[19px] h-[19px] px-[5px] rounded-full bg-accent text-white text-[11px] font-extrabold leading-[19px] text-center">
          {formatNumber(count)}
        </span>
      )}
    </button>
  )
})

const WishButton = memo(function WishButton({ authed }) {
  const count = useWishlistIds().length
  return (
    <Link
      to={authed ? '/account/wishlist' : '/login'}
      state={authed ? undefined : { from: '/account/wishlist' }}
      className={cn(ICON_BTN, 'max-[861px]:hidden!')}
      aria-label="علاقه‌مندی‌ها"
    >
      <Heart size={22} />
      {count > 0 && (
        <span className="absolute top-[3px] start-[3px] min-w-[19px] h-[19px] px-[5px] rounded-full bg-accent text-white text-[11px] font-extrabold leading-[19px] text-center">
          {formatNumber(count)}
        </span>
      )}
    </Link>
  )
})

const Header = memo(function Header() {
  const user = useAuthStore((s) => s.user)
  const openMenu = useUiStore((s) => s.openMenu)
  const canWish = useCanWish()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const panelTo = user?.role === 'admin' ? '/admin' : '/account'

  return (
    <header
      className={cn(
        'sticky top-0 z-[60] border-b border-transparent bg-white/86 [backdrop-filter:saturate(1.6)_blur(14px)] [transition:box-shadow_0.3s,border-color_0.3s,background_0.3s]',
        scrolled && 'border-line shadow-[0_6px_24px_rgba(14,42,47,0.06)]',
      )}
    >
      <div className="site-container flex h-(--header-h) items-center gap-[18px] max-[861px]:justify-between">
        <button
          type="button"
          className={cn(ICON_BTN, 'hidden max-[1101px]:inline-grid')}
          onClick={openMenu}
          aria-label="باز کردن منو"
        >
          <Menu size={24} />
        </button>
        <Logo />
        <DesktopNav />
        <SearchBox />
        <div className="flex items-center gap-1.5">
          {canWish && <WishButton authed={Boolean(user)} />}
          <CartButton />
          {user ? (
            <Link
              to={panelTo}
              className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-primary-50 px-4 font-extrabold text-primary-700 [transition:background_0.2s] hover:bg-primary-100"
              aria-label="ورود به پنل کاربری"
            >
              {user.role === 'admin' ? <LayoutDashboard size={18} /> : <User size={18} />}
              <span>{user.firstName}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={buttonClass({
                size: 'sm',
                className: 'min-h-11 max-[861px]:text-[13px] max-[641px]:px-3',
              })}
            >
              <User size={16} /> ورود | ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  )
})

export default Header
