import { api, totalOf } from '../../../shared/api/client'

export const sendContactMessage = (values) => api.post('/messages', values).then((r) => r.data)
export const subscribeNewsletter = (values) => api.post('/subscribers', values).then((r) => r.data)

export const fetchMyMessages = (signal) => api.get('/messages/mine', { signal }).then((r) => r.data)

export async function fetchAdminMessages(params, signal) {
  const response = await api.get('/messages', { params, signal })
  return { items: response.data, total: totalOf(response) }
}

export const replyToMessage = ({ id, reply }) => api.post(`/messages/${id}/reply`, { reply }).then((r) => r.data)
