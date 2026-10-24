import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const DEFAULT_DESCRIPTION =
  'دارویار یک فروشگاه نمایشی محصولات مراقبتی است که برای نمایش مهارت‌های طراحی و توسعهٔ فرانت‌اند ساخته شده؛ سفارش و پرداخت واقعی نیست.'

function updateMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function useDocumentTitle(title, description) {
  const location = useLocation()
  useEffect(() => {
    const pageTitle = title ? `${title} | دارویار` : 'دارویار | فروشگاه نمایشی محصولات مراقبتی'
    const pageDescription =
      description?.trim() ||
      (title
        ? `${title}؛ بخشی از فروشگاه نمایشی دارویار. خرید و پرداخت واقعی در این نسخه فعال نیست.`
        : DEFAULT_DESCRIPTION)
    document.title = pageTitle
    updateMeta('name', 'description', pageDescription)
    updateMeta('property', 'og:title', pageTitle)
    updateMeta('property', 'og:description', pageDescription)
    updateMeta('property', 'og:type', location.pathname.startsWith('/articles/') ? 'article' : 'website')
    updateMeta('property', 'og:site_name', 'دارویار')
    const canonicalUrl = new URL(location.pathname, window.location.origin).href
    updateMeta('property', 'og:url', canonicalUrl)
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [title, description, location.pathname])
}

export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}

export function useCountdown() {
  const calc = () => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const diff = Math.max(0, end.getTime() - Date.now())
    return {
      hours: Math.floor(diff / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useDialogA11y(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const node = ref.current
    const items = () => (node ? [...node.querySelectorAll(FOCUSABLE)] : [])
    const raf = requestAnimationFrame(() => {
      const first = items()[0]
      if (first) first.focus()
      else node?.focus()
    })
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) {
        e.preventDefault()
        return
      }
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement && document.contains(previous)) previous.focus()
    }
  }, [open])

  return ref
}
