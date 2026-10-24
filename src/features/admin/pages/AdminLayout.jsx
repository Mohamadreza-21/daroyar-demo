import { memo } from 'react'
import { LayoutDashboard, MessageSquare, Package, ReceiptText, Tags, Users } from 'lucide-react'
import PanelLayout from '../../../shared/components/panel/PanelLayout'
import { AdminOverviewSkeleton } from '../../../shared/components/loaders/AdminSkeletons'

const LINKS = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'مدیریت محصولات', icon: Package },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Tags },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: ReceiptText },
  { to: '/admin/messages', label: 'پیام‌ها', icon: MessageSquare },
  { to: '/admin/users', label: 'کاربران', icon: Users },
]

const fallback = <AdminOverviewSkeleton />

const AdminLayout = memo(function AdminLayout() {
  return <PanelLayout links={LINKS} roleLabel="مدیر سایت" crumb="پنل مدیریت" fallback={fallback} />
})

export default AdminLayout
