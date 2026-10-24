import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresAt: null,
      sessionExpired: false,
      setSession: ({ user, token, expiresAt }) => set({ user, token, expiresAt, sessionExpired: false }),
      updateUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null, expiresAt: null, sessionExpired: false }),
      expireSession: () => {
        if (get().token) set({ user: null, token: null, expiresAt: null, sessionExpired: true })
      },
      clearExpiredNotice: () => set({ sessionExpired: false }),
    }),
    {
      name: 'darooyar-auth',
      version: 4,
      partialize: ({ user, token, expiresAt }) => ({ user, token, expiresAt }),
      migrate: () => ({ user: null, token: null, expiresAt: null }),
      onRehydrateStorage: () => (state) => {
        if (state?.expiresAt && new Date(state.expiresAt) <= new Date()) state.expireSession()
      },
    },
  ),
)

export const ownerKeyOf = (user) => String(user?.id ?? 'guest')
