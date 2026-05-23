import { useQuery } from '@tanstack/react-query'
import { menuAPI } from '@/lib/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await menuAPI.getCategories()
      return data
    },
  })
}

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const { data } = await menuAPI.getProducts(categoryId)
      return data
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await menuAPI.getProduct(id)
      return data
    },
    enabled: !!id,
  })
}
