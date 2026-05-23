import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PromoCarousel } from '@/components/home/PromoCarousel'
import { CategoryScroll } from '@/components/home/CategoryScroll'
import { ProductGrid } from '@/components/home/ProductGrid'
import { useCategories, useProducts } from '@/hooks/useMenu'
import type { CategoryId, Product } from '@/types/menu'

/**
 * Bosh sahifa — promo + kategoriyalar + mahsulotlar
 * 1-bosqich asosiy sahifasi
 */
export function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all')
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: allProducts = [], isLoading: productsLoading } = useProducts()
  
  const searchQuery = searchParams.get('q') || ''

  const filteredProducts = useMemo(() => {
    let result = allProducts

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.categoryId === activeCategory)
    }

    return result.filter((p) => p.isAvailable)
  }, [allProducts, activeCategory, searchQuery])

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`)
  }

  const sectionTitle =
    activeCategory === 'all'
      ? 'Barcha taomlar'
      : categories.find((c) => c.id === activeCategory)?.name

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🧀</div>
          <div className="text-tg-body font-semibold">Yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <PromoCarousel />

      <div className="mt-6">
        <h2 className="mb-3 px-5 text-tg-title font-extrabold">Kategoriyalar</h2>
        <CategoryScroll activeId={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between px-5">
          <h2 className="text-tg-title font-extrabold">{sectionTitle}</h2>
          <span className="text-tg-caption text-brand-dark/50">
            {filteredProducts.length} ta
          </span>
        </div>

        <ProductGrid
          products={filteredProducts}
          showCategoryHeaders={activeCategory === 'all'}
          onProductClick={handleProductClick}
        />
      </div>
    </div>
  )
}
