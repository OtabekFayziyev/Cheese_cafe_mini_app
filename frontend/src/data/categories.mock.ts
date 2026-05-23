import type { Category } from '@/types/menu'

// Kategoriya mock ma'lumotlari
// PROD: bu ma'lumotlar backend API dan keladi
export const CATEGORIES: Category[] = [
  { id: 'burger', name: 'Burgerlar', emoji: '🍔', order: 1, isActive: true },
  { id: 'hot-dog', name: 'Hot Dog', emoji: '🌭', order: 2, isActive: true },
  { id: 'lavash', name: 'Lavash', emoji: '🌯', order: 3, isActive: true },
  { id: 'pizza', name: 'Pitsa', emoji: '🍕', order: 4, isActive: true },
  { id: 'kfc', name: 'Tovuq', emoji: '🍗', order: 5, isActive: true },
  { id: 'extra', name: 'Qo\'shimcha', emoji: '🍟', order: 6, isActive: true },
  { id: 'drink', name: 'Ichimliklar', emoji: '🥤', order: 7, isActive: true },
  { id: 'dessert', name: 'Desertlar', emoji: '🍰', order: 8, isActive: true },
]
