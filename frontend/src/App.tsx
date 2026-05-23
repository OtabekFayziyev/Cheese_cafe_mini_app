import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AddressesPage } from '@/pages/AddressesPage'
import { OrderSuccessPage } from '@/pages/OrderSuccessPage'

import { initTelegramWebApp } from '@/lib/telegram'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  useEffect(() => {
    initTelegramWebApp()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

function AppContent() {
  const { isLoading, error } = useTelegramAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="mb-4 text-6xl">🧀</div>
          <div className="text-tg-body font-semibold">Yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-6">
        <div className="text-center">
          <div className="mb-4 text-6xl">❌</div>
          <div className="mb-2 text-tg-headline font-bold">Xatolik</div>
          <div className="text-tg-caption text-brand-dark/60">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
