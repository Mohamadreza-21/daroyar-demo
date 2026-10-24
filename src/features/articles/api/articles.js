import { api, ApiError } from '../../../shared/api/client'

export const fetchArticles = (signal) => api.get('/articles', { signal }).then((r) => r.data)

export async function fetchArticle(slug, signal) {
  const { data } = await api.get('/articles', { params: { slug }, signal })
  if (!data.length) throw new ApiError('مقاله‌ای با این نشانی پیدا نشد', 404)
  return data[0]
}
