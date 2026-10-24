import { memo } from 'react'
import { Headset, ShieldCheck, Truck, Undo2 } from 'lucide-react'

const ITEMS = [
  { icon: Truck, title: 'سفارش آزمایشی', text: 'بدون ارسال یا پرداخت واقعی' },
  { icon: ShieldCheck, title: 'داده‌های نمونه', text: 'قیمت و موجودی برای دمو' },
  { icon: Undo2, title: 'سبد خرید پایدار', text: 'پس از Refresh هم حفظ می‌شود' },
  { icon: Headset, title: 'بک‌اند شبیه‌سازی‌شده', text: 'داده‌ها در مرورگر شما ذخیره می‌شود و پرداخت نمایشی است' },
]

const TrustBar = memo(function TrustBar() {
  return (
    <section className="site-container mt-7" aria-label="مزایای خرید">
      <ul className="grid grid-cols-4 gap-4 max-[1025px]:grid-cols-2 max-[561px]:grid-cols-1">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex items-center gap-3.5 rounded-[20px] border border-line bg-surface px-5 py-[18px] text-primary [transition:transform_0.25s,translate_0.25s,rotate_0.25s,scale_0.25s,box-shadow_0.25s] hover:-translate-y-[3px] hover:shadow-sm"
          >
            <Icon size={26} />
            <div>
              <b className="block text-ink">{title}</b>
              <p className="text-[12.5px] text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
})

export default TrustBar
