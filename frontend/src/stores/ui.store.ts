import { create } from 'zustand'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface UIState {
  toasts: ToastItem[]
  showToast: (message: string, variant?: ToastVariant) => void
  hideToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],

  showToast: (message, variant = 'default') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))

    // 2.5 sekund keyin avtomatik o'chirish
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 2500)
  },

  hideToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
