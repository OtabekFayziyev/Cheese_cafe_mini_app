import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { PROMOS, type Promo } from '@/data/promos.mock'
import { Sheet } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

const AUTO_PLAY_INTERVAL = 5000 // 5 sekund

/**
 * Promo karusel — bosh sahifada aksiyalar
 * Avtomatik o'zgaradi, swipe ham mumkin, bosilganda modal
 */
export function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null)

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PROMOS.length)
  }, [])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PROMOS.length) % PROMOS.length)
  }, [])

  // Avtomatik o'tish
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(goToNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [goToNext, isPaused])

  const current = PROMOS[activeIndex]

  // Swipe handler
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      haptic.selection()
      goToPrev()
    } else if (info.offset.x < -threshold) {
      haptic.selection()
      goToNext()
    }
  }

  const handlePromoClick = () => {
    haptic.impact('medium')
    setSelectedPromo(current)
  }

  return (
    <>
      <div
        className="px-5 pt-4"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Banner */}
        <div className="relative overflow-hidden rounded-brand">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={handlePromoClick}
              className={cn(
                'relative flex min-h-[120px] cursor-pointer items-center justify-between p-5',
                'bg-gradient-to-br',
                current.gradient,
                'active:scale-[0.98] transition-transform'
              )}
            >
              {/* Dekorativ aylanalar */}
              <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 right-10 h-20 w-20 rounded-full bg-white/5" />

              {/* Matn */}
              <div className="relative z-10 flex-1">
                <div className="mb-2 inline-block rounded-md bg-brand-yellow px-2 py-0.5 text-xxs font-extrabold uppercase tracking-wider text-brand-dark">
                  {current.badge}
                </div>
                <h3 className="font-display text-xl font-black leading-tight text-white">
                  {current.title}
                </h3>
                <p className="mt-1 text-tg-caption text-white/80">{current.description}</p>
              </div>

              {/* Emoji */}
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative z-10 text-5xl"
              >
                {current.emoji}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indikator */}
        <div className="mt-3 flex justify-center gap-1.5">
          {PROMOS.map((promo, idx) => (
            <button
              key={promo.id}
              onClick={() => {
                haptic.selection()
                setActiveIndex(idx)
              }}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                idx === activeIndex
                  ? 'w-6 bg-brand-red'
                  : 'w-1.5 bg-brand-dark/15'
              )}
              aria-label={`${idx + 1}-banner`}
            />
          ))}
        </div>
      </div>

      {/* Promo detail modal */}
      <Sheet
        open={!!selectedPromo}
        onOpenChange={(open) => !open && setSelectedPromo(null)}
        title={selectedPromo?.title}
      >
        {selectedPromo && (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-7xl">
              {selectedPromo.emoji}
            </div>
            <div className="rounded-xl bg-brand-cream-muted p-4">
              <div className="mb-2 inline-block rounded-md bg-brand-yellow px-2 py-0.5 text-xxs font-extrabold uppercase tracking-wider text-brand-dark">
                {selectedPromo.badge}
              </div>
              <h3 className="mb-2 font-display text-2xl font-black">
                {selectedPromo.title}
              </h3>
              <p className="text-tg-body leading-relaxed text-brand-dark/70">
                {selectedPromo.description}
              </p>
            </div>

            {/* Qo'shimcha ma'lumot (keyinroq backend dan keladi) */}
            <div className="space-y-2 text-tg-caption text-brand-dark/60">
              <p>✅ Barcha taomlar uchun amal qiladi</p>
              <p>📅 Muddati: Doimiy aksiya</p>
              <p>ℹ️ Tafsilotlar uchun operator bilan bog'laning</p>
            </div>
          </div>
        )}
      </Sheet>
    </>
  )
}
