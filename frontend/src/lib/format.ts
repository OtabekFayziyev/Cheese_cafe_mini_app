// Format helperlari — narxlarni va sanalarni o'zbek standartiga moslash

/**
 * Narxni so'm formatida ko'rsatish
 * @example formatPrice(12000) → "12 000 so'm"
 */
export function formatPrice(amount: number, currency = "so'm"): string {
  return `${amount.toLocaleString('uz-UZ')} ${currency}`
}

/**
 * Faqat raqamni formatlash (valyuta belgisisiz)
 * @example formatNumber(12000) → "12 000"
 */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('uz-UZ')
}

/**
 * Sanani Tashkent vaqt zonasida ko'rsatish
 * @example formatDate(new Date()) → "22.05.2026, 14:30"
 */
export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Faqat soat va daqiqa
 * @example formatTime(new Date()) → "14:30"
 */
export function formatTime(date: Date | string | number): string {
  return new Date(date).toLocaleTimeString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Masofani km/m formatida
 * @example formatDistance(1500) → "1.5 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Yetkazib berish vaqti diapazoni
 * @example formatDeliveryTime(30, 45) → "30-45 daq"
 */
export function formatDeliveryTime(min: number, max: number): string {
  return `${min}-${max} daq`
}
