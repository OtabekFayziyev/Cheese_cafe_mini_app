import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind klasslarni xavfsiz birlashtirish (shadcn/ui standart)
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Sleep helper (test va animatsiya uchun)
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Telefon raqamini formatlash: 901234567 → +998 90 123 45 67
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 9) return phone

  return `+998 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`
}

// Vaqtni "x daqiqa oldin" formatida ko'rsatish
export function timeAgo(date: Date | string | number): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'hozirgina'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} daqiqa oldin`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} soat oldin`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} kun oldin`

  return new Date(date).toLocaleDateString('uz-UZ')
}

// Random ID generator (clientside identifikator uchun)
export function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`
}
