import { useEffect, useState } from 'react'
import { FaBuilding, FaChartLine, FaExclamationTriangle, FaCreditCard, FaServer, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import CustomerDashboard from './dashboard/Roles/superAdmin'
import { usersApi } from '../api/users'
import { visitorApi } from '../api/visitor'
import { useAuth } from '../hooks/useAuth'
import HelpDeskDashboard from './dashboard/Roles/helpDesk'
import DataManagerDashboard from './dashboard/Roles/dataManager'
import TeamLeader from './dashboard/Roles/teamLeader'
import Staff from './dashboard/Roles/staff'
import CheckPoint from './dashboard/Roles/check point'
import ProtocalPage from './dashboard/protocals'

function Dashboard() {
  const navigate = useNavigate()
  const { currentUser, isLoadingUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [primaryStats, setPrimaryStats] = useState<any[]>([])
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([])
  const [revenueBreakdown, setRevenueBreakdown] = useState<any[]>([])
  const [businessActivity, setBusinessActivity] = useState<any[]>([])
  const [recentCustomers, setRecentCustomers] = useState<any[]>([])

  // Determine role
  const roleType = currentUser?.roleType
  const firstRoleName = currentUser?.roles?.[0]?.name?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? ''

  const roleComponentMap: Record<string, React.ReactElement> = {
    helpdesk: <HelpDeskDashboard />,
    helpdeskrole: <HelpDeskDashboard />,
    datamanager: <DataManagerDashboard />,
    teamleader: <TeamLeader />,
    staff: <Staff />,
    checkpoint: <CheckPoint />,
    protocals: <ProtocalPage />,
  }

  const isOwner = roleType === 'owner' || (!roleType && !firstRoleName)
  const isCustomer = roleType === 'customer' || (roleType !== 'owner' && !!firstRoleName)
  const roleComponent = roleComponentMap[firstRoleName]

  // Fetch dashboard data
  useEffect(() => {
    if (!isOwner) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch users data
        const usersResponse = await usersApi.getAll({ take: 1000 })
        const usersData = usersResponse.result || []
        
        // Fetch visitors data - using getRecentTaps instead of getRecent
        const visitorsResponse = await visitorApi.getRecentTaps({})
        const visitorsData = visitorsResponse.result || []

        // Calculate stats
        const activeUsersCount = usersData.filter((u: any) => u.status === 'Active').length

        // Set primary stats
        setPrimaryStats([
          { title: 'Total Users', value: usersData.length, icon: FaBuilding, color: 'bg-blue-500', change: '+8.2%', trend: 'up' },
          { title: 'Active Users', value: activeUsersCount, icon: FaChartLine, color: 'bg-green-500', change: '+15.3%', trend: 'up' },
          { title: 'Total Visitors', value: visitorsData.length, icon: FaBuilding, color: 'bg-yellow-500', change: '+18.5%', trend: 'up' },
          { title: 'Check-ins Today', value: visitorsData.filter((v: any) => v.status === 'IN').length, icon: FaCreditCard, color: 'bg-purple-500', change: '+12.1%', trend: 'up' },
          { title: 'System Uptime', value: '99.8%', icon: FaServer, color: 'bg-indigo-500', change: '+0.2%', trend: 'up' }
        ])

        // Set business alerts (will be dynamic based on actual system state)
        setCriticalAlerts([
          { id: 1, type: 'users', message: `${usersData.length} total users in system`, severity: 'info', action: 'View Users' },
          { id: 2, type: 'visitors', message: `${visitorsData.length} visitors recorded`, severity: 'info', action: 'View Visitors' },
          { id: 3, type: 'system', message: 'System running normally', severity: 'success', action: 'View Status' },
          { id: 4, type: 'activity', message: `${activeUsersCount} users active today`, severity: 'info', action: 'View Activity' }
        ])

        // Set recent visitors as business activity
        setBusinessActivity(
          visitorsData.slice(0, 5).map((visitor: any, index: number) => ({
            id: index + 1,
            type: 'visitor',
            message: `Visitor: ${visitor.fullName} - ${visitor.purpose || 'No purpose specified'}`,
            time: visitor.createdAt ? new Date(visitor.createdAt).toLocaleString() : 'Unknown',
            color: 'bg-blue-500'
          }))
        )

        // Set recent users as customers
        setRecentCustomers(
          usersData.slice(0, 3).map((user: any, index: number) => ({
            id: index + 1,
            name: user.fullName,
            role: user.role || 'User',
            signupDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
            status: user.status || 'Unknown',
            company: user.company || user.department || '-'
          }))
        )

        // Revenue breakdown based on user roles
        const adminCount = usersData.filter((u: any) => u.role === 'Admin').length
        const managerCount = usersData.filter((u: any) => u.role === 'Manager').length
        const userCount = usersData.length - adminCount - managerCount

        setRevenueBreakdown([
          { plan: 'Administrators', customers: adminCount, revenue: `$${adminCount * 100}`, arpu: '$100', color: 'bg-blue-500', growth: '+12%' },
          { plan: 'Managers', customers: managerCount, revenue: `$${managerCount * 50}`, arpu: '$50', color: 'bg-green-500', growth: '+18%' },
          { plan: 'Standard Users', customers: userCount, revenue: `$${userCount * 10}`, arpu: '$10', color: 'bg-yellow-500', growth: '+5%' }
        ])

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isOwner])

  
  // Show loading while user is being fetched
  if (isLoadingUser) {
    return <div className="flex items-center justify-center h-full"><p className="text-gray-500">Loading...</p></div>
  }

  // Role-specific dashboards
  if (roleComponent) return roleComponent
  if (isCustomer && !roleComponent) return <CustomerDashboard />


  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {/* Header - Fixed */}
      <div className='flex-shrink-0'>
        <h1 className="!text-3xl py-1 font-bold text-gray-900">E-VISITORS Dashboard</h1>
        <p className="text-gray-600">Monitor your E-Visitors SaaS platform performance and revenue</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : (
          <>
        {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {primaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-5">
              <div className="flex items-center justify-centre gap-3 mb-3">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="text-white" />
                </div>
              <p className="text-medium font-bold text-gray-600 my-4 text-start">{stat.title}</p>
              </div>
              <div className='flex justify-between'>
              <p className="text-2xl font-bold text-gray-900">{typeof stat.value === 'number' ? stat.value : stat.value}</p>
               <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="text-green-500" size={12} />
                  ) : (
                    <FaArrowDown className="text-red-500" size={12} />
                  )}
                  <span className={`text-lg mt-2 font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
            </div>
            </div>
          )
        })}
      </div>

      {/* Critical Business Alerts */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaExclamationTriangle className="text-orange-500" size={18} />
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {criticalAlerts.map((alert) => (
            <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
              alert.severity === 'high' ? 'bg-red-50 border-red-500' : alert.severity === 'success' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
            }`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <span className="text-sm text-gray-700 flex-1">{alert.message}</span>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Categories</h2>
          <div className="space-y-3">
            {revenueBreakdown.map((plan, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${plan.color}`}></div>
                    <p className="font-medium text-gray-900 text-sm">{plan.plan}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                      {plan.growth}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{plan.revenue}</p>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{plan.customers} users</span>
                  <span>Value: {plan.arpu}/user</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.role} • {customer.signupDate}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {customer.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            onClick={()=>navigate("/dashboard/customers")}
            >
              <FaBuilding className="text-blue-600" size={18} />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Customer Management</p>
                <p className="text-xs text-gray-500">View all customers</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            onClick={()=>navigate("/dashboard/billings")}
            >
              <FaCreditCard className="text-green-600" size={18} />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Billing & Payments</p>
                <p className="text-xs text-gray-500">Manage subscriptions</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            onClick={()=>navigate("/dashboard/Analytics")}
            >
              <FaChartLine className="text-purple-600" size={18} />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Business Analytics</p>
                <p className="text-xs text-gray-500">Revenue & growth</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            onClick={()=>navigate("/dashboard/forms")}
            >
              <FaServer className="text-indigo-600" size={18} />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm"> Form Management</p>
                <p className="text-xs text-gray-500">Manage all forms</p>
              </div>
            </button>
          </div>
        </div>
      </div>

        {/* Recent Business Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {businessActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.color}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard