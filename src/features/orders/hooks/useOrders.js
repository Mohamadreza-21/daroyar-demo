import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cancelOrder, createOrder, fetchOrder, fetchOrders, updateOrderStatus, validateCoupon } from '../api/orders'
import { useAuthStore } from '../../auth/store/authStore'
import { useCartStore } from '../../cart/store/cartStore'
import { keys } from '../../../shared/hooks/queryKeys'

export const useOrders = (params) => {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: keys.orderList({ userId, ...params }),
    enabled: Boolean(userId),
    queryFn: ({ signal }) => fetchOrders(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export const useOrder = (id) =>
  useQuery({
    queryKey: keys.order(id),
    enabled: Boolean(id),
    queryFn: ({ signal }) => fetchOrder(id, signal),
    staleTime: 30 * 1000,
  })

function useAfterOrderChange() {
  const queryClient = useQueryClient()
  return (order) => {
    if (order) queryClient.setQueryData(keys.order(order.id), order)
    queryClient.invalidateQueries({ queryKey: keys.orders })
    queryClient.invalidateQueries({ queryKey: keys.products })
    queryClient.invalidateQueries({ queryKey: keys.adminStats })
  }
}

export function useCreateOrder() {
  const afterChange = useAfterOrderChange()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      useCartStore.getState().clear()
      afterChange(order)
    },
    onError: (error) => {
      if (['CART_CHANGED', 'PRICE_CHANGED'].includes(error.code)) {
        queryClient.invalidateQueries({ queryKey: keys.products })
      }
    },
  })
}

export const useCancelOrder = () => {
  const afterChange = useAfterOrderChange()
  return useMutation({ mutationFn: cancelOrder, onSuccess: afterChange })
}

export const useUpdateOrderStatus = () => {
  const afterChange = useAfterOrderChange()
  return useMutation({ mutationFn: updateOrderStatus, onSuccess: afterChange })
}

export const useApplyCoupon = () => useMutation({ mutationFn: validateCoupon })
