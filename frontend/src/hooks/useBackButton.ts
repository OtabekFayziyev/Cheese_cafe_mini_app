import { useEffect } from 'react'
import { getTelegramWebApp } from '@/lib/telegram'

/**
 * Telegram BackButton ni boshqarish hooki.
 * Sahifa o'zgarganda avtomatik ko'rinadi/yashirilada.
 *
 * @example
 * useBackButton(() => navigate(-1))
 */
export function useBackButton(onBack: () => void, visible = true): void {
  useEffect(() => {
    const tg = getTelegramWebApp()
    if (!tg) return

    if (visible) {
      tg.BackButton.show()
      tg.BackButton.onClick(onBack)
    } else {
      tg.BackButton.hide()
    }

    return () => {
      tg.BackButton.offClick(onBack)
      tg.BackButton.hide()
    }
  }, [onBack, visible])
}
