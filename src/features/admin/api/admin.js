import { api, totalOf } from '../../../shared/api/client'
import { normalizeProduct } from '../../catalog/api/catalog'

export const fetchStats = (signal) => api.get('/stats', { signal }).then((r) => r.data)

export async function fetchUsers(params, signal) {
  const response = await api.get('/users', { params, signal })
  return { items: response.data, total: totalOf(response) }
}

const productPayload = (form) => ({
  title: form.title,
  brand: form.brand,
  category: form.category,
  basePrice: form.basePrice,
  discount: form.discount,
  stock: form.stock,
  thumbnail: form.thumbnail,
  description: form.description,
})

export const createProduct = (form) => api.post('/products', productPayload(form)).then((r) => normalizeProduct(r.data))
export const updateProduct = ({ id, form }) =>
  api.patch(`/products/${id}`, productPayload(form)).then((r) => normalizeProduct(r.data))
export const updateStock = ({ id, stock }) =>
  api.patch(`/products/${id}/stock`, { stock }).then((r) => normalizeProduct(r.data))
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(() => id)

export const createCategory = (form) => api.post('/categories', form).then((r) => r.data)
export const updateCategory = ({ id, form }) => api.patch(`/categories/${id}`, form).then((r) => r.data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then(() => id)
