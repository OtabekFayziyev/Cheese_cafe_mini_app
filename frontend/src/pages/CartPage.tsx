import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, MapPin, Bike, Store } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBackButton } from '@/hooks/useBackButton'
import { useMainButton } from '@/hooks/useMainButton'
import { useCartStore } from '@/stores/cart.store'
import { useUserStore } from '@/stores/user.store'
import { useUIStore } from '@/stores/ui.store'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/lib/format'
import { haptic } from '@/lib/telegram'
import { cn } from '@/lib/utils'
import type { OrderType, PaymentMethod } from '@/types/order'

const DELIVERY_FEE = 5000
const FREE_DELIVERY_THRESHOLD = Infinity // Hech qachon bepul emas

/**
 * Savat sahifasi — buyurtma berish oqimi
 * Yetkazish/olib ketish, manzil, telefon, to'lov usuli
 */
export function CartPage() {
  const navigate = useNavigate()
  
  const cartItems = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)

  const userPhone = useUserStore((s) => s.phone)
  const setPhone = useUserStore((s) => s.setPhone)
  const selectedAddress = useUserStore((s) => s.getSelectedAddress())

  const showToast = useUIStore((s) => s.showToast)
  const createOrder = useCreateOrder()

  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [phone, setPhoneLocal] = useState(userPhone)
  const [phone2, setPhone2] = useState('')
  const [addressText, setAddressText] = useState(selectedAddress?.fullAddress ?? '')
  const [addressComment, setAddressComment] = useState('')

  useBackButton(() => navigate(-1))

  // Bo'sh savat
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-cream-muted">
          <ShoppingCart className="h-12 w-12 text-brand-dark/30" />
        </div>
        <h2 className="mb-3 font-display text-2xl font-black">Savat bo'sh</h2>
        <p className="mb-6 max-w-xs text-tg-body leading-relaxed text-brand-dark/60">
          Mazali taomlarni tanlang va buyurtma bering!
        </p>
        <Button onClick={() => navigate('/')} variant="secondary">
          🍔 Menuga o'tish
        </Button>
      </div>
    )
  }

  // Hisob-kitoblar
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
  }, [cartItems])

  const deliveryFee = orderType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee
  const isFreeDelivery = orderType === 'delivery' && deliveryFee === 0

  // Validatsiya
  const canProceed = (() => {
    if (phone.length < 9) return false
    if (orderType === 'delivery' && !addressText.trim()) return false
    return true
  })()

  // Buyurtma berish
  const handleCheckout = async () => {
    if (!canProceed) {
      showToast('Iltimos, barcha maydonlarni to\'ldiring', 'error')
      return
    }

    if (paymentMethod !== 'cash') {
      showToast('Hozirda faqat naqd pul bilan to\'lov qilish mumkin', 'warning')
      return
    }

    try {
      const orderData = {
        type: orderType.toUpperCase(),
        phone: `+998${phone}`,
        phoneSecondary: phone2 ? `+998${phone2}` : undefined,
        addressId: selectedAddress?.id,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId,
          addonIds: item.addonIds,
          comment: item.comment,
        })),
        paymentMethod: paymentMethod.toUpperCase(),
      }

      const order = await createOrder.mutateAsync(orderData)
      
      haptic.notification('success')
      setPhone(phone)

      navigate('/order-success', {
        state: {
          orderNumber: order.orderNumber,
          total: order.total,
          estimatedTime: '30-45 daq',
        },
        replace: true,
      })
    } catch (error) {
      console.error('Order error:', error)
    }
  }

  useMainButton({
    text: `Buyurtma berish — ${formatPrice(total)}`,
    onClick: handleCheckout,
    visible: true,
    active: canProceed,
  })

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-brand-cream/95 px-5 py-4 backdrop-blur-md">
        <h1 className="text-tg-headline font-extrabold">
          🛒 Savat ({cartItems.length} ta)
        </h1>
      </div>

      {/* Loyalty banner */}
      <div className="mx-5 mt-4 rounded-brand-lg bg-gradient-to-br from-brand-dark to-brand-dark-light p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">⭐</div>
          <div className="flex-1">
            <div className="text-tg-caption font-extrabold text-brand-yellow">
              Har 10-buyurtma — bonus!
            </div>
            <div className="mt-0.5 text-xxs text-brand-cream/60">
              Sovg'a va bonus taom kutib turing
            </div>
          </div>
        </div>
      </div>

      {/* Cart items */}
      <div className="mt-4 space-y-2 px-5">
        {cartItems.map((item) => {
          const product = getProductById(item.productId)
          if (!product) return null

          const variant = product.variants?.find((v) => v.id === item.variantId)
          const addons = product.addons?.filter((a) => item.addonIds?.includes(a.id))

          const variantPrice = variant?.priceModifier ?? 0
          const addonsPrice = (addons ?? []).reduce((s, a) => s + a.price, 0)
          const itemTotal = (product.price + variantPrice + addonsPrice) * item.quantity

          return (
            <motion.div
              key={`${item.productId}-${item.variantId}`}
              layout
              className="rounded-brand bg-white p-3 shadow-card"
            >
              <div className="flex gap-3">
                {/* Emoji */}
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-cream-muted text-3xl">
                  {product.emoji}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-tg-body font-bold">{product.name}</h3>
                  {variant && (
                    <p className="mt-0.5 text-xxs text-brand-dark/60">
                      {variant.name}
                    </p>
                  )}
                  {addons && addons.length > 0 && (
                    <p className="mt-0.5 text-xxs text-brand-dark/60">
                      + {addons.map((a) => a.name).join(', ')}
                    </p>
                  )}
                  {item.comment && (
                    <p className="mt-0.5 italic text-xxs text-brand-dark/50">
                      📝 {item.comment}
                    </p>
                  )}
                  <div className="mt-2 text-tg-caption font-bold text-brand-red">
                    {formatPrice(itemTotal)}
                  </div>
                </div>

                {/* Quantity controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => {
                      haptic.impact('light')
                      removeItem(item.productId, item.variantId)
                      if (item.quantity === 1) {
                        showToast('O\'chirildi', 'default')
                      }
                    }}
                    className="text-brand-dark/40 transition-colors hover:text-brand-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        haptic.impact('light')
                        updateQuantity(item.productId, item.quantity - 1, item.variantId)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cream-muted"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                    <span className="min-w-[20px] text-center text-tg-caption font-extrabold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        haptic.impact('light')
                        updateQuantity(item.productId, item.quantity + 1, item.variantId)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-yellow"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Yetkazish turi */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-tg-caption font-extrabold uppercase tracking-wider text-brand-dark/60">
          Yetkazish turi
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <OrderTypeButton
            type="delivery"
            icon={<Bike className="h-6 w-6" />}
            label="Yetkazish"
            isActive={orderType === 'delivery'}
            onClick={() => setOrderType('delivery')}
          />
          <OrderTypeButton
            type="pickup"
            icon={<Store className="h-6 w-6" />}
            label="Olib ketish"
            isActive={orderType === 'pickup'}
            onClick={() => setOrderType('pickup')}
          />
        </div>
      </div>

      {/* Manzil (faqat delivery uchun) */}
      {orderType === 'delivery' && (
        <div className="mt-4 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-tg-caption font-extrabold uppercase tracking-wider text-brand-dark/60">
              Yetkazib berish manzili
            </h3>
            <button
              onClick={() => navigate('/addresses')}
              className="text-tg-caption font-bold text-brand-red"
            >
              <MapPin className="inline h-3.5 w-3.5" /> Xaritadan
            </button>
          </div>
          
          <Input
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            placeholder="Ko'cha, uy raqami..."
            error={orderType === 'delivery' && !addressText.trim() ? 'Manzil majburiy' : undefined}
          />

          <Input
            value={addressComment}
            onChange={(e) => setAddressComment(e.target.value)}
            placeholder="Qavat, xona, kirish (ixtiyoriy)"
            className="mt-2"
          />

          {/* Delivery info */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-brand-cream-muted p-3 text-center">
              <div className="text-tg-title font-extrabold">
                {isFreeDelivery ? '🎉 Bepul' : formatPrice(deliveryFee)}
              </div>
              <div className="mt-0.5 text-xxs text-brand-dark/60">Yetkazish</div>
            </div>
            <div className="rounded-xl bg-brand-cream-muted p-3 text-center">
              <div className="text-tg-title font-extrabold">30-45 daq</div>
              <div className="mt-0.5 text-xxs text-brand-dark/60">Taxminiy vaqt</div>
            </div>
          </div>
        </div>
      )}

      {/* Telefon */}
      <div className="mt-4 px-5">
        <h3 className="mb-3 text-tg-caption font-extrabold uppercase tracking-wider text-brand-dark/60">
          Telefon raqam
        </h3>
        <Input
          prefix="+998"
          value={phone}
          onChange={(e) => setPhoneLocal(e.target.value.replace(/\D/g, ''))}
          placeholder="901234567"
          label="Asosiy raqam"
          type="tel"
          inputMode="numeric"
          maxLength={9}
          error={phone.length > 0 && phone.length < 9 ? 'To\'liq raqam kiriting' : undefined}
        />
        <Input
          prefix="+998"
          value={phone2}
          onChange={(e) => setPhone2(e.target.value.replace(/\D/g, ''))}
          placeholder="2-raqam (ixtiyoriy)"
          label="Qo'shimcha raqam (ixtiyoriy)"
          type="tel"
          inputMode="numeric"
          maxLength={9}
          className="mt-2"
        />
      </div>

      {/* To'lov usuli */}
      <div className="mt-4 px-5">
        <h3 className="mb-3 text-tg-caption font-extrabold uppercase tracking-wider text-brand-dark/60">
          To'lov usuli
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <PaymentButton
            method="cash"
            label="Naqd"
            emoji="💵"
            isActive={paymentMethod === 'cash'}
            onClick={() => setPaymentMethod('cash')}
          />
          <PaymentButton
            method="payme"
            label="Payme"
            emoji="💳"
            isActive={paymentMethod === 'payme'}
            onClick={() => setPaymentMethod('payme')}
          />
          <PaymentButton
            method="click"
            label="Click"
            emoji="📲"
            isActive={paymentMethod === 'click'}
            onClick={() => setPaymentMethod('click')}
          />
        </div>
      </div>

      {/* Jami */}
      <div className="mt-6 border-t-2 border-dashed border-brand-dark/10 px-5 pt-4">
        <div className="space-y-2 text-tg-body">
          <div className="flex justify-between">
            <span className="text-brand-dark/60">Taomlar:</span>
            <span className="font-bold">{formatPrice(subtotal)}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex justify-between">
              <span className="text-brand-dark/60">Yetkazish:</span>
              <span className={cn('font-bold', isFreeDelivery && 'text-success')}>
                {isFreeDelivery ? '🎉 Bepul' : formatPrice(deliveryFee)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-brand-dark/10 pt-2">
            <span className="text-brand-dark/60">Jami:</span>
            <span className="font-display text-2xl font-black text-brand-dark">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface OrderTypeButtonProps {
  type: OrderType
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function OrderTypeButton({ icon, label, isActive, onClick }: OrderTypeButtonProps) {
  return (
    <button
      onClick={() => {
        haptic.selection()
        onClick()
      }}
      className={cn(
        'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all',
        isActive
          ? 'border-brand-yellow bg-brand-yellow/10'
          : 'border-brand-dark/10 bg-white'
      )}
    >
      {icon}
      <span className="text-tg-caption font-bold">{label}</span>
    </button>
  )
}

interface PaymentButtonProps {
  method: PaymentMethod
  label: string
  emoji: string
  isActive: boolean
  onClick: () => void
}

function PaymentButton({ method, label, emoji, isActive, onClick }: PaymentButtonProps) {
  const showToast = useUIStore((s) => s.showToast)
  
  return (
    <button
      onClick={() => {
        haptic.selection()
        if (method === 'payme' || method === 'click') {
          showToast('Hozirda faqat naqd pul bilan to\'lov qilish mumkin', 'warning')
          return
        }
        onClick()
      }}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all',
        isActive
          ? 'border-brand-red bg-brand-red/5'
          : 'border-brand-dark/10 bg-white'
      )}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xxs font-bold">{label}</span>
    </button>
  )
}
