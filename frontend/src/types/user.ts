// Foydalanuvchi turlari
import type { DeliveryAddress } from './order'

export type UserRole = 'customer' | 'courier' | 'admin' | 'manager'

export interface User {
  id: string
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  phone?: string
  phoneSecondary?: string
  photoUrl?: string
  role: UserRole
  language: 'uz' | 'ru' | 'en'

  // Loyalty
  totalOrders: number
  totalSpent: number
  bonusPoints: number

  // Saqlangan ma'lumotlar
  savedAddresses: DeliveryAddress[]
  favoriteProductIds: string[]

  createdAt: string
  lastActiveAt: string
}
