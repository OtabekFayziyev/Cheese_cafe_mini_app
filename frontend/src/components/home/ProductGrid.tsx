import { ProductCard } from './ProductCard'
import { SearchX } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types/menu'
import { CATEGORIES } from '@/data/categories.mock'

interface ProductGridProps {
  products: Product[]
  showCategoryHeaders?: boolean
  onProductClick?: (product: Product) => void
}

/**
 * Mahsulotlar gridi (2 ustun, mobile-first)
 * Agar showCategoryHeaders=true bo'lsa — kategoriya bo'yicha guruhlab ko'rsatadi
 */
export function ProductGrid({
  products,
  showCategoryHeaders = false,
  onProductClick,
}: ProductGridProps) {
  // Bo'sh holat
  if (products.length === 0) {
    return <EmptyState />
  }

  // Guruhlash kerakmi?
  if (!showCategoryHeaders) {
    return (
      <div className="grid grid-cols-2 gap-3 px-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>
    )
  }

  // Kategoriya bo'yicha guruhlash
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.categoryId]) acc[p.categoryId] = []
    acc[p.categoryId].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([categoryId, items]) => {
        const category = CATEGORIES.find((c) => c.id === categoryId)
        return (
          <section key={categoryId}>
            <h2 className="mb-3 flex items-center gap-2 px-5 text-tg-title font-extrabold text-brand-dark">
              <span className="text-2xl">{category?.emoji}</span>
              {category?.name}
            </h2>
            <div className="grid grid-cols-2 gap-3 px-5">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick?.(product)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/**
 * Bo'sh holat (qidiruv natija topilmaganda)
 */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-5 py-20 text-center"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-cream-muted">
        <SearchX className="h-10 w-10 text-brand-dark/30" />
      </div>
      <h3 className="mb-2 text-tg-title font-extrabold text-brand-dark">
        Taom topilmadi
      </h3>
      <p className="max-w-xs text-tg-caption leading-relaxed text-brand-dark/50">
        Boshqa kalit so'z bilan qidirib ko'ring yoki boshqa kategoriya tanlang
      </p>
    </motion.div>
  )
}
