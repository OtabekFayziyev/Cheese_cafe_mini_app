import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { CafeStatusBar } from './CafeStatusBar'
import { Toaster } from '@/components/ui/Toaster'

interface AppLayoutProps {
  showHeader?: boolean
  showBottomNav?: boolean
  showSearch?: boolean
}

/**
 * Asosiy layout — cafe status + header + content + bottom nav
 * Mijoz panelining barcha sahifalarini o'rab oladi
 */
export function AppLayout({
  showHeader = true,
  showBottomNav = true,
  showSearch = true,
}: AppLayoutProps = {}) {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream">
      <CafeStatusBar />
      {showHeader && <Header showSearch={showSearch} />}

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {showBottomNav && <BottomNav />}

      <Toaster />
    </div>
  )
}
