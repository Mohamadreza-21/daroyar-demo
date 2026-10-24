import { api } from '../../../shared/api/client'

export const fetchWishlist = (signal) => api.get('/wishlist', { signal }).then((r) => r.data.productIds)
export const addToWishlist = (id) => api.put(`/wishlist/${id}`).then((r) => r.data.productIds)
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`).then((r) => r.data.productIds)
