import { memo, useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { formatToman } from '../../../shared/utils/format'
import { CHECK_INPUT, CHECK_LABEL, CHIP_SM, chipClass } from '../../../shared/components/common/styles'
import { useDebounce } from '../../../shared/hooks/useUtils'

const PRICE_STEP = 50000

const FIELDSET = 'm-0 grid gap-3 border-0 p-0'
const LEGEND = 'mb-2.5 p-0 text-[14px] font-extrabold'

const ShopFilters = memo(function ShopFilters({
  categories = [],
  category,
  maxPrice,
  priceBounds,
  onlyAvailable,
  onlyDiscount,
  onChange,
  onReset,
}) {
  const unlimited = (value) => value >= priceBounds
  const [price, setPrice] = useState(maxPrice || priceBounds)
  const debounced = useDebounce(price, 250)

  useEffect(() => setPrice(maxPrice || priceBounds), [maxPrice, priceBounds])
  useEffect(() => {
    const next = unlimited(debounced) ? 0 : debounced
    if (next !== maxPrice) onChange({ max: next })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <div className="grid gap-[22px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px]">فیلتر محصولات</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-bold text-accent-600"
          onClick={onReset}
        >
          <RotateCcw size={14} /> پاک کردن
        </button>
      </div>

      <fieldset className={FIELDSET}>
        <legend className={LEGEND}>دسته‌بندی</legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={chipClass(!category, CHIP_SM)}
            aria-pressed={!category}
            onClick={() => onChange({ category: '' })}
          >
            همه
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={chipClass(category === item.slug, CHIP_SM)}
              aria-pressed={category === item.slug}
              onClick={() => onChange({ category: item.slug })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={FIELDSET}>
        <legend className={LEGEND}>حداکثر قیمت</legend>
        <input
          type="range"
          min={PRICE_STEP}
          max={priceBounds}
          step={PRICE_STEP}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          aria-label="حداکثر قیمت"
          className="w-full accent-primary [direction:ltr]"
        />
        <p className="text-[13px] text-muted">{unlimited(price) ? 'بدون محدودیت قیمت' : `تا ${formatToman(price)}`}</p>
      </fieldset>

      <fieldset className={FIELDSET}>
        <legend className={LEGEND}>سایر</legend>
        <label className={CHECK_LABEL}>
          <input
            className={CHECK_INPUT}
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => onChange({ available: e.target.checked })}
          />
          فقط کالاهای موجود
        </label>
        <label className={CHECK_LABEL}>
          <input
            className={CHECK_INPUT}
            type="checkbox"
            checked={onlyDiscount}
            onChange={(e) => onChange({ discount: e.target.checked })}
          />
          فقط کالاهای تخفیف‌دار
        </label>
      </fieldset>
    </div>
  )
})

export default ShopFilters
