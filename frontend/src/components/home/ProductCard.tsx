import { Plus, Minus, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'
import { useCartStore } from '@/stores/cart.store'
import { useUIStore } from '@/stores/ui.store'
import type { Product } from '@/types/menu'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

/**
 * Mahsulot kartasi — grid ko'rinishda 2 ustun bo'lib turadi
 * Bosilganda — modal mahsulot detali (keyinroq)
 * "+" — to'g'ridan-to'g'ri savatga qo'shadi
 */
export function ProductCard({ product, onClick }: ProductCardProps) {
  const quantity = useCartStore((s) => s.getItemQuantity(product.id))
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const showToast = useUIStore((s) => s.showToast)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic.impact('light')
    addItem({ productId: product.id })
    showToast(`${product.name} savatga qo'shildi`, 'success')
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic.impact('light')
    removeItem(product.id)
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'group relative flex flex-col overflow-hidden',
        'rounded-brand bg-white shadow-card',
        'border border-brand-dark/[0.07]',
        'cursor-pointer'
      )}
    >
      {/* Rasm bo'limi */}
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        {/* Badge */}
        {product.badge && (
          <div className="absolute left-2 top-2 z-10">
            <Badge badge={product.badge} />
          </div>
        )}

        {/* Reyting (agar bor bo'lsa) */}
        {product.rating && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-md bg-white/90 px-1.5 py-0.5 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
            <span className="text-xxs font-bold text-brand-dark">{product.rating}</span>
          </div>
        )}

        {/* Emoji / rasm */}
        <span className="text-5xl">{product.emoji}</span>
      </div>

      {/* Mazmun */}
      <div className="flex flex-1 flex-col p-2.5">
        <h3 className="line-clamp-1 text-tg-caption font-bold text-brand-dark">
          {product.name}
        </h3>
        <p className="mb-2 mt-0.5 line-clamp-2 text-xxs text-brand-dark/50">
          {product.description}
        </p>

        {/* Narx + qo'shish */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-display text-tg-title font-extrabold text-brand-red">
            {formatPrice(product.price, '')}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={cn(
                'flex h-8 w-8 items-center justify-center',
                'rounded-xl bg-brand-yellow text-brand-dark',
                'active:scale-90 transition-transform',
                'shadow-brand'
              )}
              aria-label="Qo'shish"
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
            </button>
          ) : (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleRemove}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cream-muted text-brand-dark transition-transform active:scale-90"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={3} />
              </button>
              <span className="min-w-[20px] text-center text-tg-caption font-extrabold">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-yellow text-brand-dark transition-transform active:scale-90"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
