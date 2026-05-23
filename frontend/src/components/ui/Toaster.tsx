import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useUIStore, type ToastVariant } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

const TOAST_ICONS: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
}

const TOAST_STYLES: Record<ToastVariant, string> = {
  default: 'bg-brand-dark text-brand-cream',
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-white',
}

/**
 * Toast bildirishnomalar konteyneri.
 * App ning eng yuqori darajasida joylashtiriladi.
 */
export function Toaster() {
  const toasts = useUIStore((s) => s.toasts)

  return (
    <div className="pointer-events-none fixed bottom-24 left-0 right-0 z-[300] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'pointer-events-auto flex items-center gap-2.5',
              'rounded-full px-4 py-2.5',
              'text-tg-caption font-semibold',
              'shadow-card-hover',
              TOAST_STYLES[toast.variant]
            )}
          >
            {TOAST_ICONS[toast.variant]}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
