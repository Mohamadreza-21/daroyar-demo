import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import MobileMenu from './MobileMenu'
import MobileTabBar from './MobileTabBar'
import BrandLoader from '../loaders/BrandLoader'
import OfflineBanner from '../feedback/OfflineBanner'

export default function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="fixed -top-[60px] start-4 z-[200] rounded-[12px] bg-ink px-4 py-2.5 text-white [transition:top_0.2s] focus:top-3"
      >
        پرش به محتوای اصلی
      </a>
      <Header />
      <main id="main" className="min-h-[60vh]">
        <Suspense
          fallback={
            <div className="grid min-h-[60vh] place-items-center">
              <BrandLoader variant="cross" label="لحظه‌ای صبر کنید…" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <MobileTabBar />
      <OfflineBanner />
    </>
  )
}
