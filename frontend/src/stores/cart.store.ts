import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types/menu'

interface CartState {
  items: CartItem[]

  // Aksiyalar
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  updateComment: (productId: string, comment: string, variantId?: string) => void
  clearCart: () => void

  // Getter helperlar
  getItemQuantity: (productId: string, variantId?: string) => number
  getTotalCount: () => number
}

// Bir xil mahsulotni topish uchun (variant + addons hisobida)
function isSameItem(a: CartItem, productId: string, variantId?: string): boolean {
  return a.productId === productId && a.variantId === variantId
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingIdx = state.items.findIndex((i) =>
            isSameItem(i, newItem.productId, newItem.variantId)
          )

          if (existingIdx >= 0) {
            // Agar shu mahsulot bor bo'lsa — sonini oshirish
            const updated = [...state.items]
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: updated[existingIdx].quantity + 1,
            }
            return { items: updated }
          }

          // Yangi mahsulot
          return { items: [...state.items, { ...newItem, quantity: 1 }] }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => {
          const idx = state.items.findIndex((i) => isSameItem(i, productId, variantId))
          if (idx < 0) return state

          const updated = [...state.items]
          if (updated[idx].quantity > 1) {
            updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 }
          } else {
            updated.splice(idx, 1)
          }
          return { items: updated }
        })
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => !isSameItem(i, productId, variantId)),
            }
          }
          return {
            items: state.items.map((i) =>
              isSameItem(i, productId, variantId) ? { ...i, quantity } : i
            ),
          }
        })
      },

      updateComment: (productId, comment, variantId) => {
        set((state) => ({
          items: state.items.map((i) =>
            isSameItem(i, productId, variantId) ? { ...i, comment } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getItemQuantity: (productId, variantId) => {
        const item = get().items.find((i) => isSameItem(i, productId, variantId))
        return item?.quantity ?? 0
      },

      getTotalCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    {
      name: 'cheese-cafe-cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
