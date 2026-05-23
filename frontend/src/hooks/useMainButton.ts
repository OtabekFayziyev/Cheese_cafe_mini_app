import { useEffect } from 'react'
import { getTelegramWebApp } from '@/lib/telegram'

interface UseMainButtonOptions {
  text: string
  onClick: () => void
  visible?: boolean
  active?: boolean
  loading?: boolean
  color?: string
  textColor?: string
}

/**
 * Telegram MainButton (pastdagi katta tugma) ni boshqarish.
 * Buyurtma berish, to'lash kabi asosiy aksiyalar uchun ishlatiladi.
 */
export function useMainButton({
  text,
  onClick,
  visible = true,
  active = true,
  loading = false,
  color = '#E8291C',
  textColor = '#FFFFFF',
}: UseMainButtonOptions): void {
  useEffect(() => {
    const tg = getTelegramWebApp()
    if (!tg) return

    const mb = tg.MainButton

    mb.setParams({
      text,
      color,
      text_color: textColor,
      is_active: active,
      is_visible: visible,
    })

    mb.onClick(onClick)

    if (loading) {
      mb.showProgress(false)
    } else {
      mb.hideProgress()
    }

    return () => {
      mb.offClick(onClick)
      mb.hide()
    }
  }, [text, onClick, visible, active, loading, color, textColor])
}
