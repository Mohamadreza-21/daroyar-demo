import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebounce } from './useUtils'

export function useUrlParams() {
  const [params, setParams] = useSearchParams()

  const update = useCallback(
    (patch, { resetPage = true, replace = false } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(patch).forEach(([key, value]) => {
            if (value === '' || value == null || value === false || value === 0) next.delete(key)
            else next.set(key, String(value === true ? 1 : value))
          })
          if (resetPage) next.delete('page')
          return next
        },
        { replace },
      )
    },
    [setParams],
  )

  const reset = useCallback(() => setParams({}), [setParams])
  const page = Math.max(1, Number(params.get('page')) || 1)
  const setPage = useCallback(
    (value, { replace = false } = {}) => update({ page: value <= 1 ? '' : value }, { resetPage: false, replace }),
    [update],
  )

  return { params, update, reset, page, setPage }
}

export function useSearchInput(urlValue, onCommit, delay = 350) {
  const [text, setText] = useState(urlValue)
  const debounced = useDebounce(text, delay)
  const dirty = useRef(false)
  const committed = useRef(urlValue)

  useEffect(() => {
    if (urlValue !== committed.current) {
      committed.current = urlValue
      dirty.current = false
      setText(urlValue)
    }
  }, [urlValue])

  useEffect(() => {
    const next = debounced.trim()
    if (dirty.current && next !== committed.current) {
      dirty.current = false
      committed.current = next
      onCommit(next)
    }
  }, [debounced, onCommit])

  const onChange = useCallback((value) => {
    dirty.current = true
    setText(value)
  }, [])
  const clear = useCallback(() => {
    dirty.current = false
    committed.current = ''
    setText('')
    onCommit('')
  }, [onCommit])

  return { text, onChange, clear }
}

export function useClampPage({ page, total, pageSize, ready, setPage }) {
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / pageSize))
  useEffect(() => {
    if (ready && page > totalPages) setPage(totalPages, { replace: true })
  }, [ready, page, totalPages, setPage])
  return { totalPages, current: Math.min(page, totalPages) }
}

export function usePrefetchNext({ current, totalPages, ready, queryKey, queryFn }) {
  const queryClient = useQueryClient()
  const key = JSON.stringify(queryKey)
  const fn = useRef(queryFn)
  fn.current = queryFn
  useEffect(() => {
    if (!ready || current >= totalPages) return
    queryClient.prefetchQuery({
      queryKey: JSON.parse(key),
      queryFn: ({ signal }) => fn.current(signal),
      staleTime: 60_000,
    })
  }, [ready, current, totalPages, key, queryClient])
}
