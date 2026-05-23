import { Home, ClipboardList, ShoppingCart } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '@/stores/cart.store'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: 'Asosiy',
    icon: <Home className="h-5 w-5" />,
  },
  {
    path: '/orders',
    label: 'Buyurtmalar',
    icon: <ClipboardList className="h-5 w-5" />,
  },
]

/**
 * Pastki navigatsiya — Telegram standartiga mos
 * Markazda — savat (CTA tugma), yon tomonlarda — sahifalar
 */
export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useCartStore((s) => s.getTotalCount())

  const handleNavClick = (path: string) => {
    haptic.impact('light')
    navigate(path)
  }

  const handleCartClick = () => {
    haptic.impact('medium')
    navigate('/cart')
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-brand-cream/95 backdrop-blur-md',
        'border-t border-brand-dark/[0.06]',
        'px-5 pt-2 pb-safe',
        'flex items-center gap-2'
      )}
    >
      {/* Chap tomondagi nav item (asosiy) */}
      <NavButton
        item={NAV_ITEMS[0]}
        isActive={location.pathname === NAV_ITEMS[0].path}
        onClick={() => handleNavClick(NAV_ITEMS[0].path)}
      />

      {/* O'rtadagi savat tugmasi */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCartClick}
        className={cn(
          'flex flex-1 items-center justify-center gap-2',
          'h-12 rounded-2xl px-4',
          'bg-brand-red text-white',
          'font-bold shadow-card'
        )}
      >
        <ShoppingCart className="h-5 w-5" />
        <span
          className={cn(
            'flex items-center justify-center',
            'h-5 min-w-[20px] rounded-full px-1.5',
            'bg-brand-yellow text-brand-dark',
            'text-xxs font-extrabold'
          )}
        >
          {cartCount}
        </span>
      </motion.button>

      {/* O'ng tomondagi nav item (buyurtmalar) */}
      <NavButton
        item={NAV_ITEMS[1]}
        isActive={location.pathname === NAV_ITEMS[1].path}
        onClick={() => handleNavClick(NAV_ITEMS[1].path)}
      />
    </nav>
  )
}

interface NavButtonProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-0.5',
        'h-12 rounded-2xl',
        'transition-colors',
        isActive ? 'text-brand-red' : 'text-brand-dark/50'
      )}
    >
      <motion.div
        animate={{ scale: isActive ? 1.15 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {item.icon}
      </motion.div>
      <span className="text-xxs font-semibold">{item.label}</span>
    </button>
  )
}
