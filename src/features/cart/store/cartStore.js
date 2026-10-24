import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore, ownerKeyOf } from '../../auth/store/authStore'

export const EMPTY_CART = Object.freeze({ items: Object.freeze([]), coupon: null })

const MAX_QTY = 99
const sameId = (a, b) => String(a) === String(b)
const currentOwner = () => ownerKeyOf(useAuthStore.getState().user)

export const useCartStore = create(
  persist(
    (set) => {
      const update = (fn) =>
        set((state) => {
          const owner = currentOwner()
          const cart = state.carts[owner] ?? EMPTY_CART
          return { carts: { ...state.carts, [owner]: fn(cart) } }
        })

      return {
        carts: {},
        addItem: (product, qty = 1) => {
          const max = Math.min(MAX_QTY, Math.max(0, Math.floor(Number(product.stock) || 0)))
          if (!max) return 'unavailable'
          const wanted = Math.max(1, Math.floor(Number(qty) || 1))
          let result = 'added'
          update((cart) => {
            const existing = cart.items.find((item) => sameId(item.id, product.id))
            const current = existing?.qty ?? 0
            const next = Math.min(current + wanted, max)
            if (next === current) result = 'limit'
            else if (next < current + wanted) result = 'limited'
            if (next === current) return cart
            const items = existing
              ? cart.items.map((item) => (sameId(item.id, product.id) ? { ...item, qty: next } : item))
              : [...cart.items, { id: product.id, qty: next }]
            return { ...cart, items }
          })
          return result
        },
        setQty: (id, qty, max = MAX_QTY) =>
          update((cart) => ({
            ...cart,
            items: cart.items.map((item) =>
              sameId(item.id, id) ? { ...item, qty: Math.max(1, Math.min(Math.floor(Number(qty) || 1), max)) } : item,
            ),
          })),
        removeItem: (id) => update((cart) => ({ ...cart, items: cart.items.filter((item) => !sameId(item.id, id)) })),
        clear: () => update(() => EMPTY_CART),
        setCoupon: (coupon) => update((cart) => ({ ...cart, coupon })),
        removeCoupon: () => update((cart) => ({ ...cart, coupon: null })),
        mergeGuestInto: (ownerKey) =>
          set((state) => {
            const guest = state.carts.guest
            if (!guest?.items.length || ownerKey === 'guest') return state
            const target = state.carts[ownerKey] ?? EMPTY_CART
            const items = [...target.items]
            guest.items.forEach((entry) => {
              const found = items.findIndex((item) => sameId(item.id, entry.id))
              if (found >= 0) items[found] = { ...items[found], qty: Math.min(MAX_QTY, items[found].qty + entry.qty) }
              else items.push(entry)
            })
            return {
              carts: {
                ...state.carts,
                guest: EMPTY_CART,
                [ownerKey]: { items, coupon: target.coupon ?? guest.coupon },
              },
            }
          }),
      }
    },
    {
      name: 'darooyar-cart',
      version: 3,
      migrate: () => ({ carts: {} }),
    },
  ),
)

export function useCart() {
  const owner = useAuthStore((state) => ownerKeyOf(state.user))
  return useCartStore((state) => state.carts[owner] ?? EMPTY_CART)
}

let previousOwner = ownerKeyOf(useAuthStore.getState().user)
useAuthStore.subscribe((state) => {
  const owner = ownerKeyOf(state.user)
  if (owner !== previousOwner) {
    previousOwner = owner
    useCartStore.getState().mergeGuestInto(owner)
  }
})
