import type { Product } from '@/types/menu'

// Mahsulotlar mock ma'lumotlari
// PROD: bu ma'lumotlar backend API dan keladi
export const PRODUCTS: Product[] = [
  // BURGERLAR
  {
    id: 'p-burger-cheese',
    categoryId: 'burger',
    name: 'Cheeseburger',
    description: "Ikki qatlam pishloq, yangi gosht kotlet va maxsus sous bilan",
    price: 35000,
    emoji: '🍔',
    badge: 'bestseller',
    isAvailable: true,
    preparationTime: 15,
    rating: 4.9,
    reviewCount: 142,
    addons: [
      { id: 'addon-cheese', name: 'Qo\'shimcha pishloq', emoji: '🧀', price: 5000 },
    ],
  },
  {
    id: 'p-burger-bbq',
    categoryId: 'burger',
    name: 'BBQ Burger',
    description: "Asl BBQ sous, qovurilgan piyoz va bekon bilan",
    price: 45000,
    emoji: '🍔',
    badge: 'hot',
    isAvailable: true,
    preparationTime: 18,
    rating: 4.8,
    reviewCount: 87,
    addons: [
      { id: 'addon-cheese', name: 'Qo\'shimcha pishloq', emoji: '🧀', price: 5000 },
    ],
  },
  {
    id: 'p-burger-classic',
    categoryId: 'burger',
    name: 'Klassik Burger',
    description: "Yangi gosht, salat, pomidor va sous",
    price: 30000,
    emoji: '🍔',
    isAvailable: true,
    preparationTime: 12,
    rating: 4.7,
    reviewCount: 234,
    addons: [
      { id: 'addon-cheese', name: 'Qo\'shimcha pishloq', emoji: '🧀', price: 5000 },
    ],
  },
  {
    id: 'p-burger-double',
    categoryId: 'burger',
    name: 'Double Cheese',
    description: "Ikki qavat go'sht va to'rt qavat pishloq",
    price: 52000,
    emoji: '🍔',
    badge: 'new',
    isAvailable: true,
    preparationTime: 20,
    addons: [
      { id: 'addon-cheese', name: 'Qo\'shimcha pishloq', emoji: '🧀', price: 5000 },
    ],
  },

  // HOT DOG
  {
    id: 'p-hotdog-classic',
    categoryId: 'hot-dog',
    name: 'Klassik Hot Dog',
    description: "Issiq sosiska va yangi non bilan",
    price: 15000,
    emoji: '🌭',
    isAvailable: true,
    preparationTime: 8,
    rating: 4.6,
    addons: [
      { id: 'addon-sausage', name: 'Qo\'shimcha sosiska', emoji: '🌭', price: 4000 },
    ],
  },
  {
    id: 'p-hotdog-egersky',
    categoryId: 'hot-dog',
    name: 'Egersky Hot Dog',
    description: "Nemis uslubidagi mazali hot dog",
    price: 19000,
    emoji: '🌭',
    badge: 'top',
    isAvailable: true,
    preparationTime: 10,
    rating: 4.8,
    addons: [
      { id: 'addon-sausage', name: 'Qo\'shimcha sosiska', emoji: '🌭', price: 4000 },
    ],
  },

  // LAVASH
  {
    id: 'p-lavash-classic',
    categoryId: 'lavash',
    name: 'Lavash',
    description: "Tovuq, sabzavotlar va sous bilan",
    price: 28000,
    emoji: '🌯',
    isAvailable: true,
    preparationTime: 12,
  },
  {
    id: 'p-lavash-cheese',
    categoryId: 'lavash',
    name: 'Cheese Lavash',
    description: "Pishloq qo'shilgan mazali lavash",
    price: 32000,
    emoji: '🌯',
    badge: 'new',
    isAvailable: true,
    preparationTime: 14,
  },

  // PITSA
  {
    id: 'p-pizza-margarita',
    categoryId: 'pizza',
    name: 'Margarita',
    description: "Mozzarella, pomidor va rayhon bilan",
    price: 65000,
    emoji: '🍕',
    isAvailable: true,
    preparationTime: 25,
    rating: 4.9,
  },
  {
    id: 'p-pizza-pepperoni',
    categoryId: 'pizza',
    name: 'Pepperoni',
    description: "Pikant pepperoni va ikki turdagi pishloq",
    price: 78000,
    emoji: '🍕',
    badge: 'hot',
    isAvailable: true,
    preparationTime: 25,
    rating: 4.9,
    reviewCount: 156,
  },

  // KFC / TOVUQ
  {
    id: 'p-kfc-wings',
    categoryId: 'kfc',
    name: 'Qovurilgan Qanot 10x',
    description: "10 ta crispy qovurilgan tovuq qanoti",
    price: 75000,
    emoji: '🍗',
    badge: 'bestseller',
    isAvailable: true,
    preparationTime: 18,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: 'p-kfc-nuggets',
    categoryId: 'kfc',
    name: 'Nuggets 6x',
    description: "6 ta crispy tovuq bo'laklari",
    price: 25000,
    emoji: '🍗',
    isAvailable: true,
    preparationTime: 10,
  },

  // QO'SHIMCHALAR
  {
    id: 'p-extra-fries',
    categoryId: 'extra',
    name: 'Free Fri',
    description: "Tuzlangan, qovurilgan kartoshka",
    price: 18000,
    emoji: '🍟',
    isAvailable: true,
    preparationTime: 6,
  },
  {
    id: 'p-extra-steak',
    categoryId: 'extra',
    name: 'Steak Free',
    description: "Yangi go'sht steak",
    price: 25000,
    emoji: '🥩',
    isAvailable: true,
    preparationTime: 20,
  },

  // ICHIMLIKLAR
  {
    id: 'p-drink-cola',
    categoryId: 'drink',
    name: 'Coca-Cola',
    description: "Sovuq muzli Coca-Cola",
    price: 8000, // 0.5l narxi
    emoji: '🥤',
    isAvailable: true,
    variants: [
      { id: 'size-05', name: '0.5 L', priceModifier: 0 },
      { id: 'size-1', name: '1 L', priceModifier: 5000 },
      { id: 'size-15', name: '1.5 L', priceModifier: 7000 },
      { id: 'size-2', name: '2 L', priceModifier: 10000 },
    ],
  },
  {
    id: 'p-drink-fanta',
    categoryId: 'drink',
    name: 'Fanta',
    description: "Sovuq Fanta apelsin ta'mi",
    price: 8000, // 0.5l narxi
    emoji: '🥤',
    isAvailable: true,
    variants: [
      { id: 'size-05', name: '0.5 L', priceModifier: 0 },
      { id: 'size-1', name: '1 L', priceModifier: 5000 },
      { id: 'size-15', name: '1.5 L', priceModifier: 7000 },
      { id: 'size-2', name: '2 L', priceModifier: 10000 },
    ],
  },
  {
    id: 'p-drink-water',
    categoryId: 'drink',
    name: 'Suv',
    description: "Mineral suv",
    price: 3000, // 0.5l narxi
    emoji: '💧',
    isAvailable: true,
    variants: [
      { id: 'size-05', name: '0.5 L', priceModifier: 0 },
      { id: 'size-1', name: '1 L', priceModifier: 2000 },
      { id: 'size-15', name: '1.5 L', priceModifier: 3000 },
      { id: 'size-2', name: '2 L', priceModifier: 4000 },
    ],
  },

  // DESERTLAR
  {
    id: 'p-dessert-cake',
    categoryId: 'dessert',
    name: 'Cheesecake',
    description: "Yumshoq pishloqli desert",
    price: 28000,
    emoji: '🍰',
    badge: 'new',
    isAvailable: true,
  },
  {
    id: 'p-dessert-icecream',
    categoryId: 'dessert',
    name: 'Muzqaymoq',
    description: "Vanil yoki shokolad ta'mli",
    price: 12000,
    emoji: '🍦',
    isAvailable: true,
  },
]

// Helper funksiyalar — mock data bilan ishlash uchun
export function getPopularProducts(limit = 6): Product[] {
  return [...PRODUCTS]
    .filter((p) => p.badge === 'bestseller' || p.badge === 'top' || p.badge === 'hot')
    .slice(0, limit)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId && p.isAvailable)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim()
  if (!q) return PRODUCTS
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  )
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
