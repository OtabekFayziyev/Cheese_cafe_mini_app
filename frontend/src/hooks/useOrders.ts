import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderAPI } from '@/lib/api'
import { useUIStore } from '@/stores/ui.store'

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const { data } = await orderAPI.getMy()
      return data
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await orderAPI.getById(id)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  const showToast = useUIStore((s) => s.showToast)

  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await orderAPI.create(orderData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      showToast('Buyurtma muvaffaqiyatli yaratildi!', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Xatolik yuz berdi', 'error')
    },
  })
}
