import { useState } from 'react'
import { User, Phone, MapPin, Star, Gift, Settings, ChevronRight, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUserStore } from '@/stores/user.store'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

/**
 * Profil sahifasi
 * Foydalanuvchi ma'lumotlari, sozlamalar, bonus
 */
export function ProfilePage() {
  const navigate = useNavigate()
  const user = useUserStore()
  const showToast = useUIStore((s) => s.showToast)

  const [isEditing, setIsEditing] = useState(false)
  const [editPhone, setEditPhone] = useState(user.phone)

  const handleSave = () => {
    if (editPhone.length < 9) {
      showToast('To\'liq telefon raqam kiriting', 'error')
      return
    }
    user.setPhone(editPhone)
    setIsEditing(false)
    haptic.notification('success')
    showToast('Saqlandi!', 'success')
  }

  const stats = {
    totalOrders: user.totalOrders,
    totalSpent: 0, // Backend dan keladi
    bonusPoints: user.bonusPoints,
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark to-brand-dark-light px-5 py-8 text-white pt-safe">
        <div className="mb-6 flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-3xl">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              '👤'
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-xl font-extrabold">
              {user.firstName || 'Mehmon'} {user.lastName}
            </h1>
            {user.username && (
              <p className="text-tg-caption text-white/70">@{user.username}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon="📦" value={stats.totalOrders} label="Buyurtma" />
          <StatCard
            icon="💰"
            value={`${(stats.totalSpent / 1000).toFixed(0)}k`}
            label="Sarflangan"
          />
          <StatCard icon="⭐" value={stats.bonusPoints} label="Bonus" />
        </div>
      </div>

      {/* Telefon */}
      <div className="mt-4 px-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-tg-caption font-extrabold uppercase tracking-wider text-brand-dark/60">
            Telefon raqam
          </h2>
          {!isEditing && (
            <button
              onClick={() => {
                haptic.selection()
                setIsEditing(true)
              }}
              className="text-tg-caption font-bold text-brand-red"
            >
              Tahrirlash
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Input
              prefix="+998"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="901234567"
              type="tel"
              inputMode="numeric"
              maxLength={9}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} fullWidth>
                Bekor qilish
              </Button>
              <Button onClick={handleSave} fullWidth>
                Saqlash
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-brand bg-brand-cream-muted px-4 py-3">
            <Phone className="h-4 w-4 text-brand-dark/40" />
            <span className="font-semibold">
              {user.phone ? `+998 ${user.phone}` : 'Telefon kiritilmagan'}
            </span>
          </div>
        )}
      </div>

      {/* Manzillar */}
      <div className="mt-6 px-5">
        <MenuItem
          icon={<MapPin className="h-5 w-5" />}
          title="Manzillarim"
          subtitle={
            user.addresses.length > 0
              ? `${user.addresses.length} ta saqlangan`
              : 'Manzil qo\'shilmagan'
          }
          onClick={() => navigate('/addresses')}
        />
      </div>

      {/* Bonus tizimi */}
      <div className="mt-6 px-5">
        <h2 className="mb-3 text-tg-title font-extrabold">Bonus tizimi</h2>
        <div className="rounded-brand-lg bg-gradient-to-br from-amber-100 to-orange-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Gift className="h-5 w-5 text-brand-red" />
            <span className="font-bold">Har 10-buyurtma — bonus!</span>
          </div>
          <p className="mb-3 text-tg-caption leading-relaxed text-brand-dark/70">
            {stats.totalOrders % 10 === 0
              ? '🎉 Keyingi buyurtmangiz bonusli!'
              : `${10 - (stats.totalOrders % 10)} ta buyurtmadan keyin sovg'a`}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 flex-1 rounded-full',
                  i < stats.totalOrders % 10 ? 'bg-brand-yellow' : 'bg-white/60'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sozlamalar */}
      <div className="mt-6 px-5">
        <h2 className="mb-3 text-tg-title font-extrabold">Sozlamalar</h2>
        <div className="space-y-2">
          <MenuItem
            icon={<Settings className="h-5 w-5" />}
            title="Ilova sozlamalari"
            subtitle="Til, bildirishnomalar"
            onClick={() => showToast('Keyingi yangilanishda', 'default')}
          />
          <MenuItem
            icon={<Star className="h-5 w-5" />}
            title="Ilovani baholash"
            subtitle="Telegram Store'da"
            onClick={() => showToast('Rahmat!', 'success')}
          />
        </div>
      </div>

      {/* Chiqish */}
      <div className="mt-6 px-5">
        <Button
          variant="outline"
          fullWidth
          onClick={() => {
            haptic.notification('warning')
            showToast('Chiqish funksiyasi keyinroq', 'default')
          }}
        >
          <LogOut className="h-4 w-4" />
          Chiqish
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 px-5 pb-8 text-center">
        <p className="text-xxs text-brand-dark/40">
          Cheese Cafe v1.0.0
          <br />© 2026 Barcha huquqlar himoyalangan
        </p>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: string
  value: string | number
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
      <div className="mb-1 text-xl">{icon}</div>
      <div className="text-lg font-extrabold">{value}</div>
      <div className="text-xxs text-white/70">{label}</div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick: () => void
}

function MenuItem({ icon, title, subtitle, onClick }: MenuItemProps) {
  return (
    <button
      onClick={() => {
        haptic.impact('light')
        onClick()
      }}
      className="flex w-full items-center gap-3 rounded-brand bg-white p-3 shadow-card transition-transform active:scale-98"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-cream-muted text-brand-dark">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="font-bold">{title}</div>
        {subtitle && <div className="text-xxs text-brand-dark/60">{subtitle}</div>}
      </div>
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-brand-dark/30" />
    </button>
  )
}
