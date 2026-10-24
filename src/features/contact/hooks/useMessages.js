import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdminMessages, fetchMyMessages, replyToMessage, sendContactMessage } from '../api/contact'
import { useAuthStore } from '../../auth/store/authStore'
import { keys } from '../../../shared/hooks/queryKeys'

export const useMyMessages = () => {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: [...keys.myMessages, userId],
    enabled: Boolean(userId),
    queryFn: ({ signal }) => fetchMyMessages(signal),
    staleTime: 30 * 1000,
  })
}

export const useAdminMessages = (params) =>
  useQuery({
    queryKey: keys.adminMessages(params),
    queryFn: ({ signal }) => fetchAdminMessages(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.messages }),
  })
}

export function useReplyMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: replyToMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] })
      queryClient.invalidateQueries({ queryKey: keys.messages })
    },
  })
}
