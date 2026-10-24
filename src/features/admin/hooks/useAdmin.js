import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchStats,
  fetchUsers,
  updateCategory,
  updateProduct,
  updateStock,
} from '../api/admin'
import { keys } from '../../../shared/hooks/queryKeys'

export const useStats = () => useQuery({ queryKey: keys.adminStats, queryFn: ({ signal }) => fetchStats(signal) })

export const useUsers = (params) =>
  useQuery({
    queryKey: keys.adminUsers(params),
    queryFn: ({ signal }) => fetchUsers(params, signal),
    placeholderData: keepPreviousData,
  })

function useAfterProductChange() {
  const queryClient = useQueryClient()
  return {
    list: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['products', 'ids'] })
      queryClient.invalidateQueries({ queryKey: ['products', 'related'] })
      queryClient.invalidateQueries({ queryKey: keys.catalogMeta })
      queryClient.invalidateQueries({ queryKey: keys.adminStats })
    },
    detail: (product) => queryClient.setQueryData(keys.product(product.id), product),
    remove: (id) => queryClient.removeQueries({ queryKey: keys.product(id), exact: true }),
  }
}

export function useProductMutations() {
  const after = useAfterProductChange()
  const create = useMutation({ mutationFn: createProduct, onSuccess: after.list })
  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: (product) => {
      after.detail(product)
      after.list()
    },
  })
  const stock = useMutation({
    mutationFn: updateStock,
    onSuccess: (product) => {
      after.detail(product)
      after.list()
    },
  })
  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (id) => {
      after.remove(id)
      after.list()
    },
  })
  return { create, update, stock, remove }
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()
  const done = () => {
    queryClient.invalidateQueries({ queryKey: keys.categories })
    queryClient.invalidateQueries({ queryKey: keys.catalogMeta })
    queryClient.invalidateQueries({ queryKey: keys.adminStats })
  }
  return {
    create: useMutation({ mutationFn: createCategory, onSuccess: done }),
    update: useMutation({ mutationFn: updateCategory, onSuccess: done }),
    remove: useMutation({ mutationFn: deleteCategory, onSuccess: done }),
  }
}
