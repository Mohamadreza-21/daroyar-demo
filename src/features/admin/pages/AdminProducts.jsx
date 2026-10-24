import { memo, useCallback, useState } from 'react'
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCategories, useCategoryMap, useProducts } from '../../catalog/hooks/useCatalog'
import { useProductMutations } from '../hooks/useAdmin'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { useClampPage, useSearchInput, useUrlParams } from '../../../shared/hooks/useUrlState'
import BusyOverlay from '../../../shared/components/common/BusyOverlay'
import { Badge, EmptyState, Pagination } from '../../../shared/components/common/Primitives'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import {
  ADMIN_FILTERS,
  ADMIN_SEARCH,
  CARD_ROW,
  CELL_USER,
  CELL_USER_NAME,
  MINI_SELECT,
  PANEL_TITLE,
  ROW_ACTIONS,
  SEARCH_ICON,
  SEARCH_INPUT,
  STACK,
  TABLE,
  TABLE_WRAP,
  TD,
  TH,
  THUMB,
  TOOLBAR_SORT,
  TR,
} from '../../../shared/components/common/styles'
import Modal, { ConfirmDialog } from '../../../shared/components/common/Modal'
import ProductForm from '../components/ProductForm'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { AdminTableSkeleton } from '../../../shared/components/loaders/AdminSkeletons'
import { LOW_STOCK } from '../../../shared/utils/constants'
import { cn, formatNumber, formatToman, toEnglishDigits } from '../../../shared/utils/format'
import { assetUrl, handleImgError } from '../../../shared/utils/image'

const PAGE_SIZE = 10
const STOCK_FILTERS = {
  '': {},
  available: { stockFrom: 1 },
  low: { stockFrom: 1, stockTo: LOW_STOCK - 1 },
  out: { stockTo: 0 },
}

const StockEditor = memo(function StockEditor({ product, onSave, saving }) {
  const [value, setValue] = useState(String(product.stock))
  const changed = Number(toEnglishDigits(value)) !== product.stock
  const submit = (e) => {
    e.preventDefault()
    const stock = Number(toEnglishDigits(value))
    if (!Number.isInteger(stock) || stock < 0) return toast.error('موجودی باید عدد صحیح و نامنفی باشد')
    return onSave(product.id, stock)
  }
  return (
    <form onSubmit={submit} className="flex items-center gap-1.5">
      <Badge tone={product.stock === 0 ? 'danger' : product.stock < LOW_STOCK ? 'warn' : 'success'}>
        {formatNumber(product.stock)}
      </Badge>
      <input
        className={cn(MINI_SELECT, 'w-[70px]')}
        inputMode="numeric"
        dir="ltr"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={`موجودی ${product.title}`}
      />
      <Button type="submit" size="sm" variant="soft" disabled={!changed} loading={saving}>
        ثبت
      </Button>
    </form>
  )
})

const Row = memo(function Row({ product, onEdit, onDelete, onStock, savingStock }) {
  const label = useCategoryMap().get(product.category)?.label ?? product.category
  const edit = useCallback(() => onEdit(product), [onEdit, product])
  const del = useCallback(() => onDelete(product), [onDelete, product])
  return (
    <tr className={TR}>
      <td className={TD}>
        <div className={CELL_USER}>
          <img onError={handleImgError} className={THUMB} src={assetUrl(product.thumbnail)} alt="" loading="lazy" />
          <div>
            <b
              dir="auto"
              className={cn(CELL_USER_NAME, 'overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:2]')}
            >
              {product.title}
            </b>
            <small className="text-muted">{product.brand}</small>
          </div>
        </div>
      </td>
      <td className={TD}>{label}</td>
      <td className={TD}>
        <b>{formatToman(product.price)}</b>
        {product.discount > 0 && (
          <small className="block text-accent-600">{formatNumber(product.discount)}٪ تخفیف</small>
        )}
      </td>
      <td className={TD}>
        <StockEditor key={product.stock} product={product} onSave={onStock} saving={savingStock} />
      </td>
      <td className={TD}>
        <div className={ROW_ACTIONS}>
          <button
            type="button"
            className={cn(ICON_BTN, 'size-[38px]')}
            onClick={edit}
            aria-label={`ویرایش ${product.title}`}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            className={cn(ICON_BTN, 'size-[38px] hover:bg-danger-50 hover:text-danger')}
            onClick={del}
            aria-label={`حذف ${product.title}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
})

export default function AdminProducts() {
  useDocumentTitle('مدیریت محصولات')
  const { create, update, stock, remove } = useProductMutations()
  const { data: categories = [] } = useCategories()
  const { params, update: setParam, reset, page, setPage } = useUrlParams()
  const qParam = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const stockFilter = STOCK_FILTERS[params.get('stock')] ? params.get('stock') : ''
  const commitSearch = useCallback((value) => setParam({ q: value }, { replace: true }), [setParam])
  const search = useSearchInput(qParam, commitSearch)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { data, isPending, isError, error, refetch, isPlaceholderData, isFetching } = useProducts({
    q: qParam,
    category,
    ...STOCK_FILTERS[stockFilter],
    sort: 'newest',
    page,
    limit: PAGE_SIZE,
  })

  const openNew = useCallback(() => setEditing('new'), [])
  const closeForm = useCallback(() => {
    setEditing(null)
    create.reset()
    update.reset()
  }, [create, update])
  const closeDelete = useCallback(() => setDeleting(null), [])
  const resetFilters = () => {
    search.clear()
    reset()
  }

  const onSubmit = useCallback(
    (form) => {
      const done = (msg) => ({
        onSuccess: () => {
          toast.success(msg)
          setEditing(null)
        },
        onError: (e) => {
          if (!e.fieldErrors) toast.error(e.message || 'عملیات انجام نشد')
        },
      })
      if (editing === 'new') create.mutate(form, done('محصول جدید افزوده شد'))
      else update.mutate({ id: editing.id, form }, done('محصول ویرایش شد'))
    },
    [editing, create, update],
  )

  const onStock = useCallback(
    (id, value) =>
      stock.mutate(
        { id, stock: value },
        {
          onSuccess: () => toast.success('موجودی به‌روز شد'),
          onError: (e) => toast.error(e.message || 'به‌روزرسانی موجودی انجام نشد'),
        },
      ),
    [stock],
  )

  const onConfirmDelete = useCallback(() => {
    remove.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('محصول حذف شد')
        setDeleting(null)
      },
      onError: (e) => {
        toast.error(e.message || 'حذف انجام نشد')
        setDeleting(null)
      },
    })
  }, [remove, deleting])

  const total = data?.total ?? 0
  const { totalPages, current } = useClampPage({
    page,
    total,
    pageSize: PAGE_SIZE,
    ready: !!data && !isPlaceholderData,
    setPage,
  })

  if (isPending) return <AdminTableSkeleton label="در حال دریافت فهرست محصولات…" variant="capsule" />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  const rows = data.items
  const hasFilters = Boolean(qParam || search.text || category || stockFilter)

  return (
    <div className={STACK}>
      <div className={CARD_ROW}>
        <h1 className={PANEL_TITLE}>مدیریت محصولات ({formatNumber(data.total)})</h1>
        <Button onClick={openNew} icon={<Plus size={18} />}>
          محصول جدید
        </Button>
      </div>
      <div className={ADMIN_FILTERS}>
        <label className={ADMIN_SEARCH}>
          <Search size={18} className={SEARCH_ICON} aria-hidden="true" />
          <input
            className={SEARCH_INPUT}
            type="search"
            value={search.text}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder="جستجو در محصولات…"
            aria-label="جستجو در محصولات"
          />
        </label>
        <label className={TOOLBAR_SORT}>
          <span className="max-[641px]:hidden">دسته:</span>
          <select className={MINI_SELECT} value={category} onChange={(e) => setParam({ category: e.target.value })}>
            <option value="">همه</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className={TOOLBAR_SORT}>
          <span className="max-[641px]:hidden">موجودی:</span>
          <select className={MINI_SELECT} value={stockFilter} onChange={(e) => setParam({ stock: e.target.value })}>
            <option value="">همه</option>
            <option value="available">موجود</option>
            <option value="low">کم‌موجودی (کمتر از {formatNumber(LOW_STOCK)})</option>
            <option value="out">ناموجود</option>
          </select>
        </label>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            پاک کردن فیلترها
          </Button>
        )}
      </div>
      {rows.length ? (
        <>
          <BusyOverlay busy={isPlaceholderData && isFetching} label="در حال دریافت محصولات…">
            <div className={TABLE_WRAP}>
              <table className={TABLE}>
                <caption className="sr-only">فهرست محصولات</caption>
                <thead>
                  <tr>
                    <th scope="col" className={TH}>
                      محصول
                    </th>
                    <th scope="col" className={TH}>
                      دسته
                    </th>
                    <th scope="col" className={TH}>
                      قیمت
                    </th>
                    <th scope="col" className={TH}>
                      موجودی
                    </th>
                    <th scope="col" className={TH}>
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <Row
                      key={p.id}
                      product={p}
                      onEdit={setEditing}
                      onDelete={setDeleting}
                      onStock={onStock}
                      savingStock={stock.isPending && stock.variables?.id === p.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </BusyOverlay>
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          icon={Package}
          title="محصولی پیدا نشد"
          text={hasFilters ? 'فیلترها را تغییر دهید.' : 'هنوز محصولی ثبت نشده است.'}
        >
          {hasFilters && (
            <Button variant="soft" onClick={resetFilters}>
              پاک کردن فیلترها
            </Button>
          )}
        </EmptyState>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={closeForm}
        title={editing === 'new' ? 'افزودن محصول' : 'ویرایش محصول'}
        size="lg"
      >
        <ProductForm
          product={editing === 'new' ? null : editing}
          loading={create.isPending || update.isPending}
          serverError={create.error ?? update.error}
          onSubmit={onSubmit}
          onCancel={closeForm}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={closeDelete}
        onConfirm={onConfirmDelete}
        loading={remove.isPending}
        title="حذف محصول"
        text={`«${deleting?.title ?? ''}» برای همیشه حذف شود؟`}
        confirmLabel="حذف"
      />
    </div>
  )
}
