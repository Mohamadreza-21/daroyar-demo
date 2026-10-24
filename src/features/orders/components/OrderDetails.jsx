import { memo } from 'react'
import { Link } from 'react-router'
import { Badge } from '../../../shared/components/common/Primitives'
import {
  CARD_ROW,
  CARD_TITLE,
  OLIST,
  OLIST_LI,
  SPEC_DD,
  SPEC_DT,
  SPEC_ROW,
  STACK,
  TWO,
} from '../../../shared/components/common/styles'
import { useCategoryLabel } from '../../catalog/hooks/useCatalog'
import { ORDER_STATUS, PAYMENT_METHODS } from '../../../shared/utils/constants'
import { formatDateTime, formatNumber, formatToman } from '../../../shared/utils/format'
import { assetUrl, handleImgError } from '../../../shared/utils/image'

const ItemRow = memo(function ItemRow({ item }) {
  const label = useCategoryLabel(item.category)
  return (
    <li className="flex items-center gap-3">
      <Link to={`/product/${item.productId}`}>
        <img
          className="size-[52px] rounded-[12px] bg-bg-2 object-contain"
          onError={handleImgError}
          src={assetUrl(item.thumbnail)}
          alt=""
          loading="lazy"
        />
      </Link>
      <span dir="auto" className="line-clamp-2 flex-1 text-[14px]">
        {item.title}
        <small className="block text-muted">{label}</small>
      </span>
      <small>
        {formatNumber(item.qty)} × {formatToman(item.price)}
      </small>
      <b>{formatToman(item.price * item.qty)}</b>
    </li>
  )
})

const OrderDetails = memo(function OrderDetails({ order }) {
  const status = ORDER_STATUS[order.status]
  const { totals, shipping } = order
  return (
    <div className={STACK}>
      <header className={CARD_ROW}>
        <div>
          <b dir="ltr">{order.id}</b>
          <small className="block text-muted">{formatDateTime(order.createdAt)}</small>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </header>

      <section aria-labelledby={`items-${order.id}`}>
        <h3 id={`items-${order.id}`} className={CARD_TITLE}>
          کالاها
        </h3>
        <ul className="my-4 grid gap-2.5 border-y border-dashed border-line py-3.5">
          {order.items.map((item) => (
            <ItemRow key={item.productId} item={item} />
          ))}
        </ul>
      </section>

      <section className={TWO}>
        <div>
          <h3 className={CARD_TITLE}>نشانی و ارسال</h3>
          <dl className="m-0 grid max-w-[640px]">
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>گیرنده</dt>
              <dd className={SPEC_DD}>{shipping.fullName}</dd>
            </div>
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>موبایل</dt>
              <dd className={SPEC_DD} dir="ltr">
                {shipping.phone}
              </dd>
            </div>
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>نشانی</dt>
              <dd className={SPEC_DD}>
                {shipping.province}، {shipping.city}، {shipping.address}
              </dd>
            </div>
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>کد پستی</dt>
              <dd className={SPEC_DD} dir="ltr">
                {shipping.postalCode}
              </dd>
            </div>
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>روش ارسال</dt>
              <dd className={SPEC_DD}>{order.shippingMethod?.label}</dd>
            </div>
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>روش پرداخت</dt>
              <dd className={SPEC_DD}>{PAYMENT_METHODS[order.payment]}</dd>
            </div>
            {shipping.note && (
              <div className={SPEC_ROW}>
                <dt className={SPEC_DT}>توضیحات</dt>
                <dd className={SPEC_DD}>{shipping.note}</dd>
              </div>
            )}
          </dl>
        </div>
        <div>
          <h3 className={CARD_TITLE}>خلاصهٔ مبلغ</h3>
          <dl className="m-0 grid max-w-[640px]">
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>مبلغ کالاها</dt>
              <dd className={SPEC_DD}>{formatToman(totals.subtotal)}</dd>
            </div>
            {totals.couponDiscount > 0 && (
              <div className={SPEC_ROW}>
                <dt className={SPEC_DT}>کد تخفیف {order.coupon?.code}</dt>
                <dd className={SPEC_DD}>- {formatToman(totals.couponDiscount)}</dd>
              </div>
            )}
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>هزینهٔ ارسال</dt>
              <dd className={SPEC_DD}>{totals.shipping === 0 ? 'رایگان' : formatToman(totals.shipping)}</dd>
            </div>
            <div className={SPEC_ROW}>
              <dt className={SPEC_DT}>
                <b>مبلغ نهایی</b>
              </dt>
              <dd className={SPEC_DD}>
                <b>{formatToman(totals.total)}</b>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby={`history-${order.id}`}>
        <h3 id={`history-${order.id}`} className={CARD_TITLE}>
          تاریخچهٔ وضعیت
        </h3>
        <ol className={OLIST}>
          {order.history.map((entry) => (
            <li key={`${entry.status}-${entry.at}`} className={OLIST_LI}>
              <Badge tone={ORDER_STATUS[entry.status].tone}>{ORDER_STATUS[entry.status].label}</Badge>
              <span>{formatDateTime(entry.at)}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
})

export default OrderDetails
