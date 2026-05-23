import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

// Tugma variantlari — shadcn/ui pattern asosida
const buttonVariants = cva(
  // Asosiy klasslar — barcha variantlarda
  [
    'inline-flex items-center justify-center gap-2',
    'font-bold whitespace-nowrap rounded-2xl',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    'active:scale-[0.97]',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand-red text-white shadow-card hover:bg-brand-red-dark',
        secondary: 'bg-brand-yellow text-brand-dark shadow-brand hover:bg-brand-yellow-dark',
        outline:
          'border-2 border-brand-dark/10 bg-transparent text-brand-dark hover:bg-brand-cream-muted',
        ghost: 'bg-transparent text-brand-dark hover:bg-brand-cream-muted',
        dark: 'bg-brand-dark text-brand-yellow hover:bg-brand-dark-light',
        success: 'bg-success text-white',
        destructive: 'bg-danger text-white',
      },
      size: {
        sm: 'h-9 px-3 text-tg-caption',
        md: 'h-11 px-4 text-tg-body',
        lg: 'h-14 px-6 text-tg-title',
        xl: 'h-16 px-8 text-tg-headline',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  // Telegram haptic feedback
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'error'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      hapticType = 'light',
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic javob — Telegram ichida vibratsiya
      if (hapticType === 'success' || hapticType === 'error') {
        haptic.notification(hapticType === 'success' ? 'success' : 'error')
      } else {
        haptic.impact(hapticType)
      }
      onClick?.(e)
    }

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
