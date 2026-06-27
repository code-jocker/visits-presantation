import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/ui/dashboardHeader'
import DashboardSidebar from '../components/ui/dashboardSidebar'
import borderImage from '../assets/images/design.png'
import { useAuth } from '../hooks/useAuth'

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Get current user
  const { currentUser } = useAuth()

  // Determine userRole based on user's roleType or roles
  const userRole = currentUser?.roleType === 'owner' 
    ? 'owner' 
    : currentUser?.roles?.[0]?.name || 'client'
  
  console.log('🔑 DashboardLayout - User Role Type:', currentUser?.roleType)
  console.log('🔑 DashboardLayout - User Roles:', currentUser?.roles)
  console.log('🎯 DashboardLayout - Determined userRole:', userRole)

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