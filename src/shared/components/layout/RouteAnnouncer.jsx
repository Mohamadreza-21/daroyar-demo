import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

const PRIVATE = /^\/(admin|account|checkout|cart|login|register|order-success)(\/|$)/

export default function RouteAnnouncer() {
  const { pathname } = useLocation()
  const [message, setMessage] = useState('')
  const first = useRef(true)

  useEffect(() => {
    let robots = document.head.querySelector('meta[name="robots"]')
    if (PRIVATE.test(pathname)) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        document.head.appendChild(robots)
      }
      robots.content = 'noindex,nofollow'
    } else robots?.remove()

    if (first.current) {
      first.current = false
      return undefined
    }
    const id = setTimeout(() => {
      setMessage(document.title)
      const main = document.getElementById('main')
      if (main) {
        main.setAttribute('tabindex', '-1')
        main.focus({ preventScroll: true })
      }
    }, 150)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}
