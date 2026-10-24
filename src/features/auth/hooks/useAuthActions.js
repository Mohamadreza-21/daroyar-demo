import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import * as authApi from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { keys } from '../../../shared/hooks/queryKeys'

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({ mutationFn: authApi.login, onSuccess: setSession })
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({ mutationFn: authApi.register, onSuccess: setSession })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  return useMutation({
    mutationFn: () => authApi.logout().catch(() => null),
    onSettled: logout,
  })
}

export function useUpdateProfile() {
  const updateUser = useAuthStore((s) => s.updateUser)
  return useMutation({ mutationFn: authApi.updateProfile, onSuccess: updateUser })
}

export function useSessionSync() {
  const token = useAuthStore((s) => s.token)
  const updateUser = useAuthStore((s) => s.updateUser)
  const expired = useAuthStore((s) => s.sessionExpired)
  const me = useQuery({
    queryKey: keys.me,
    queryFn: ({ signal }) => authApi.fetchMe(signal),
    enabled: Boolean(token),
    retry: false,
  })

  useEffect(() => {
    const fresh = me.data?.user
    if (fresh && JSON.stringify(fresh) !== JSON.stringify(useAuthStore.getState().user)) updateUser(fresh)
  }, [me.data, updateUser])

  useEffect(() => {
    if (expired) toast.warning('نشست شما منقضی شد؛ برای ادامه دوباره وارد شوید.', { id: 'session-expired' })
  }, [expired])
}
