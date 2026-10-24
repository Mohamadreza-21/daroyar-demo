import { memo } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { BadgeCheck, HeartPulse, ShieldCheck } from 'lucide-react'
import Logo from '../../../shared/components/common/Logo'

const POINTS = [
  { icon: ShieldCheck, text: 'ورود و ثبت‌نام با API آزمایشی' },
  { icon: HeartPulse, text: 'اطلاعات ساختگی مخصوص نمونه‌کار' },
  { icon: BadgeCheck, text: 'مشاهدهٔ سفارش‌های آزمایشی' },
]

const AuthShell = memo(function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] max-[1024px]:grid-cols-1">
      <aside className="relative flex flex-col justify-between gap-8 overflow-hidden bg-[linear-gradient(150deg,#0b8576,#0e2a2f)] p-10 text-white max-[1024px]:hidden">
        <div className="relative -end-[100px] -top-[120px] size-[360px] rounded-full bg-white/8" />
        <div className="relative -start-[60px] -bottom-20 size-[260px] rounded-full bg-[rgba(255,122,89,0.22)]" />
        <Logo light className="relative" />
        <div className="relative">
          <h2 className="mb-3 text-[clamp(24px,3vw,34px)] leading-[1.5]">به خانوادهٔ دارویار خوش آمدید</h2>
          <p className="max-w-[420px] leading-[2] opacity-85">
            یک حساب نمایشی بسازید و جریان ورود، ثبت‌نام و پیگیری سفارش را در این پروژه بررسی کنید. از گذرواژهٔ واقعی
            استفاده نکنید.
          </p>
          <ul className="mt-6 grid gap-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 font-bold">
                <Icon size={20} className="text-gold" /> {text}
              </li>
            ))}
          </ul>
        </div>
        <small className="relative opacity-60">© دارویار</small>
      </aside>
      <main className="grid place-items-center bg-bg px-5 py-8" id="main">
        <motion.div
          className="grid w-[min(100%,540px)] gap-3.5 rounded-xl border border-line bg-surface p-[clamp(24px,4vw,40px)] shadow-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.8, 0.3, 1] }}
        >
          <div className="hidden max-[1024px]:block">
            <Logo />
          </div>
          <h1 className="text-[26px]">{title}</h1>
          <p className="text-muted">{subtitle}</p>
          {children}
          <p className="text-center text-[14px] text-muted [&_a]:font-extrabold [&_a]:text-primary-700">{footer}</p>
          <Link to="/" className="text-center text-[13px] text-muted hover:text-primary-700">
            ← بازگشت به فروشگاه
          </Link>
        </motion.div>
      </main>
    </div>
  )
})

export default AuthShell
