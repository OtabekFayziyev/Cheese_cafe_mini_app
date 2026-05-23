import { useState, useEffect } from 'react'
import { Clock, CheckCircle2, ChefHat, Bike, Home, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { useMyOrders } from '@/hooks/useOrders'
import { useOrderTracking } from '@/hooks/useOrderTracking'
import { formatPrice, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types/order'

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    icon: React.ReactNode
    color: string
    bgColor: string
  }
> = {
  pending: {
    label: 'Qabul qilindi',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-brand-yellow',
    bgColor: 'bg-brand-yellow/10',
  },
  confirmed: {
    label: 'Tasdiqlangan',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  preparing: {
    label: 'Tayyorlanmoqda',
    icon: <ChefHat className="h-5 w-5" />,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  ready: {
    label: 'Tayyor',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  on_the_way: {
    label: "Yo'lda",
    icon: <Bike className="h-5 w-5" />,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  delivered: {
    label: 'Yetkazildi',
    icon: <Home className="h-5 w-5" />,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  completed: {
    label: 'Yakunlangan',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-brand-dark/60',
    bgColor: 'bg-brand-dark/5',
  },
  cancelled: {
    label: 'Bekor qilingan',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
  },
}

/**
 * Buyurtmalar sahifasi
 * Hozirgi + oldingi buyurtmalar
 */
export function OrdersPage() {
  const { data: orders = [], isLoading } = useMyOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const selectedOrder = orders.find(o => o.id === selectedOrderId)

  // Aktiv buyurtmalar
  const activeOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way'].includes(o.status)
  )

  // Yakunlangan buyurtmalar
  const completedOrders = orders.filter((o) =>
    ['delivered', 'completed', 'cancelled'].includes(o.status)
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🧀</div>
          <div className="text-tg-body font-semibold">Yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 text-7xl">📋</div>
        <h2 className="mb-3 font-display text-2xl font-black">Buyurtmalar yo'q</h2>
        <p className="mb-6 max-w-xs text-tg-body leading-relaxed text-brand-dark/60">
          Hali buyurtma bermagansiz. Mazali taomlarni buyurtma qiling!
        </p>
        <Button onClick={() => {}} variant="secondary">
          🍔 Menuga o'tish
        </Button>
      </div>
    )
  }

  if (selectedOrder) {
    return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrderId(null)} />
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-brand-cream/95 px-5 py-4 backdrop-blur-md">
        <h1 className="text-tg-headline font-extrabold">📋 Buyurtmalarim</h1>
      </div>

      {/* Aktiv buyurtmalar */}
      {activeOrders.length > 0 && (
        <div className="mt-4 px-5">
          <h2 className="mb-3 text-tg-title font-extrabold">Hozirgi buyurtmalar</h2>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrderId(order.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Yakunlangan buyurtmalar */}
      {completedOrders.length > 0 && (
        <div className="mt-6 px-5">
          <h2 className="mb-3 text-tg-title font-extrabold">Tarix</h2>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrderId(order.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onClick: () => void
}

function OrderCard({ order, onClick }: OrderCardProps) {
  const config = STATUS_CONFIG[order.status]

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full rounded-brand bg-white p-4 text-left shadow-card"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-tg-caption font-extrabold">#{order.orderNumber}</span>
        <div className={cn('flex items-center gap-1.5 rounded-lg px-2 py-1', config.bgColor)}>
          {config.icon}
          <span className={cn('text-xxs font-bold', config.color)}>{config.label}</span>
        </div>
      </div>

      <div className="mb-2 text-tg-caption text-brand-dark/60">
        {formatDate(order.createdAt)}
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {order.items.slice(0, 3).map((item, idx) => (
          <span key={idx} className="text-lg">
            {item.productEmoji}
          </span>
        ))}
        {order.items.length > 3 && (
          <span className="text-tg-caption font-bold text-brand-dark/40">
            +{order.items.length - 3}
          </span>
        )}
      </div>

      <div className="text-tg-title font-extrabold text-brand-red">
        {formatPrice(order.total)}
      </div>
    </motion.button>
  )
}

interface OrderDetailViewProps {
  order: Order
  onBack: () => void
}

function OrderDetailView({ order, onBack }: OrderDetailViewProps) {
  const config = STATUS_CONFIG[order.status]
  const { isConnected, lastUpdate, courierLocation } = useOrderTracking(order.id)

  // Real-time status update
  useEffect(() => {
    if (lastUpdate && lastUpdate.orderId === order.id) {
      // Status yangilandi - orderlar listini refresh qilish kerak
      // Bu useMyOrders hook orqali avtomatik bo'ladi
      console.log('Status yangilandi:', lastUpdate.status)
    }
  }, [lastUpdate, order.id])

  // Status progression (qabul → tayyorlanmoqda → yo'lda → yetkazildi)
  const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'pending', label: 'Qabul qilindi', icon: '✅' },
    { status: 'preparing', label: 'Tayyorlanmoqda', icon: '👨‍🍳' },
    { status: 'on_the_way', label: "Yo'lda", icon: '🛵' },
    { status: 'delivered', label: 'Yetkazildi', icon: '🏠' },
  ]

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered']
  const currentStepIndex = statusOrder.indexOf(order.status)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-brand-cream/95 px-5 py-4 backdrop-blur-md">
        <button onClick={onBack} className="mb-2 text-tg-caption font-bold text-brand-red">
          ← Orqaga
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-tg-headline font-extrabold">#{order.orderNumber}</h1>
          {isConnected && (
            <div className="flex items-center gap-1.5 text-xxs text-success">
              <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Real-time
            </div>
          )}
        </div>
      </div>

      {/* Status tracking */}
      <div className="mt-4 px-5">
        <h2 className="mb-4 text-tg-title font-extrabold">Buyurtma holati</h2>
        <div className="relative flex justify-between">
          {statusSteps.map((step, idx) => {
            const isDone = statusOrder.indexOf(step.status) <= currentStepIndex
            const isActive = step.status === order.status

            return (
              <div key={step.status} className="relative flex flex-1 flex-col items-center">
                {/* Line */}
                {idx < statusSteps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-[55%] top-[17px] h-0.5 w-full',
                      isDone ? 'bg-brand-yellow' : 'bg-brand-dark/10'
                    )}
                  />
                )}

                {/* Dot */}
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isActive ? Infinity : 0,
                  }}
                  className={cn(
                    'relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm',
                    isDone
                      ? 'border-brand-yellow bg-brand-yellow'
                      : 'border-brand-dark/20 bg-brand-cream-muted'
                  )}
                >
                  {step.icon}
                </motion.div>

                {/* Label */}
                <div
                  className={cn(
                    'mt-2 text-center text-xxs font-semibold leading-tight',
                    isDone ? 'text-brand-dark' : 'text-brand-dark/40'
                  )}
                  style={{ maxWidth: '70px' }}
                >
                  {step.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Kuryer info */}
      {order.courierName && (
        <div className="mt-6 mx-5 rounded-brand bg-gradient-to-br from-brand-dark to-brand-dark-light p-4 text-white">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5" />
              <span className="font-bold">Kuryer</span>
            </div>
            {courierLocation && (
              <div className="flex items-center gap-1 text-xxs text-brand-yellow">
                <div className="h-2 w-2 animate-pulse rounded-full bg-brand-yellow" />
                Jonli
              </div>
            )}
          </div>
          <div className="mb-1 text-tg-title font-extrabold">{order.courierName}</div>
          {order.courierPhone && (
            <a
              href={`tel:+${order.courierPhone}`}
              className="mt-2 flex items-center gap-2 text-tg-caption text-brand-yellow"
            >
              <Phone className="h-4 w-4" />
              +{order.courierPhone}
            </a>
          )}
          {courierLocation && (
            <div className="mt-3 text-xxs text-white/70">
              📍 Kuryer harakatda (real-time tracking)
            </div>
          )}
        </div>
      )}

      {/* Mahsulotlar */}
      <div className="mt-6 px-5">
        <h2 className="mb-3 text-tg-title font-extrabold">Mahsulotlar</h2>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-brand bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.productEmoji}</span>
                <div>
                  <div className="font-bold">{item.productName}</div>
                  {item.variantName && (
                    <div className="text-xxs text-brand-dark/60">{item.variantName}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xxs text-brand-dark/60">x{item.quantity}</div>
                <div className="font-bold text-brand-red">{formatPrice(item.totalPrice)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jami */}
      <div className="mt-4 border-t-2 border-dashed border-brand-dark/10 px-5 pt-4">
        <div className="space-y-2 text-tg-body">
          <div className="flex justify-between">
            <span className="text-brand-dark/60">Taomlar:</span>
            <span className="font-bold">{formatPrice(order.subtotal)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between">
              <span className="text-brand-dark/60">Yetkazish:</span>
              <span className="font-bold">{formatPrice(order.deliveryFee)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-brand-dark/10 pt-2">
            <span className="text-brand-dark/60">Jami:</span>
            <span className="font-display text-2xl font-black">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
