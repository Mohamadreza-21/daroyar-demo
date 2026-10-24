import { memo } from 'react'
import { NavLink } from 'react-router'
import { BookOpen, House, ShoppingBag, Store, User } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useCartBadge } from '../../../features/cart/hooks/useCart'
import { useUiStore } from '../../store/uiStore'
import { cn, formatNumber } from '../../utils/format'

const ITEM = 'grid justify-items-center gap-0.5 rounded-[14px] py-1.5 text-[11px] font-bold text-muted'

const MobileTabBar = memo(function MobileTabBar() {
  const user = useAuthStore((s) => s.user)
  const count = useCartBadge()
  const openCart = useUiStore((s) => s.openCart)
  const cls = ({ isActive }) => cn(ITEM, isActive && 'bg-primary-50 text-primary-700')
  return (
    <nav
      className="hidden max-[641px]:fixed max-[641px]:inset-x-0 max-[641px]:bottom-0 max-[641px]:z-[70] max-[641px]:grid max-[641px]:grid-cols-5 max-[641px]:border-t max-[641px]:border-line max-[641px]:bg-white/95 max-[641px]:px-1.5 max-[641px]:pt-1.5 max-[641px]:pb-[calc(6px+env(safe-area-inset-bottom))] max-[641px]:shadow-[0_-8px_28px_rgba(14,42,47,0.08)] max-[641px]:backdrop-blur-[14px]"
      aria-label="ناوبری سریع"
    >
      <NavLink to="/" end className={cls}>
        <House size={22} />
        <span>خانه</span>
      </NavLink>
      <NavLink to="/shop" className={cls}>
        <Store size={22} />
        <span>فروشگاه</span>
      </NavLink>
      <button type="button" className={ITEM} onClick={openCart}>
        <span className="relative">
          <ShoppingBag size={22} />
          {count > 0 && (
            <i className="absolute -start-2 -top-1.5 h-[17px] min-w-[17px] rounded-full bg-accent px-1 text-center text-[10px] leading-[17px] text-white not-italic">
              {formatNumber(count)}
            </i>
          )}
        </span>
        <span>سبد</span>
      </button>
      <NavLink to="/articles" className={cls}>
        <BookOpen size={22} />
        <span>مقالات</span>
      </NavLink>
      <NavLink to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} className={cls}>
        <User size={22} />
        <span>{user ? 'پنل' : 'ورود'}</span>
      </NavLink>
    </nav>
  )
})

export default MobileTabBar
