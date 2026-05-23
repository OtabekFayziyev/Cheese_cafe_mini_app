import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Kafe holati banner — header ustida
 * Ish vaqti: 09:00 - 05:00 (20/7)
 * Keyinroq backend dan real holat keladi
 */
export function CafeStatusBar() {
  const { isOpen, message } = getCafeStatus()

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 px-5 py-2.5 text-tg-caption font-semibold',
        isOpen
          ? 'bg-success/10 text-success'
          : 'bg-brand-dark/5 text-brand-dark/60'
      )}
    >
      <Clock className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  )
}

/**
 * Kafe holatini aniqlash
 * 09:00 dan 05:00 gacha — ochiq
 */
function getCafeStatus(): { isOpen: boolean; message: string } {
  const now = new Date()
  const hour = now.getHours()

  // 09:00 - 05:00 (keyingi kun)
  // Ya'ni: 0-5 yoki 9-23
  const isOpen = hour >= 9 || hour < 5

  const message = isOpen
    ? '🟢 Ochiq — 09:00 dan 05:00 gacha'
    : '🔴 Yopiq — 09:00 da ochamiz'

  return { isOpen, message }
}
