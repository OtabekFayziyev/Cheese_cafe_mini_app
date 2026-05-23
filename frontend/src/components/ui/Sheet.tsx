import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  showHandle?: boolean
  showClose?: boolean
}

/**
 * Bottom Sheet (pastdan chiqadigan modal)
 * Telegram standartiga mos — savat, mahsulot, buyurtma uchun
 */
export function Sheet({
  open,
  onOpenChange,
  children,
  title,
  showHandle = true,
  showClose = true,
}: SheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay (orqa fon) */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            {/* Content (modal mazmuni) */}
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className={cn(
                  'fixed bottom-0 left-0 right-0 z-50',
                  'max-h-[92vh] overflow-hidden',
                  'rounded-t-brand-xl bg-brand-cream',
                  'flex flex-col'
                )}
              >
                {/* Handle (yuqorida torgich) */}
                {showHandle && (
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-brand-dark/15" />
                  </div>
                )}

                {/* Sarlavha + close tugma */}
                {(title || showClose) && (
                  <div className="flex items-center justify-between px-5 pt-3 pb-2">
                    {title ? (
                      <DialogPrimitive.Title className="text-tg-headline font-extrabold">
                        {title}
                      </DialogPrimitive.Title>
                    ) : (
                      <span />
                    )}
                    {showClose && (
                      <DialogPrimitive.Close className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream-muted text-brand-dark/60 transition-colors hover:bg-brand-dark/10">
                        <X className="h-4 w-4" />
                      </DialogPrimitive.Close>
                    )}
                  </div>
                )}

                {/* Asosiy kontent (scrollable) */}
                <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
