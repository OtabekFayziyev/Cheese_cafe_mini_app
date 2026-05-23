import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI } from '@/lib/api'
import { useUIStore } from '@/stores/ui.store'

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await userAPI.getAddresses()
      return data
    },
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  const showToast = useUIStore((s) => s.showToast)

  return useMutation({
    mutationFn: async (address: any) => {
      const { data } = await userAPI.createAddress(address)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      showToast('Manzil qo\'shildi', 'success')
    },
    onError: () => {
      showToast('Xatolik yuz berdi', 'error')
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  const showToast = useUIStore((s) => s.showToast)

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await userAPI.updateAddress(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      showToast('Manzil yangilandi', 'success')
    },
    onError: () => {
      showToast('Xatolik yuz berdi', 'error')
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  const showToast = useUIStore((s) => s.showToast)

  return useMutation({
    mutationFn: async (id: string) => {
      await userAPI.deleteAddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      showToast('Manzil o\'chirildi', 'success')
    },
    onError: () => {
      showToast('Xatolik yuz berdi', 'error')
    },
  })
}
