import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DeliveryAddress } from '@/types/order'

interface UserState {
  // User data
  id: string | null
  telegramId: number | null
  firstName: string
  lastName: string
  username: string
  phone: string
  phoneSecondary: string
  photoUrl: string
  language: 'uz' | 'ru' | 'en'
  totalOrders: number
  bonusPoints: number

  // Manzillar
  addresses: DeliveryAddress[]
  selectedAddressIndex: number

  // Actions
  setUser: (data: {
    id: string
    firstName: string
    lastName?: string
    username?: string
    phone?: string
    photoUrl?: string
    language?: string
    totalOrders?: number
    bonusPoints?: number
  }) => void
  setTelegramData: (data: {
    telegramId: number
    firstName: string
    lastName?: string
    username?: string
    photoUrl?: string
  }) => void
  setPhone: (phone: string) => void
  setPhoneSecondary: (phone: string) => void
  addAddress: (address: DeliveryAddress) => void
  updateAddress: (index: number, address: DeliveryAddress) => void
  removeAddress: (index: number) => void
  selectAddress: (index: number) => void
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void
  getSelectedAddress: () => DeliveryAddress | null
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: null,
      telegramId: null,
      firstName: '',
      lastName: '',
      username: '',
      photoUrl: '',
      phone: '',
      phoneSecondary: '',
      addresses: [],
      selectedAddressIndex: -1,
      language: 'uz',
      totalOrders: 0,
      bonusPoints: 0,

      setUser: (data) =>
        set({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName || '',
          username: data.username || '',
          phone: data.phone || '',
          photoUrl: data.photoUrl || '',
          language: (data.language as 'uz' | 'ru' | 'en') || 'uz',
          totalOrders: data.totalOrders || 0,
          bonusPoints: data.bonusPoints || 0,
        }),

      setTelegramData: (data) =>
        set({
          telegramId: data.telegramId,
          firstName: data.firstName,
          lastName: data.lastName ?? '',
          username: data.username ?? '',
          photoUrl: data.photoUrl ?? '',
        }),

      setPhone: (phone) => set({ phone }),
      setPhoneSecondary: (phone) => set({ phoneSecondary: phone }),

      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
          // Avtomatik tanlash agar bu birinchi manzil bo'lsa
          selectedAddressIndex:
            state.addresses.length === 0 ? 0 : state.selectedAddressIndex,
        })),

      updateAddress: (index, address) =>
        set((state) => ({
          addresses: state.addresses.map((a, i) => (i === index ? address : a)),
        })),

      removeAddress: (index) =>
        set((state) => ({
          addresses: state.addresses.filter((_, i) => i !== index),
          selectedAddressIndex:
            state.selectedAddressIndex === index
              ? -1
              : state.selectedAddressIndex > index
              ? state.selectedAddressIndex - 1
              : state.selectedAddressIndex,
        })),

      selectAddress: (index) => set({ selectedAddressIndex: index }),

      setLanguage: (lang) => set({ language: lang }),

      getSelectedAddress: () => {
        const { addresses, selectedAddressIndex } = get()
        return addresses[selectedAddressIndex] ?? null
      },
    }),
    {
      name: 'cheese-cafe-user',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
