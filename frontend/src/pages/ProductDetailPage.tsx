import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, Clock, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useBackButton } from '@/hooks/useBackButton'
import { useMainButton } from '@/hooks/useMainButton'
import { useCartStore } from '@/stores/cart.store'
import { useUIStore } from '@/stores/ui.store'
import { useProduct } from '@/hooks/useMenu'
import { formatPrice } from '@/lib/format'
import { haptic } from '@/lib/telegram'
import { cn } from '@/lib/utils'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id!)

  const [selectedVariantId, setSelectedVariantId] = useState<string>()
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const showToast = useUIStore((s) => s.showToast)

  useBackButton(() => navigate(-1))

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🧀</div>
          <div className="text-tg-body font-semibold">Yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h2 className="mb-2 text-tg-headline font-extrabold">Mahsulot topilmadi</h2>
          <Button onClick={() => navigate('/')}>Bosh sahifaga</Button>
        </div>
      </div>
    )
  }
  const variantPrice = product.variants?.find((v) => v.id === selectedVariantId)?.priceModifier ?? 0
  const addonsPrice = selectedAddonIds.reduce((sum, addonId) => {
    const addon = product.addons?.find((a) => a.id === addonId)
    return sum + (addon?.price ?? 0)
  }, 0)
  const totalPrice = (product.price + variantPrice + addonsPrice) * quantity

  // Savatga qo'shish
  const handleAddToCart = () => {
    haptic.notification('success')
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        variantId: selectedVariantId,
        addonIds: selectedAddonIds.length > 0 ? selectedAddonIds : undefined,
        comment: comment.trim() || undefined,
      })
    }

    showToast(`${product.name} savatga qo'shildi!`, 'success')
    navigate(-1)
  }

  // Telegram MainButton
  useMainButton({
    text: `Savatga qo'shish — ${formatPrice(totalPrice)}`,
    onClick: handleAddToCart,
    visible: true,
    active: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-brand-cream/95 px-5 py-4 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cream-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 px-4 text-center text-tg-title font-extrabold line-clamp-1">
          {product.name}
        </h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Rasm */}
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 px-5 py-16">
        {product.badge && (
          <div className="absolute left-5 top-5">
            <Badge badge={product.badge} />
          </div>
        )}
        <div className="text-center text-8xl">{product.emoji}</div>
      </div>

      <div className="px-5">
        {/* Info */}
        <div className="border-b border-brand-dark/[0.06] py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black">{product.name}</h2>
            {product.rating && (
              <div className="flex items-center gap-1 rounded-xl bg-brand-yellow/20 px-2.5 py-1">
                <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                <span className="text-tg-caption font-bold">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-xxs text-brand-dark/50">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <p className="text-tg-body leading-relaxed text-brand-dark/70">{product.description}</p>
          
          {product.preparationTime && (
            <div className="mt-3 flex items-center gap-1.5 text-tg-caption text-brand-dark/60">
              <Clock className="h-4 w-4" />
              <span>Tayyorlash: ~{product.preparationTime} daq</span>
            </div>
          )}

          <div className="mt-4">
            <span className="font-display text-3xl font-black text-brand-red">
              {formatPrice(product.price + variantPrice)}
            </span>
            {product.oldPrice && (
              <span className="ml-2 text-tg-body text-brand-dark/40 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Variantlar */}
        {product.variants && product.variants.length > 0 && (
          <div className="border-b border-brand-dark/[0.06] py-5">
            <h3 className="mb-3 text-tg-title font-extrabold">
              {product.categoryId === 'drink' ? 'Hajm tanlang' : 'O\'lcham tanlang'}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id
                const price = product.price + variant.priceModifier
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      haptic.selection()
                      setSelectedVariantId(variant.id)
                    }}
                    className={cn(
                      'rounded-2xl border-2 p-3 text-center transition-all',
                      isSelected
                        ? 'border-brand-yellow bg-brand-yellow/10'
                        : 'border-brand-dark/10 bg-white'
                    )}
                  >
                    <div className="text-tg-caption font-bold">{variant.name}</div>
                    <div className="mt-1 text-xxs font-semibold text-brand-red">
                      {formatPrice(price)}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Qo'shimchalar */}
        {product.addons && product.addons.length > 0 && (
          <div className="border-b border-brand-dark/[0.06] py-5">
            <h3 className="mb-3 text-tg-title font-extrabold">Qo'shimchalar</h3>
            <div className="space-y-2">
              {product.addons.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    onClick={() => {
                      haptic.selection()
                      setSelectedAddonIds((prev) =>
                        prev.includes(addon.id)
                          ? prev.filter((id) => id !== addon.id)
                          : [...prev, addon.id]
                      )
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl border-2 p-3 transition-all',
                      isSelected
                        ? 'border-brand-yellow bg-brand-yellow/10'
                        : 'border-brand-dark/10 bg-white'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {addon.emoji && <span className="text-xl">{addon.emoji}</span>}
                      <span className="font-semibold">{addon.name}</span>
                    </div>
                    <span className="text-tg-caption font-bold text-brand-red">
                      +{formatPrice(addon.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Izoh */}
        <div className="border-b border-brand-dark/[0.06] py-5">
          <h3 className="mb-3 text-tg-title font-extrabold">Maxsus talablar</h3>
          <p className="mb-3 text-tg-caption text-brand-dark/60">
            {product.categoryId === 'drink'
              ? 'Masalan: "Salqin bo\'lsin", "Iliq bo\'lsin", "Muz qo\'shing"'
              : product.categoryId === 'dessert'
              ? 'Masalan: "Shirin emas", "Ko\'proq krem", "Shakar kam"'
              : 'Masalan: "pomidor olib tashlang", "o\'tkir bo\'lsin", "sous ko\'p bo\'lsin"'}
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Izohingizni yozing (ixtiyoriy)..."
            className={cn(
              'w-full rounded-2xl border-2 border-transparent bg-brand-cream-muted',
              'px-4 py-3 text-tg-body outline-none transition-colors',
              'placeholder:text-brand-dark/40',
              'focus:border-brand-yellow focus:bg-white',
              'min-h-[100px] resize-none'
            )}
            maxLength={200}
          />
          <div className="mt-2 text-right text-xxs text-brand-dark/40">
            {comment.length}/200
          </div>
        </div>

        {/* Miqdor */}
        <div className="py-5">
          <h3 className="mb-3 text-tg-title font-extrabold">Miqdor</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                haptic.impact('light')
                setQuantity((q) => Math.max(1, q - 1))
              }}
              disabled={quantity <= 1}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cream-muted disabled:opacity-40"
            >
              <Minus className="h-5 w-5" strokeWidth={3} />
            </button>
            <span className="flex-1 text-center text-2xl font-black">{quantity}</span>
            <button
              onClick={() => {
                haptic.impact('light')
                setQuantity((q) => Math.min(20, q + 1))
              }}
              disabled={quantity >= 20}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow disabled:opacity-40"
            >
              <Plus className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
