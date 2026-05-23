import { MapPin, ChevronDown, Bell, Search, User } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '@/stores/user.store'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

interface HeaderProps {
  showSearch?: boolean
  hasNotifications?: boolean
}

/**
 * Asosiy header — manzil + bildirishnoma + profil + qidiruv
 * Mobile-first dizayn, sticky top, blur fon
 */
export function Header({
  showSearch = true,
  hasNotifications = false,
}: HeaderProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get('q') || ''

  const selectedAddress = useUserStore((s) => s.getSelectedAddress())
  const addresses = useUserStore((s) => s.addresses)

  const addressLabel =
    selectedAddress?.fullAddress ??
    (addresses.length === 0 ? 'Manzil tanlang' : 'Manzil tanlanmagan')

  const handleAddressClick = () => {
    haptic.impact('light')
    navigate('/addresses')
  }

  const handleSearchChange = (value: string) => {
    if (value.trim()) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-brand-cream/80 backdrop-blur-md pt-safe">
      <div className="border-b border-brand-dark/[0.06] px-5 pt-3 pb-3">
        {/* 1-qator: manzil + aksiyalar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            onClick={handleAddressClick}
            className={cn(
              'flex max-w-[220px] items-center gap-1.5',
              'rounded-full bg-brand-cream-muted px-3 py-1.5',
              'active:scale-95 transition-transform'
            )}
          >
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-red" />
            <span className="truncate text-tg-caption font-semibold">
              {addressLabel}
            </span>
            <ChevronDown className="h-3 w-3 flex-shrink-0 text-brand-dark/40" />
          </button>

          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => navigate('/orders')}
              icon={<Bell className="h-4 w-4" />}
              hasNotification={hasNotifications}
              aria-label="Buyurtmalar"
            />
            <IconButton
              onClick={() => navigate('/profile')}
              icon={<User className="h-4 w-4" />}
              aria-label="Profil"
            />
          </div>
        </div>

        {/* 2-qator: qidiruv */}
        {showSearch && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-brand-cream-muted px-3.5 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-brand-dark/40" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Taom yoki ichimlik qidiring..."
              className="flex-1 bg-transparent text-tg-body outline-none placeholder:text-brand-dark/40"
            />
          </div>
        )}
      </div>
    </header>
  )
}

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  hasNotification?: boolean
  'aria-label': string
}

function IconButton({ icon, onClick, hasNotification, ...props }: IconButtonProps) {
  return (
    <button
      onClick={() => {
        haptic.impact('light')
        onClick?.()
      }}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center',
        'rounded-xl bg-brand-cream-muted',
        'transition-transform active:scale-95',
        'text-brand-dark'
      )}
      {...props}
    >
      {icon}
      {hasNotification && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-brand-cream bg-brand-red" />
      )}
    </button>
  )
}
