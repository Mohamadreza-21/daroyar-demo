import { memo, useCallback, useState } from 'react'
import { fetchProducts } from '../api/catalog'
import { keys } from '../../../shared/hooks/queryKeys'
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import { useCatalogMeta, useCategories, useProducts } from '../hooks/useCatalog'
import { useClampPage, usePrefetchNext, useSearchInput, useUrlParams } from '../../../shared/hooks/useUrlState'
import BusyOverlay from '../../../shared/components/common/BusyOverlay'
import { useDialogA11y, useDocumentTitle, useLockBodyScroll } from '../../../shared/hooks/useUtils'
import { Breadcrumb, EmptyState, Pagination } from '../../../shared/components/common/Primitives'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import {
  MINI_SELECT,
  PAGEHEAD,
  SEARCHFIELD,
  SEARCH_CLEAR,
  SEARCH_ICON,
  SEARCH_INPUT,
} from '../../../shared/components/common/styles'
import ProductGrid from '../components/ProductGrid'
import ShopFilters from '../components/ShopFilters'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { ShopSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import { SORT_OPTIONS } from '../../../shared/utils/constants'
import { formatNumber } from '../../../shared/utils/format'

const PAGE_SIZE = 12

const Toolbar = memo(function Toolbar({ total, sort, onSort, onOpenFilters }) {
  return (
    <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
      <p>
        <b>{formatNumber(total)}</b> محصول
      </p>
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden max-[1025px]:inline-flex"
          onClick={onOpenFilters}
          icon={<SlidersHorizontal size={16} />}
        >
          فیلترها
        </Button>
        <label className="flex items-center gap-2 text-[13.5px] text-muted">
          <span className="max-[641px]:hidden">مرتب‌سازی:</span>
          <select className={MINI_SELECT} value={sort} onChange={(e) => onSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
})

export default function ShopPage() {
  const { params, update, reset, page, setPage } = useUrlParams()
  const [drawer, setDrawer] = useState(false)
  useLockBodyScroll(drawer)

  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'popular'
  const maxPrice = Number(params.get('max')) || 0
  const onlyAvailable = params.get('available') === '1'
  const onlyDiscount = params.get('discount') === '1'
  const qParam = params.get('q') ?? ''

  const commitSearch = useCallback((q) => update({ q }, { replace: true }), [update])
  const search = useSearchInput(qParam, commitSearch)

  const { data: categories = [] } = useCategories()
  const { data: meta } = useCatalogMeta()
  const categoryLabel = categories.find((item) => item.slug === category)?.label
  useDocumentTitle(categoryLabel ?? 'فروشگاه')

  const priceBounds = meta ? Math.ceil(meta.maxPrice / 100000) * 100000 : 0

  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = useProducts({
    q: qParam,
    category,
    maxPrice,
    available: onlyAvailable,
    discounted: onlyDiscount,
    sort,
    page,
    limit: PAGE_SIZE,
  })
  const visible = data?.items ?? []
  const total = data?.total ?? 0
  const { totalPages, current } = useClampPage({
    page,
    total,
    pageSize: PAGE_SIZE,
    ready: !!data && !isPlaceholderData,
    setPage,
  })

  const nextFilters = {
    q: qParam,
    category,
    maxPrice,
    available: onlyAvailable,
    discounted: onlyDiscount,
    sort,
    page: current + 1,
    limit: PAGE_SIZE,
  }
  usePrefetchNext({
    current,
    totalPages,
    ready: !!data && !isPlaceholderData,
    queryKey: keys.productList(nextFilters),
    queryFn: (signal) => fetchProducts(nextFilters, signal),
  })

  const onSort = useCallback((value) => update({ sort: value === 'popular' ? '' : value }), [update])
  const onPage = useCallback(
    (p) => {
      setPage(p)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setPage],
  )
  const onReset = useCallback(() => {
    search.clear()
    reset()
  }, [search, reset])
  const openFilters = useCallback(() => setDrawer(true), [])
  const closeFilters = useCallback(() => setDrawer(false), [])
  const dialogRef = useDialogA11y(drawer, closeFilters)

  if (isPending && !data) return <ShopSkeleton />
  if (isError) return <ErrorState error={error} onRetry={refetch} />

  const filtersNode = (
    <ShopFilters
      categories={categories}
      category={category}
      maxPrice={maxPrice}
      priceBounds={priceBounds}
      onlyAvailable={onlyAvailable}
      onlyDiscount={onlyDiscount}
      onChange={update}
      onReset={onReset}
    />
  )

  return (
    <div className="site-container animate-page-in">
      <Breadcrumb items={[{ label: 'خانه', to: '/' }, { label: 'فروشگاه' }]} />
      <header className={PAGEHEAD}>
        <h1>{categoryLabel ?? 'فروشگاه نمایشی دارویار'}</h1>
        <label className={SEARCHFIELD}>
          <Search size={18} className={SEARCH_ICON} aria-hidden="true" />
          <input
            className={SEARCH_INPUT}
            type="search"
            value={search.text}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder="نام محصول یا برند…"
            aria-label="جستجو در محصولات"
          />
          {search.text && (
            <button type="button" className={SEARCH_CLEAR} onClick={search.clear} aria-label="پاک کردن">
              <X size={16} className="absolute start-3.5 text-muted" />
            </button>
          )}
        </label>
      </header>

      <div className="grid grid-cols-[280px_minmax(0,1fr)] items-start gap-7 pb-5 max-[1025px]:grid-cols-1">
        <aside className="sticky top-[calc(var(--header-h)+16px)] rounded-lg border border-line bg-surface p-[22px] max-[1025px]:hidden">
          {filtersNode}
        </aside>
        <div>
          <Toolbar total={total} sort={sort} onSort={onSort} onOpenFilters={openFilters} />
          {visible.length ? (
            <>
              <BusyOverlay busy={isPlaceholderData && isFetching} label="در حال دریافت محصولات…">
                <ProductGrid products={visible} />
              </BusyOverlay>
              <Pagination page={current} totalPages={totalPages} onChange={onPage} />
            </>
          ) : (
            <EmptyState icon={PackageSearch} title="محصولی پیدا نشد" text="فیلترها یا عبارت جستجو را تغییر دهید.">
              <Button variant="soft" onClick={onReset}>
                حذف همهٔ فیلترها
              </Button>
            </EmptyState>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-[rgba(10,30,34,0.5)] backdrop-blur-[3px]" onClick={closeFilters} />
          <aside
            ref={dialogRef}
            tabIndex={-1}
            className="absolute top-0 bottom-0 start-0 flex w-[min(100%,420px)] flex-col bg-surface shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="فیلترها"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2.5 text-[18px]">فیلترها</h2>
              <button type="button" className={ICON_BTN} onClick={closeFilters} aria-label="بستن">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filtersNode}</div>
            <div className="grid gap-2.5 border-t border-line bg-surface px-5 pt-4 pb-5">
              <Button block onClick={closeFilters}>
                نمایش {formatNumber(total)} محصول
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
