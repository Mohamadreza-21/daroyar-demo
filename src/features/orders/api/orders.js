import { api, totalOf } from '../../../shared/api/client'
import { assetUrl } from '../../../shared/utils/image'

const normalizeOrder = (order) => ({
  ...order,
  items: order.items.map((item) => ({ ...item, thumbnail: assetUrl(item.thumbnail) })),
})

export async function fetchOrders(params = {}, signal) {
  const response = await api.get('/orders', { params, signal })
  return { items: response.data.map(normalizeOrder), total: totalOf(response) }
}

export const fetchOrder = (id, signal) =>
  api.get(`/orders/${encodeURIComponent(id)}`, { signal }).then((r) => normalizeOrder(r.data))

export const createOrder = (payload) => api.post('/orders', payload).then((r) => normalizeOrder(r.data))
export const cancelOrder = (id) =>
  api.post(`/orders/${encodeURIComponent(id)}/cancel`).then((r) => normalizeOrder(r.data))
export const updateOrderStatus = ({ id, status }) =>
  api.patch(`/orders/${encodeURIComponent(id)}/status`, { status }).then((r) => normalizeOrder(r.data))

export const validateCoupon = (code) => api.post('/coupons/validate', { code }).then((r) => r.data)
export const fetchShippingMethods = (signal) => api.get('/shippingMethods', { signal }).then((r) => r.data)
