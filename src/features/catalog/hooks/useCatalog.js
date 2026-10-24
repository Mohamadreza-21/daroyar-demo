import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  createReview,
  fetchCatalogMeta,
  fetchCategories,
  fetchProduct,
  fetchProducts,
  fetchReviews,
} from '../api/catalog'
import { keys } from '../../../shared/hooks/queryKeys'

const MINUTE = 60 * 1000

export const useProducts = (params, options = {}) =>
  useQuery({
    queryKey: keys.productList(params),
    queryFn: ({ signal }) => fetchProducts(params, signal),
    placeholderData: keepPreviousData,
    staleTime: MINUTE,
    ...options,
  })

export const useCategories = () =>
  useQuery({ queryKey: keys.categories, queryFn: ({ signal }) => fetchCategories(signal), staleTime: 30 * MINUTE })

export const useCatalogMeta = () =>
  useQuery({ queryKey: keys.catalogMeta, queryFn: ({ signal }) => fetchCatalogMeta(signal), staleTime: 5 * MINUTE })

export function useCategoryMap() {
  const { data } = useCategories()
  return useMemo(() => new Map((data ?? []).map((category) => [category.slug, category])), [data])
}

export const useCategoryLabel = (slug) => useCategoryMap().get(slug)?.label ?? slug

function findInListCaches(queryClient, id) {
  for (const [, data] of queryClient.getQueriesData({ queryKey: ['products', 'list'] })) {
    const found = data?.items?.find((product) => String(product.id) === String(id))
    if (found) return found
  }
  return undefined
}

export function useProduct(id) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: keys.product(id),
    enabled: Boolean(id),
    queryFn: ({ signal }) => fetchProduct(id, signal),
    placeholderData: () => findInListCaches(queryClient, id),
    staleTime: MINUTE,
  })
}

export const useRelatedProducts = (product) =>
  useQuery({
    queryKey: keys.related(product?.id),
    enabled: Boolean(product),
    queryFn: ({ signal }) =>
      fetchProducts(
        { category: product.category, exclude: product.id, available: true, sort: 'popular', limit: 10 },
        signal,
      ).then((result) => result.items),
    staleTime: MINUTE,
  })

export const useReviews = (productId) =>
  useQuery({
    queryKey: keys.reviews(productId),
    enabled: Boolean(productId),
    queryFn: ({ signal }) => fetchReviews(productId, signal),
    staleTime: 5 * MINUTE,
  })

export function useAddReview(productId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values) => createReview({ ...values, productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.reviews(productId) })
      queryClient.invalidateQueries({ queryKey: keys.products })
    },
  })
}
