import { useEffect, useState } from 'react'
import {
  getTelegramWebApp,
  isTelegramWebApp,
  getTelegramUser,
} from '@/lib/telegram'
import type { TelegramWebApp, TelegramWebAppUser } from '@/types/telegram'

interface UseTelegramReturn {
  webApp: TelegramWebApp | null
  user: TelegramWebAppUser | null
  isReady: boolean
  isTelegram: boolean
  colorScheme: 'light' | 'dark'
}

/**
 * Telegram WebApp ga kirish hooki.
 * Komponentlar uchun React-friendly interface.
 */
export function useTelegram(): UseTelegramReturn {
  const [isReady, setIsReady] = useState(false)
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const tg = getTelegramWebApp()
    if (!tg) {
      setIsReady(true) // Browser rejimida ham UI ko'rinsin
      return
    }

    setColorScheme(tg.colorScheme)
    setIsReady(true)

    // Tema o'zgarganda kuzatish
    const handleThemeChange = () => setColorScheme(tg.colorScheme)
    tg.onEvent('themeChanged', handleThemeChange)

    return () => {
      tg.offEvent('themeChanged', handleThemeChange)
    }
  }, [])

  return {
    webApp: getTelegramWebApp(),
    user: getTelegramUser(),
    isReady,
    isTelegram: isTelegramWebApp(),
    colorScheme,
  }
}
