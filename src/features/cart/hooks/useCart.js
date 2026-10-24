import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProductsByIds } from '../../catalog/api/catalog'
import { fetchShippingMethods } from '../../orders/api/orders'
import { useCart } from '../store/cartStore'
import { buildCartLines, calcTotals } from '../../../shared/utils/pricing'
import { keys } from '../../../shared/hooks/queryKeys'

const sortedIds = (items) => items.map((item) => String(item.id)).sort((a, b) => Number(a) - Number(b))

export function useCartSummary(shippingMethodId, { enabled = true } = {}) {
  const { items, coupon } = useCart()
  const ids = useMemo(() => sortedIds(items), [items])
  const products = useQuery({
    queryKey: keys.productIds(ids),
    enabled: enabled && ids.length > 0,
    queryFn: ({ signal }) => fetchProductsByIds(ids, signal),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
  const shipping = useQuery({
    queryKey: keys.shipping,
    enabled,
    queryFn: ({ signal }) => fetchShippingMethods(signal),
    staleTime: 30 * 60 * 1000,
  })
  const method = shipping.data?.find((entry) => entry.id === shippingMethodId) ?? shipping.data?.[0] ?? null

  const state =
    products.isError && !products.data
      ? 'error'
      : ids.length > 0 && (products.isPending || products.isPlaceholderData)
        ? 'loading'
        : 'ok'
  const lines = useMemo(() => buildCartLines(items, products.data ?? [], state), [items, products.data, state])
  const totals = useMemo(() => calcTotals(lines, coupon, method), [lines, coupon, method])

  return {
    items,
    coupon,
    lines,
    totals,
    method,
    shippingMethods: shipping.data ?? [],
    isEmpty: items.length === 0,
    isPending: enabled && ids.length > 0 && (products.isPending || shipping.isPending),
    isError: products.isError || shipping.isError,
    error: products.error ?? shipping.error,
    refetch: () => Promise.all([products.refetch(), shipping.refetch()]),
    hasProblems: lines.some((line) => !line.available || line.limited),
  }
}

export function useCartBadge() {
  const { items } = useCart()
  const ids = useMemo(() => sortedIds(items), [items])
  const { data } = useQuery({
    queryKey: keys.productIds(ids),
    enabled: false,
    queryFn: ({ signal }) => fetchProductsByIds(ids, signal),
  })
  return useMemo(() => {
    const byId = new Map((data ?? []).map((product) => [String(product.id), product]))
    return items.reduce((sum, item) => {
      const product = byId.get(String(item.id))
      return sum + (product ? Math.min(item.qty, Math.max(0, Number(product.stock) || 0)) : item.qty)
    }, 0)
  }, [items, data])
}
