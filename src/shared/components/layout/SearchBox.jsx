import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Search, X } from 'lucide-react'
import { useProducts } from '../../../features/catalog/hooks/useCatalog'
import { Price } from '../common/Primitives'
import { useDebounce } from '../../hooks/useUtils'
import { cn } from '../../utils/format'
import { handleImgError } from '../../utils/image'

const MIN_CHARS = 2
const LIMIT = 6
const ROW = 'flex items-center gap-3 rounded-[14px] px-3 py-2.5 [transition:background_0.15s]'

const SearchBox = memo(function SearchBox() {
  const navigate = useNavigate()
  const listId = useId()
  const rootRef = useRef(null)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const term = q.trim()
  const debounced = useDebounce(term, 300)
  const enabled = debounced.length >= MIN_CHARS
  const { data, isFetching } = useProducts({ q: debounced, limit: LIMIT }, { enabled })
  const items = useMemo(() => (enabled ? (data?.items ?? []) : []), [enabled, data])
  const settled = enabled && term === debounced && !isFetching
  const showPanel = open && term.length >= MIN_CHARS

  useEffect(() => {
    if (!open) return undefined
    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const close = useCallback(() => {
    setOpen(false)
    setActive(-1)
  }, [])

  const goShop = useCallback(() => {
    close()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
  }, [close, navigate, term])

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (active >= 0 && items[active]) {
        close()
        navigate(`/product/${items[active].id}`)
        return
      }
      goShop()
    },
    [active, items, close, navigate, goShop],
  )

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (!showPanel || !items.length) return
      const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
      if (!step) return
      event.preventDefault()
      setActive((index) => (index + step + items.length) % items.length)
    },
    [showPanel, items.length, close],
  )

  const onChange = useCallback((event) => {
    setQ(event.target.value)
    setActive(-1)
    setOpen(true)
  }, [])

  const clear = useCallback(() => {
    setQ('')
    close()
  }, [close])

  return (
    <div ref={rootRef} className="relative ms-auto flex max-w-[420px] flex-1 max-[861px]:hidden">
      <form className="relative flex w-full items-center" role="search" onSubmit={onSubmit}>
        <Search size={18} className="absolute start-3.5 text-muted" aria-hidden="true" />
        <input
          className="h-11 w-full rounded-[14px] border-[1.5px] border-line bg-bg ps-11 pe-10 outline-none [transition:border-color_0.2s,background_0.2s,box-shadow_0.2s] focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_14%,transparent)]"
          value={q}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="جستجوی محصولات بهداشتی و مراقبتی…"
          aria-label="جستجو در فروشگاه"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
        />
        {q && (
          <button
            type="button"
            className="absolute end-2 grid size-7 place-items-center rounded-full text-muted hover:bg-primary-50 hover:text-primary-700"
            onClick={clear}
            aria-label="پاک کردن جستجو"
          >
            <X size={16} />
          </button>
        )}
      </form>
      {showPanel && (
        <div
          id={listId}
          role="listbox"
          aria-label="نتایج جستجو"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-[20px] border border-line bg-surface p-2 shadow-lg"
        >
          {!settled && items.length === 0 && (
            <p className="px-3 py-4 text-center text-muted" role="status">
              در حال جستجو…
            </p>
          )}
          {settled && items.length === 0 && (
            <p className="px-3 py-4 text-center font-bold text-muted" role="status">
              محصولی یافت نشد
            </p>
          )}
          {items.map((product, index) => (
            <Link
              key={product.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={active === index}
              to={`/product/${product.id}`}
              className={cn(ROW, active === index ? 'bg-primary-50' : 'hover:bg-primary-50')}
              onClick={close}
            >
              <img
                className="size-12 shrink-0 rounded-[12px] bg-bg-2 object-contain"
                onError={handleImgError}
                src={product.thumbnail}
                alt=""
                loading="lazy"
              />
              <span dir="auto" className="line-clamp-2 min-w-0 flex-1 text-[14px] leading-[1.6]">
                {product.title}
              </span>
              <Price price={product.price} />
            </Link>
          ))}
          {items.length > 0 && (
            <button
              type="button"
              className="mt-1 w-full rounded-[14px] px-3 py-2.5 text-center font-extrabold text-primary-700 hover:bg-primary-50"
              onClick={goShop}
            >
              مشاهدهٔ همهٔ نتایج
            </button>
          )}
        </div>
      )}
    </div>
  )
})

export default SearchBox
