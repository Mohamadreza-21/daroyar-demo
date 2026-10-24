import axios from 'axios'
import { useAuthStore } from '../../features/auth/store/authStore'
import { mockAdapter } from '../../mock/adapter'

export class ApiError extends Error {
  constructor(message, status = 0, { code, fieldErrors, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors ?? null
    this.data = data ?? null
  }
}

export const api = axios.create({ baseURL: '/api', timeout: 15000, adapter: mockAdapter })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
  return config
})

const emptyBody = (data) => data == null || data === ''

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof ApiError || axios.isCancel(error)) return Promise.reject(error)
    const response = error.response
    const data = response?.data
    const serverDown = !response || (response.status >= 500 && emptyBody(data))
    const status = serverDown ? (error.code === 'ECONNABORTED' ? 408 : 0) : response.status
    const code = data?.code
    if (status === 401 && ['SESSION_EXPIRED', 'UNAUTHENTICATED'].includes(code) && useAuthStore.getState().token) {
      useAuthStore.getState().expireSession()
    }
    const message = serverDown
      ? status === 408
        ? 'پاسخ سرور طول کشید'
        : 'Network Error'
      : (typeof data?.message === 'string' && data.message) || error.message
    return Promise.reject(new ApiError(message, status, { code, fieldErrors: data?.errors, data }))
  },
)

export const totalOf = (response) => Number(response.headers['x-total-count'] ?? 0)

export function applyServerErrors(error, setError) {
  if (!error?.fieldErrors) return false
  const entries = Object.entries(error.fieldErrors)
  entries.forEach(([field, message]) => setError(field.replace(/^shipping\./, ''), { type: 'server', message }))
  return entries.length > 0
}
