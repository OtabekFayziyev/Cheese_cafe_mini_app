// Menyu mahsuloti turlari

export type CategoryId =
  | 'hot-dog'
  | 'burger'
  | 'lavash'
  | 'extra'
  | 'kfc'
  | 'pizza'
  | 'drink'
  | 'dessert'

export type ProductBadge = 'hot' | 'new' | 'top' | 'discount' | 'bestseller'

export interface Category {
  id: CategoryId
  name: string
  emoji: string
  imageUrl?: string
  order: number
  isActive: boolean
}

export interface ProductVariant {
  id: string
  name: string // Masalan: "Katta", "O'rta", "Kichik"
  priceModifier: number // Bazaga qo'shiladi (yoki ayriladi)
}

export interface ProductAddon {
  id: string
  name: string
  emoji?: string
  price: number
}

export interface Product {
  id: string
  categoryId: CategoryId
  name: string
  description: string
  price: number
  oldPrice?: number // Chegirma uchun
  emoji: string
  imageUrl?: string
  badge?: ProductBadge
  variants?: ProductVariant[]
  addons?: ProductAddon[]
  isAvailable: boolean
  preparationTime?: number // Daqiqalarda
  rating?: number
  reviewCount?: number
}

export interface CartItem {
  productId: string
  productName: string
  productEmoji: string
  unitPrice: number
  quantity: number
  variantId?: string
  variantName?: string
  addonIds?: string[]
  addonNames?: string[]
  comment?: string
}
