import { api } from '../../../shared/api/client'

export const login = (values) => api.post('/auth/login', values).then((r) => r.data)
export const register = (values) => api.post('/auth/register', values).then((r) => r.data)
export const logout = () => api.post('/auth/logout').then(() => null)
export const fetchMe = (signal) => api.get('/auth/me', { signal }).then((r) => r.data)
export const updateProfile = (values) => api.patch('/auth/me', values).then((r) => r.data.user)
