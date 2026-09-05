import { Outlet } from 'react-router-dom'
import { cn } from '@/shared/lib/cn.ts'
import { useUiStore } from '@/app/stores/ui-store.ts'
import { MobileHeader } from './mobile-header.tsx'
import { PageContainer } from './page-container.tsx'
import { Sidebar } from './sidebar.tsx'
import { Topbar } from './topbar.tsx'

export function AppLayout() {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)

  return (
    <div className={cn('app-shell', isSidebarCollapsed && 'app-shell--sidebar-collapsed')}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Sidebar />
      <div className="app-shell__main">
        <MobileHeader />
        <Topbar />
        <main className="app-shell__content" id="main-content" tabIndex={-1}>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
