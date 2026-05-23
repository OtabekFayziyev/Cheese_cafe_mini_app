import { useEffect, useState } from 'react'
import { authAPI } from '@/lib/api'
import { useUserStore } from '@/stores/user.store'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
            language_code?: string
          }
        }
        ready: () => void
        expand: () => void
        MainButton: any
        BackButton: any
      }
    }
  }
}

export function useTelegramAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tg = window.Telegram?.WebApp
        
        if (!tg) {
          // Development mode - skip auth
          setIsLoading(false)
          return
        }

        tg.ready()
        tg.expand()

        const initData = tg.initData
        const tgUser = tg.initDataUnsafe.user

        if (!initData || !tgUser) {
          setError('Telegram data not found')
          setIsLoading(false)
          return
        }

        // Login
        const { data } = await authAPI.login(initData)
        localStorage.setItem('auth_token', data.token)

        // Set user data
        setUser({
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          username: data.user.username,
          phone: data.user.phone || '',
          photoUrl: data.user.photoUrl,
          language: data.user.language || 'uz',
          totalOrders: data.user.totalOrders || 0,
          bonusPoints: data.user.bonusPoints || 0,
        })

        setIsLoading(false)
      } catch (err: any) {
        console.error('Auth error:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [setUser])

  return { isLoading, error }
}
