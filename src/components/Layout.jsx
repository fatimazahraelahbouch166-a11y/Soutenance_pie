// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import Topbar  from './Topbar'

// export default function Layout() {
//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       <Sidebar />
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         <Topbar />
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar        from './Sidebar'
import Topbar         from './Topbar'
import UpgradeBanner  from './subscription/UpgradeBanner'
import PaywallOverlay from './subscription/PaywallOverlay'
import GlobalSearch   from './GlobalSearch'
import { GlobalStoreProvider } from '../store/GlobalStore'

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <GlobalStoreProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--cream)' }}>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar onSearchOpen={() => setSearchOpen(true)} />
          <UpgradeBanner />
          <main
            className="flex-1 overflow-y-auto"
            style={{ padding: '28px 32px', background: 'var(--cream)' }}
          >
            <Outlet />
          </main>
        </div>
        <PaywallOverlay />
        <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </GlobalStoreProvider>
  )
}