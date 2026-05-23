import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Home as HomeIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart.store'
import { haptic } from '@/lib/telegram'

/**
 * Buyurtma muvaffaqiyatli qabul qilindi sahifasi
 * CartPage dan navigate qilinadi
 */
export function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const clearCart = useCartStore((s) => s.clearCart)

  // State dan buyurtma ma'lumotlarini olish
  const orderData = location.state as {
    orderNumber: string
    total: number
    estimatedTime: string
  } | null

  useEffect(() => {
    // Savatni tozalash
    clearCart()
    
    // Haptic success
    haptic.notification('success')
  }, [clearCart])

  // Agar state bo'lmasa — bosh sahifaga qaytarish
  if (!orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8 text-center">
        <div>
          <div className="mb-4 text-6xl">❓</div>
          <h2 className="mb-4 text-tg-headline font-extrabold">Xatolik</h2>
          <Button onClick={() => navigate('/')}>Bosh sahifaga</Button>
        </div>
      </div>
    )
  }

  const handleGoHome = () => {
    haptic.impact('light')
    navigate('/', { replace: true })
  }

  const handleViewOrders = () => {
    haptic.impact('light')
    navigate('/orders', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 text-center">
      {/* Success animatsiya */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/20">
          <CheckCircle2 className="h-16 w-16 text-success" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Sarlavha */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="mb-3 font-display text-3xl font-black text-brand-dark">
          Buyurtma qabul qilindi!
        </h1>
        <p className="mb-6 max-w-sm text-tg-body leading-relaxed text-brand-dark/70">
          Buyurtmangiz muvaffaqiyatli ro'yxatga olindi. Operator tez orada siz bilan bog'lanadi.
        </p>
      </motion.div>

      {/* Buyurtma ma'lumotlari */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 w-full max-w-sm"
      >
        <div className="rounded-brand-lg bg-brand-cream-muted p-5">
          <div className="mb-4 flex items-center justify-between border-b border-brand-dark/10 pb-4">
            <span className="text-tg-caption font-bold text-brand-dark/60">
              Buyurtma raqami
            </span>
            <span className="font-display text-lg font-black text-brand-dark">
              #{orderData.orderNumber}
            </span>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-tg-caption text-brand-dark/60">Jami summa:</span>
            <span className="font-display text-2xl font-black text-brand-red">
              {formatPrice(orderData.total)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-tg-caption text-brand-dark/60">Taxminiy vaqt:</span>
            <span className="text-tg-body font-bold text-brand-dark">
              {orderData.estimatedTime}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Keyingi qadamlar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 w-full max-w-sm space-y-3 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold">
            1
          </div>
          <div className="flex-1">
            <div className="text-tg-caption font-bold">Operator qo'ng'irog'i</div>
            <div className="text-xxs text-brand-dark/60">
              5 daqiqa ichida siz bilan bog'lanamiz
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-cream-muted text-sm font-extrabold text-brand-dark/40">
            2
          </div>
          <div className="flex-1">
            <div className="text-tg-caption font-bold text-brand-dark/60">
              Tayyorlanmoqda
            </div>
            <div className="text-xxs text-brand-dark/40">
              Oshxonada buyurtmangiz tayyorlanadi
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-cream-muted text-sm font-extrabold text-brand-dark/40">
            3
          </div>
          <div className="flex-1">
            <div className="text-tg-caption font-bold text-brand-dark/60">Yo'lda</div>
            <div className="text-xxs text-brand-dark/40">
              Kuryer sizga yetkazib beradi
            </div>
          </div>
        </div>
      </motion.div>

      {/* Aksiyalar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm space-y-3"
      >
        <Button onClick={handleViewOrders} variant="primary" fullWidth>
          📋 Buyurtmalarimni ko'rish
        </Button>
        <Button onClick={handleGoHome} variant="outline" fullWidth>
          <HomeIcon className="h-5 w-5" />
          Bosh sahifaga qaytish
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-xxs text-brand-dark/40"
      >
        Savol bo'lsa, operator bilan bog'laning
      </motion.div>
    </div>
  )
}
