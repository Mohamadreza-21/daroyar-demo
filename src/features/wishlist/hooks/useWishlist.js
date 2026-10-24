import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../api/wishlist'
import { useAuthStore } from '../../auth/store/authStore'
import { keys } from '../../../shared/hooks/queryKeys'

const EMPTY = []

export function useWishlist() {
  const userId = useAuthStore((s) => s.user?.id)
  const isCustomer = useAuthStore((s) => s.user?.role === 'customer')
  return useQuery({
    queryKey: [...keys.wishlist, userId],
    enabled: isCustomer,
    queryFn: ({ signal }) => fetchWishlist(signal),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCanWish = () => useAuthStore((s) => s.user?.role !== 'admin')

export function useWishlistIds() {
  return useWishlist().data ?? EMPTY
}

export const useIsWished = (id) => {
  const ids = useWishlistIds()
  return useMemo(() => ids.includes(Number(id)), [ids, id])
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id)
  const key = [...keys.wishlist, userId]
  return useMutation({
    mutationFn: ({ id, wished }) => (wished ? removeFromWishlist(id) : addToWishlist(id)),
    onMutate: async ({ id, wished }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData(key) ?? []
      queryClient.setQueryData(key, wished ? previous.filter((item) => item !== id) : [...previous, id])
      return { previous }
    },
    onError: (_error, _vars, context) => queryClient.setQueryData(key, context?.previous ?? []),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  })
}
