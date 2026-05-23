import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, error, label, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-xxs font-bold uppercase tracking-wider text-brand-dark/60">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl bg-brand-cream-muted',
            'border-2 border-transparent transition-colors',
            'focus-within:border-brand-yellow focus-within:bg-white',
            error && 'border-danger/50',
            'px-4 h-12'
          )}
        >
          {prefix && (
            <span className="flex-shrink-0 font-bold text-brand-dark">{prefix}</span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-brand-dark/40',
              'text-tg-body',
              className
            )}
            {...props}
          />
          {suffix && <span className="flex-shrink-0">{suffix}</span>}
        </div>
        {error && (
          <p className="mt-1.5 text-tg-caption font-medium text-danger">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
