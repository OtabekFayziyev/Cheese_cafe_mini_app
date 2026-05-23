import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ProductBadge } from '@/types/menu'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xxs font-extrabold uppercase tracking-wider',
  {
    variants: {
      variant: {
        hot: 'bg-brand-red text-white',
        new: 'bg-brand-yellow text-brand-dark',
        top: 'bg-brand-dark text-brand-yellow',
        discount: 'bg-success text-white',
        bestseller: 'bg-gradient-to-r from-brand-yellow to-brand-red text-white',
      },
    },
    defaultVariants: {
      variant: 'new',
    },
  }
)

const BADGE_LABELS: Record<ProductBadge, string> = {
  hot: '🔥 HOT',
  new: '✨ YANGI',
  top: '⭐ TOP',
  discount: '% CHEGIRMA',
  bestseller: '👑 BESTSELLER',
}

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  badge?: ProductBadge
  className?: string
  children?: React.ReactNode
}

export function Badge({ badge, variant, className, children }: BadgeProps) {
  const finalVariant = variant ?? badge
  const finalChildren = children ?? (badge ? BADGE_LABELS[badge] : null)

  return (
    <span className={cn(badgeVariants({ variant: finalVariant }), className)}>
      {finalChildren}
    </span>
  )
}
