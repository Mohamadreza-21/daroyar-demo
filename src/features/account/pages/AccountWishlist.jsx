import { Heart } from 'lucide-react'
import { useProducts } from '../../catalog/hooks/useCatalog'
import { useWishlist } from '../../wishlist/hooks/useWishlist'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { EmptyState } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
import { PANEL_TITLE, STACK } from '../../../shared/components/common/styles'
import ProductGrid from '../../catalog/components/ProductGrid'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { PanelWishlistSkeleton } from '../../../shared/components/loaders/PanelSkeletons'

export default function AccountWishlist() {
  useDocumentTitle('علاقه‌مندی‌ها')
  const wishlist = useWishlist()
  const ids = wishlist.data ?? []
  const { data, isPending, isError, error, refetch } = useProducts(
    { ids, limit: Math.max(ids.length, 1) },
    { enabled: ids.length > 0 },
  )
  const items = ids.length ? (data?.items ?? []).filter((p) => ids.includes(p.id)) : []

  if (wishlist.isPending) return <PanelWishlistSkeleton />
  if (wishlist.isError) return <ErrorState error={wishlist.error} onRetry={wishlist.refetch} compact home={false} />
  if (ids.length > 0 && isPending) return <PanelWishlistSkeleton />
  if (ids.length > 0 && isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>علاقه‌مندی‌ها</h1>
      {items.length ? (
        <ProductGrid products={items} />
      ) : (
        <EmptyState
          icon={Heart}
          title="فهرست علاقه‌مندی‌ها خالی است"
          text="با زدن آیکون قلب روی محصولات، آن‌ها را اینجا ذخیره کنید."
        >
          <Button to="/shop">مشاهدهٔ محصولات</Button>
        </EmptyState>
      )}
    </div>
  )
}
