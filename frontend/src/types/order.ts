// Buyurtma turlari

export type OrderType = 'delivery' | 'pickup'
export type PaymentMethod = 'cash' | 'payme' | 'click' | 'telegram_pay' | 'card'
export type OrderStatus =
  | 'pending' // Qabul qilindi
  | 'confirmed' // Tasdiqlangan
  | 'preparing' // Tayyorlanmoqda
  | 'ready' // Tayyor
  | 'on_the_way' // Yo'lda
  | 'delivered' // Yetkazildi
  | 'completed' // Yakunlangan
  | 'cancelled' // Bekor qilingan

export interface DeliveryAddress {
  fullAddress: string
  latitude?: number
  longitude?: number
  apartment?: string
  entrance?: string
  floor?: string
  intercom?: string
  comment?: string
}

export interface OrderItem {
  productId: string
  productName: string
  productEmoji: string
  quantity: number
  unitPrice: number
  totalPrice: number
  variantName?: string
  addonNames?: string[]
  comment?: string
}

export interface Order {
  id: string
  orderNumber: string // Foydalanuvchi ko'rishi uchun (CC-123456)
  userId: string
  items: OrderItem[]
  type: OrderType
  address?: DeliveryAddress
  phone: string
  phoneSecondary?: string
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: OrderStatus
  createdAt: string
  estimatedDeliveryTime?: string
  courierId?: string
  courierName?: string
  courierPhone?: string
  isBonus?: boolean // 10-chi buyurtma — bonus
}
