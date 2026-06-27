import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/ui/dashboardHeader'
import DashboardSidebar from '../components/ui/dashboardSidebar'
import borderImage from '../assets/images/design.png'
import { useAuth } from '../hooks/useAuth'

function normalizeRoleName(name: string): string {
  return name.toLowerCase().replace(/[\s-]/g, '_')
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { currentUser, isLoadingUser } = useAuth()

  const userRole = (() => {
    if (!currentUser && isLoadingUser) return 'client'
    if (currentUser?.roleType === 'owner') return 'owner'
    const firstName = currentUser?.roles?.[0]?.name
    if (firstName) return normalizeRoleName(firstName)
    if (currentUser?.roleType === 'customer') return 'client'
    if (!currentUser) return 'client'
    return 'client'
  })()

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userRole={userRole}
          user={currentUser}
        />

        {/* Content with border design */}
        <main
          className="flex-1 overflow-y-auto p-6 relative"
          style={{
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderImage: `url(${borderImage}) 8 repeat`,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout