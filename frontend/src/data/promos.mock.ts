export interface Promo {
  id: string
  badge: string
  title: string
  description: string
  emoji: string
  gradient: string
  ctaText?: string
  ctaLink?: string
}

export const PROMOS: Promo[] = [
  {
    id: 'free-delivery',
    badge: '🛵 BEPUL YETKAZIB BERISH',
    title: "50,000 so'mdan yuqori",
    description: "Buyurtmalarda yetkazib berish bepul",
    emoji: '🚀',
    gradient: 'from-brand-red via-brand-red-dark to-[#8B0000]',
  },
  {
    id: 'new-cheese-burger',
    badge: '✨ YANGILIK',
    title: 'Yangi Cheese Burger',
    description: "Maxsus sous va ikki qatlam pishloq",
    emoji: '🍔',
    gradient: 'from-brand-yellow via-amber-500 to-brand-red',
  },
  {
    id: 'loyalty-bonus',
    badge: '⭐ BONUS',
    title: 'Har 10-buyurtma',
    description: "Sovg'a va bonus taom kutib turing",
    emoji: '🎁',
    gradient: 'from-brand-dark via-purple-900 to-brand-red',
  },
]
