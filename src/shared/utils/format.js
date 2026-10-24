import { twMerge } from 'tailwind-merge'

const numberFormat = new Intl.NumberFormat('fa-IR')
const dateFormat = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
const dateTimeFormat = new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatNumber = (n) => numberFormat.format(n ?? 0)
export const formatToman = (n) => `${numberFormat.format(Math.round(n ?? 0))} تومان`
export const formatDate = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : dateFormat.format(d)
}
export const formatDateTime = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : dateTimeFormat.format(d)
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩'
export const toEnglishDigits = (value) =>
  typeof value === 'string'
    ? value.replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d)).replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d))
    : value

export const cn = (...parts) => twMerge(parts.filter(Boolean).join(' '))
export const initials = (first = '', last = '') => `${first.charAt(0)}${last.charAt(0)}`.trim() || 'د'
