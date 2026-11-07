import { FaHome, FaUsers, FaChartBar,FaCog, FaUserCheck, FaEye, FaCalendarAlt, FaBell, FaServer, FaTimes, FaCreditCard, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { IoMdAnalytics } from 'react-icons/io'
import { BsFillCalendar3EventFill } from 'react-icons/bs'
import { FaFileWaveform } from "react-icons/fa6";
import { useState } from 'react'
import { MdOutlineSecurity } from 'react-icons/md'
import { checkPermissions } from '../../utils/helper';
import type { User } from '../../api/auth';

interface MenuItem {
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label?: string
  exact?: boolean
  children?: { path: string; label: string }[]
}

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
  userRole?: string
  user?: User
}

const dashboardRoleMap: Record<string, { path: string; label: string }> = {
  help_desk: { path: '/dashboard/helpdesk', label: 'Help Desk' },
  data_manager: { path: '/dashboard/dataManager', label: 'Data Manager' },
  team_leader: { path: '/dashboard/teamLeader', label: 'Team Leader' },
  staff: { path: '/dashboard/staff', label: 'Staff' },
  system_office: { path: '/dashboard/systemOffice', label: 'System Office' },
  human_resource: { path: '/dashboard/humanResource', label: 'Human Resource' },
  protocals: { path: '/dashboard/protocals', label: 'Protocals' },
  check_point: { path: '/dashboard/checkPoint', label: 'Check Point' },
}
function DashboardSidebar({ isOpen, onClose, userRole = 'owner', user }: DashboardSidebarProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  // Preserve role parameter in navigation
  const roleParam = searchParams.get('role')
  const addRoleParam = (path: string) => {
    return roleParam ? `${path}?role=${roleParam}` : path
  }

  // Owner menu items (System Owner)
  const ownerItems: MenuItem[] = [
    { path: '/dashboard', icon: FaHome, label: 'Owner Dashboard', exact: true },
    ...(user && checkPermissions(user, 'customer:list') ? [{
      path: '/dashboard/customers', 
      icon: FaUsers, 
      label: 'Customers',
      children: [
        {path: '/dashboard/customers', label: 'All Accounts' },
        { path: '/dashboard/customers/active', label: 'Active Accounts' },
        { path: '/dashboard/customers/inactive', label: 'Inactive Accounts' },
        { path: '/dashboard/customers/suspended', label: 'Suspended Accounts' },
        { path: '/dashboard/customers/blacklisted', label: 'Blacklisted Accounts' }
      ]
    }] : []),
    ...(user && checkPermissions(user, 'user:list') ? [{ 
      path: '/dashboard/users', 
      icon: FaUsers, 
      label: 'Users',
      children:[
        {path:'/dashboard/users', label: 'All Users' },
        {path:'/dashboard/users/active', label: ' Active Users' },
        {path:'/dashboard/users/inactive', label: 'Inactive Users' },
        {path:'/dashboard/users/blacklisted', label: 'Blacklisted Users' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'billing:list') ? [{
      path: '/dashboard/billings', 
      icon: FaCreditCard, 
      label: 'Billing & Revenue'
    }] : []),
    ...(user && checkPermissions(user, 'analytics:read') ? [{
      path: '/dashboard/Analytics', 
      icon: IoMdAnalytics, 
      label: 'Business Analytics'
    }] : []),
    ...(user && checkPermissions(user, 'form:list') ? [{
      path: '/dashboard/forms', 
      icon: FaFileWaveform, 
      label: 'Form Management',
      children: [
        { path: '/dashboard/forms', label: 'All Forms' },
        { path: '/dashboard/forms/create', label: 'Create New Form' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'report:list') ? [{
      path: '/dashboard/system-reports', 
      icon: FaChartBar, 
      label: 'System Reports',
      children: [
        { path: '/dashboard/system-reports', label: 'System Reports' },
        { path: '/dashboard/system-reports/createReport', label: 'Create Report' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'system_healthy:read') ? [{
      path: '/dashboard/system-health', 
      icon: FaServer, 
      label: 'System Health'
    }] : []),
    ...(user && checkPermissions(user, 'security:control') ? [{
      path: '/dashboard/security', 
      icon: MdOutlineSecurity, 
      label: 'Security Control'
    }] : []),
  ]

  // Get dashboard children based on user role
  const getDashboardChildren = () => {
    if (userRole === 'owner') {
      return [{ path: '/dashboard' }]
    }

    // Normalize role names to be resilient to backend formatting
    const normalizedRole = (userRole ?? '').toString().toLowerCase().replace(/[^a-z0-9]/g, '')

    // Find matching role entry by normalizing dashboardRoleMap keys
    const entry = Object.entries(dashboardRoleMap).find(([key]) => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      return normalizedKey === normalizedRole
    })

    if (entry) {
      return [entry[1]]
    }

    return [{ path: '/dashboard', label: 'Overview' }]
  }

  // Role-specific menu items
  const getRoleBasedDashboardItem = (): MenuItem => {
    const dashboardChildren = getDashboardChildren()
    if (dashboardChildren.length > 0 && dashboardChildren[0].path !== '/dashboard') {
      return {
        path: dashboardChildren[0].path,
        icon: FaHome,
        exact: true,
        label: 'Dashboard',
      }
    }
    return {
      path: '/dashboard',
      icon: FaHome,
      label: 'Dashboard',
      exact: true,
    }
  }

  // Client menu items (Customer/Role-based)
  const clientItems: MenuItem[] = [
    getRoleBasedDashboardItem(),
    ...(user && checkPermissions(user, 'user:list') ? [{
      path: '/dashboard/users', 
      icon: FaUsers, 
      label: 'Users',
      children:[
        {path: '/dashboard/users', label: 'All Users' },
        {path: '/dashboard/users/active', label: ' Active Users' },
        {path:'/dashboard/users/inactive', label: ' Inactive Users' },
        {path:'/dashboard/users/blacklisted', label: ' BlackListed Users' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'visitor:read') ? [{
      path: '/dashboard/scanning', 
      icon: FaEye, 
      label: 'Scanning'
    }] : []),
    ...(user && checkPermissions(user, 'attendance:list') ? [{
      path: '/dashboard/attendance', 
      icon: FaUsers, 
      label: 'Attendances',
      children:[
        {path: '/dashboard/attendedUser', label: 'Users' },
        {path: '/dashboard/visitor', label: 'Visitors' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'visitor:list') ? [{
      path: '/dashboard/hosts', 
      icon: FaUserCheck, 
      label: 'Hosts'
    }] : []),
    ...(user && checkPermissions(user, 'appointment:list') ? [{
      path: '/dashboard/appointments', 
      icon: FaCalendarAlt, 
      label: 'Appointments',
      children:[
        {path: '/dashboard/appointments', label: 'All Appointments' },
        {path: '/dashboard/appointments/viaCalender', label: 'Calendar View' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'event:list') ? [{
      path: '/dashboard/Events', 
      icon: BsFillCalendar3EventFill, 
      label: 'Events',
      children: [
        { path: '/dashboard/events', label: 'All Events' },
        { path: '/dashboard/protocals', label: 'Protocals' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'equipement:list') ? [{
      path: '/dashboard/equipments', 
      icon: FaServer, 
      label: 'Equipments',
      children: [
        { path: '/dashboard/equipments', label: 'All Equipments' },
        { path: '/dashboard/equipments/add', label: 'Add New Equipment' },
      ]
    }] : []),
    ...(user && checkPermissions(user, 'handover:list') ? [{
      path:'/dashboard/handover', 
      icon: FaUserCheck, 
      label: 'Handover'
    }] : []),
    ...(user && checkPermissions(user, 'report:list') ? [{
      path: '/dashboard/reports', 
      icon: FaChartBar, 
      label: 'Reports & Analytics'
    }] : []),
    ...(user && checkPermissions(user, 'announcement:read') ? [{
      path: '/dashboard/notifications', 
      icon: FaBell, 
      label: 'Notifications'
    }] : []),
  ]

  const menuItems = userRole === 'owner' ? ownerItems : clientItems
  
 
  const settingsItem = { path: '/dashboard/settings', icon: FaCog, label: 'Settings' }

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    // For all child items, use exact match
    return location.pathname === path
  }

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`w-64 bg-[#1A3263] text-white h-full flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative z-50 lg:z-auto`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      <nav className="flex-1 px-4 pt-10 flex flex-col min-h-0">
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden self-end mb-4 p-2 text-white hover:bg-white/10 rounded-lg"
        >
          <FaTimes size={18} />
        </button>
        <div className="flex-1 overflow-y-scroll min-h-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <ul className="space-y-4 pb-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const hasChildren = 'children' in item && item.children
              const isExpanded = expandedItems.includes(item.path)
              
              return (
                <li key={item.path}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-white text-[#1A3263] font-medium'
                            : 'text-[#1A3263] hover:bg-white/10 hover:text-[#1A3263] font-medium'
                        }`}
                      >
                        <Icon size={18} className={location.pathname === item.path ? 'text-[#1A3263]' : 'text-gray-300'} />
                        <span className={`font-bold flex-1 text-left ${location.pathname === item.path ? 'text-[#1A3263]' : 'text-gray-300'}`}>{item.label}</span>
                        {isExpanded ? 
                          <FaChevronDown size={14} className={location.pathname === item.path ? 'text-[#1A3263]' : 'text-gray-300'} /> : 
                          <FaChevronRight size={14} className={location.pathname === item.path ? 'text-[#1A3263]' : 'text-gray-300'} />
                        }
                      </button>
                      {isExpanded && (
                        <div className="relative ml-6 mt-2">
                          <div className="absolute  top-0 bottom-0 w-px bg-white/30"></div>
                          <ul className="space-y-2">
                            {item.children?.map((child) => (
                              <li key={child.path} className="relative">
                                <div className="absolute  top-4 w-3 h-px bg-white/30"></div>
                                <Link
                                  to={addRoleParam(child.path)}
                                  className={`block pl-6 pr-4 py-2 rounded-lg text-sm transition-colors ${
                                    isActive(child.path)
                                      ? 'bg-white text-[#1A3263] font-medium'
                                      : '!text-white hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={addRoleParam(item.path)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path, item.exact)
                          ? 'bg-white text-[#1A3263] font-medium'
                          : 'text-[#1A3263] hover:bg-white/10 hover:text-[#1A3263] font-medium'
                      }`}
                    >
                      <Icon size={18} className={isActive(item.path, item.exact) ? 'text-[#1A3263]' : 'text-gray-300'} />
                      <span className={`font-bold ${isActive(item.path, item.exact) ? 'text-[#1A3263]' : 'text-gray-300'}`}>{item.label}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
        
        {/* Settings at bottom */}
        {user && checkPermissions(user, 'setting:read') && (
          <div className="flex-shrink border-t border-white/20 ">
            <Link
              to={addRoleParam(settingsItem.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive(settingsItem.path)
                  ? 'bg-white text-[#1A3263] font-medium'
                  : 'text-[#1A3263] hover:bg-white/10 hover:text-[#1A3263] font-medium'
              }`}
            >
              <settingsItem.icon size={18} className={isActive(settingsItem.path) ? 'text-[#1A3263]' : 'text-gray-300'} />
              <span className={`font-bold ${isActive(settingsItem.path) ? 'text-[#1A3263]' : 'text-gray-300'}`}>{settingsItem.label}</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
    </>
  )
}

export default DashboardSidebar