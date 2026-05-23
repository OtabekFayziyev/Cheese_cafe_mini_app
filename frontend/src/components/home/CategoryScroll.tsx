import { CATEGORIES } from '@/data/categories.mock'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'
import type { CategoryId } from '@/types/menu'
import { motion } from 'framer-motion'

interface CategoryScrollProps {
  activeId: CategoryId | 'all'
  onChange: (id: CategoryId | 'all') => void
}

/**
 * Horizontal scrollable kategoriya tasmasi
 * "Barchasi" + barcha kategoriyalar
 */
export function CategoryScroll({ activeId, onChange }: CategoryScrollProps) {
  const handleClick = (id: CategoryId | 'all') => {
    haptic.selection()
    onChange(id)
  }

  return (
    <div className="scrollbar-hide flex gap-2.5 overflow-x-auto px-5 pb-1">
      {/* "Barchasi" item */}
      <CategoryItem
        emoji="🍽️"
        label="Barchasi"
        isActive={activeId === 'all'}
        onClick={() => handleClick('all')}
      />

      {/* Boshqa kategoriyalar */}
      {CATEGORIES.map((cat) => (
        <CategoryItem
          key={cat.id}
          emoji={cat.emoji}
          label={cat.name}
          isActive={activeId === cat.id}
          onClick={() => handleClick(cat.id)}
        />
      ))}
    </div>
  )
}

interface CategoryItemProps {
  emoji: string
  label: string
  isActive: boolean
  onClick: () => void
}

function CategoryItem({ emoji, label, isActive, onClick }: CategoryItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex min-w-[64px] flex-col items-center gap-1.5"
    >
      <motion.div
        animate={{
          scale: isActive ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'flex h-14 w-14 items-center justify-center text-2xl',
          'rounded-2xl border-2 transition-colors',
          isActive
            ? 'bg-brand-yellow border-brand-yellow shadow-brand'
            : 'bg-brand-cream-muted border-transparent'
        )}
      >
        {emoji}
      </motion.div>
      <span
        className={cn(
          'whitespace-nowrap text-xxs font-semibold',
          isActive ? 'text-brand-dark' : 'text-brand-dark/60'
        )}
      >
        {label}
      </span>
    </button>
  )
}
