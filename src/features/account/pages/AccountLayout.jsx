import { memo } from 'react'
import { Heart, LayoutDashboard, MessageSquare, Package, UserRound } from 'lucide-react'
import PanelLayout from '../../../shared/components/panel/PanelLayout'
import { PanelOverviewSkeleton } from '../../../shared/components/loaders/PanelSkeletons'

const LINKS = [
  { to: '/account', label: 'نمای کلی', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'سفارش‌های من', icon: Package },
  { to: '/account/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
  { to: '/account/messages', label: 'پیام‌های من', icon: MessageSquare },
  { to: '/account/profile', label: 'اطلاعات حساب', icon: UserRound },
]

const fallback = <PanelOverviewSkeleton />

const AccountLayout = memo(function AccountLayout() {
  return <PanelLayout links={LINKS} roleLabel="مشتری" crumb="پنل کاربری" fallback={fallback} />
})

export default AccountLayout
