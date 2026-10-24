import { Hourglass, Lock, SearchX, ServerCrash, ShieldAlert, TriangleAlert, WifiOff, Wrench } from 'lucide-react'
import { isRouteErrorResponse } from 'react-router'

export const ERROR_CONTENT = {
  0: {
    code: '!',
    icon: WifiOff,
    tone: 'warn',
    title: 'ارتباط با اینترنت برقرار نیست',
    text: 'اتصال شما قطع شده یا سرور در دسترس نیست. اینترنت را بررسی کنید و دوباره تلاش کنید.',
  },
  400: {
    code: '۴۰۰',
    icon: TriangleAlert,
    tone: 'warn',
    title: 'درخواست نامعتبر است',
    text: 'اطلاعات ارسال‌شده درست نبود. لطفاً دوباره تلاش کنید.',
  },
  401: {
    code: '۴۰۱',
    icon: Lock,
    tone: 'info',
    title: 'ابتدا وارد حساب خود شوید',
    text: 'برای دیدن این بخش باید وارد حساب کاربری شوید.',
    login: true,
  },
  403: {
    code: '۴۰۳',
    icon: ShieldAlert,
    tone: 'danger',
    title: 'اجازهٔ دسترسی ندارید',
    text: 'حساب شما به این بخش دسترسی ندارد. اگر فکر می‌کنید اشتباه است با پشتیبانی تماس بگیرید.',
  },
  404: {
    code: '۴۰۴',
    icon: SearchX,
    tone: 'primary',
    title: 'صفحه‌ای که دنبالش بودید پیدا نشد',
    text: 'ممکن است نشانی را اشتباه وارد کرده باشید یا صفحه جابه‌جا شده باشد.',
  },
  408: {
    code: '۴۰۸',
    icon: Hourglass,
    tone: 'warn',
    title: 'پاسخ سرور طول کشید',
    text: 'اتصال بیش از حد کند بود. چند لحظه بعد دوباره تلاش کنید.',
  },
  429: {
    code: '۴۲۹',
    icon: Hourglass,
    tone: 'warn',
    title: 'درخواست‌ها بیش از حد مجاز است',
    text: 'کمی صبر کنید و دوباره امتحان کنید.',
  },
  500: {
    code: '۵۰۰',
    icon: ServerCrash,
    tone: 'danger',
    title: 'مشکلی در سرور رخ داد',
    text: 'متأسفیم! خطایی غیرمنتظره پیش آمد. تیم فنی در جریان است؛ کمی بعد دوباره تلاش کنید.',
  },
  503: {
    code: '۵۰۳',
    icon: Wrench,
    tone: 'info',
    title: 'سرویس موقتاً در دسترس نیست',
    text: 'در حال به‌روزرسانی هستیم. به‌زودی برمی‌گردیم.',
  },
  default: {
    code: '!',
    icon: TriangleAlert,
    tone: 'danger',
    title: 'خطایی رخ داد',
    text: 'مشکلی پیش آمد. دوباره تلاش کنید یا به صفحهٔ اصلی بروید.',
  },
}

export function resolveErrorStatus(error) {
  if (!error) return 'default'
  if (isRouteErrorResponse(error)) return error.status
  if (typeof error.status === 'number') return error.status
  if (error.message === 'Network Error') return 0
  return 500
}
