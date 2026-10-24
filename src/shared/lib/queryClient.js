import { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../features/auth/store/authStore'

const NO_RETRY = [400, 401, 403, 404, 409, 422, 429]

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (count, error) => !NO_RETRY.includes(error?.status) && count < 1,
    },
    mutations: { retry: false },
  },
})

useAuthStore.subscribe((state, previous) => {
  if (previous.user && !state.user) {
    queryClient.removeQueries({ queryKey: ['orders'] })
    queryClient.removeQueries({ queryKey: ['wishlist'] })
    queryClient.removeQueries({ queryKey: ['messages'] })
    queryClient.removeQueries({ queryKey: ['admin'] })
    queryClient.removeQueries({ queryKey: ['me'] })
  }
})
