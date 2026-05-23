import type {
  TelegramWebApp,
  HapticImpactStyle,
  HapticNotificationType,
} from '@/types/telegram'

/**
 * Telegram WebApp ga xavfsiz kirish.
 * SSR yoki test rejimida xato bermaydi.
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

/**
 * Telegram ichida ochilganini tekshirish
 */
export function isTelegramWebApp(): boolean {
  const tg = getTelegramWebApp()
  return Boolean(tg?.initData && tg.initData.length > 0)
}

/**
 * Foydalanuvchi ma'lumotlarini olish (Telegram dan)
 */
export function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null
}

/**
 * Mini App ni ishga tushirish — sahifa yuklanganda chaqiriladi
 */
export function initTelegramWebApp(): void {
  const tg = getTelegramWebApp()
  if (!tg) return

  tg.ready()
  tg.expand()

  // Header rangini brending bilan moslash
  try {
    tg.setHeaderColor('#FFD000')
    tg.setBackgroundColor('#FFFDF5')
  } catch {
    // Eski versiyalarda mavjud bo'lmasligi mumkin
  }
}

/**
 * Haptic feedback — taktik javob (vibratsiya)
 */
export const haptic = {
  impact(style: HapticImpactStyle = 'light'): void {
    getTelegramWebApp()?.HapticFeedback?.impactOccurred(style)
  },
  notification(type: HapticNotificationType): void {
    getTelegramWebApp()?.HapticFeedback?.notificationOccurred(type)
  },
  selection(): void {
    getTelegramWebApp()?.HapticFeedback?.selectionChanged()
  },
}

/**
 * Telegram orqali ogohlantirish ko'rsatish (alert o'rniga)
 */
export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const tg = getTelegramWebApp()
    if (tg) {
      tg.showAlert(message, () => resolve())
    } else {
      alert(message)
      resolve()
    }
  })
}

/**
 * Telegram orqali tasdiqlash dialogi
 */
export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const tg = getTelegramWebApp()
    if (tg) {
      tg.showConfirm(message, (confirmed) => resolve(confirmed))
    } else {
      resolve(window.confirm(message))
    }
  })
}

/**
 * Tashqi havolani ochish
 */
export function openLink(url: string): void {
  const tg = getTelegramWebApp()
  if (tg) {
    tg.openLink(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/**
 * Botga ma'lumot yuborish va Mini App ni yopish
 */
export function sendDataAndClose(data: Record<string, unknown>): void {
  const tg = getTelegramWebApp()
  if (!tg) return

  tg.sendData(JSON.stringify(data))
  tg.close()
}
