import { memo } from 'react'
import { Link } from 'react-router'
import { Clock, Mail, MapPin, Phone, ShieldCheck, Truck, Headset, BadgePercent } from 'lucide-react'
import Logo from '../common/Logo'
import { useCategories } from '../../../features/catalog/hooks/useCatalog'
import { resetDemoData } from '../../../mock/db'
import { BRAND, NAV_LINKS } from '../../utils/constants'

const PERKS = [
  { icon: Truck, title: 'ثبت سفارش', text: 'فرآیند سفارش فقط نمایشی است' },
  { icon: ShieldCheck, title: 'کاتالوگ نمونه', text: 'داده‌ها از بک‌اند شبیه‌سازی‌شدهٔ مرورگر' },
  { icon: Headset, title: 'فرم تماس', text: 'ارسال واقعی پیام فعال نیست' },
  { icon: BadgePercent, title: 'کوپن نمایشی', text: 'کد DAROO10 را در سبد امتحان کنید' },
]

const CONTACT_ITEM = 'flex items-start gap-2.5 text-[14px]'
const CONTACT_ICON = 'mt-[5px] shrink-0 text-primary'

const onReset = () => {
  resetDemoData()
  window.location.assign(import.meta.env.BASE_URL)
}

const Footer = memo(function Footer() {
  const { data: categories = [] } = useCategories()
  return (
    <footer className="mt-16 bg-[#0b2226] pb-[100px] text-white/78 [&_a:hover]:text-white [&_a]:transition-colors [&_a]:duration-200 [&_h4]:mb-4 [&_h4]:text-[16px] [&_h4]:text-white [&_li+li]:mt-2.5">
      <div className="site-container">
        <ul className="grid -translate-y-9 grid-cols-4 gap-4 max-[861px]:grid-cols-2 max-[641px]:grid-cols-1">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex items-center gap-3.5 rounded-[22px] bg-white px-5 py-[18px] text-ink shadow-md"
            >
              <span className="grid size-[52px] shrink-0 place-items-center rounded-md bg-primary-50 text-primary">
                <Icon size={24} />
              </span>
              <div>
                <b className="block leading-[1.4]">{title}</b>
                <p className="text-[12.5px] text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-[1.6fr_1fr_1fr_1.3fr] gap-10 pt-2 pb-10 max-[861px]:grid-cols-2 max-[641px]:grid-cols-1">
          <div className="max-[861px]:col-span-full">
            <Logo light />
            <p className="mt-4 max-w-[340px] text-[14px] leading-[2]">
              {BRAND.name} یک نمونه‌کار فرانت‌اند برای نمایش تجربهٔ فروشگاه محصولات بهداشتی و مراقبتی است. اطلاعات
              کالاها، کاربران و سفارش‌ها نمایشی‌اند و خدمت واقعی ارائه نمی‌شود.
            </p>
          </div>
          <nav aria-label="دسترسی سریع">
            <h4>دسترسی سریع</h4>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/login">ورود / ثبت‌نام</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="دسته‌بندی‌ها">
            <h4>دسته‌بندی‌ها</h4>
            <ul>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link to={`/shop?category=${category.slug}`}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h4>تماس با ما</h4>
            <ul>
              <li className={CONTACT_ITEM}>
                <Phone size={16} className={CONTACT_ICON} /> <a href={`tel:${BRAND.phoneRaw}`}>{BRAND.phone}</a>
              </li>
              <li className={CONTACT_ITEM}>
                <Mail size={16} className={CONTACT_ICON} /> <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </li>
              <li className={CONTACT_ITEM}>
                <MapPin size={16} className={CONTACT_ICON} /> <span>{BRAND.address}</span>
              </li>
              <li className={CONTACT_ITEM}>
                <Clock size={16} className={CONTACT_ICON} /> <span>{BRAND.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-6 text-[13px] text-white/55">
          <p>
            © {BRAND.name} — پروژهٔ نمایشی؛ محصولات، قیمت‌ها و نویسندگان ساختگی‌اند. اطلاعات این سایت جایگزین مشورت پزشک
            یا داروساز نیست.
          </p>
          <p>
            داده‌ها فقط در مرورگر شما ذخیره می‌شود.{' '}
            <button type="button" className="font-bold text-white/80 underline" onClick={onReset}>
              بازنشانی داده‌های نمایشی
            </button>
          </p>
        </div>
      </div>
    </footer>
  )
})

export default Footer
