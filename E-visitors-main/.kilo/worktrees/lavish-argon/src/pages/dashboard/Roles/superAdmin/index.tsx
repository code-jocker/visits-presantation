import { FaUsers, FaChartLine, FaUserCheck, FaEye, FaArrowRight, FaArrowDown, FaCalendarAlt } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MapChart from '../../../../components/ui/MapChart'
import { FaListCheck } from 'react-icons/fa6'


function CustomerDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  
  const navigateWithRole = (path: string) => {
    navigate(roleParam ? `${path}?role=${roleParam}` : path)
  }
  const stats = [
    { title: 'Total Visitors', value: '1,234', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Today\'s Check-ins', value: '89', icon: FaArrowRight, color: 'bg-green-500' },
    { title: 'Today\'s Check-outs', value: '45', icon: FaArrowDown, color: 'bg-red-500'},
    { title: 'Appointments', value: '12', icon: FaUserCheck, color: 'bg-purple-500' }
  ]

  const recentVisitors = [
    { id: 1, name: 'John Smith', company: 'TechCorp', purpose: 'Business Meeting', time: '09:30 AM', status: 'Checked In', host: 'Sarah Johnson' },
    { id: 2, name: 'Alice Brown', company: 'StartupHub', purpose: 'Interview', time: '10:15 AM', status: 'Waiting', host: 'Mike Davis' },
    { id: 3, name: 'Bob Wilson', company: 'Global Inc', purpose: 'Consultation', time: '11:00 AM', status: 'Approved', host: 'Emma Wilson' },
    { id: 4, name: 'Carol Davis', company: 'Innovation Labs', purpose: 'Partnership', time: '02:30 PM', status: 'Checked Out', host: 'James Miller' }
  ]

  


 
  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      
      

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6  scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Stats Grid */}
        <h4 className=' !text-lg text-black font-bold'>Super Admin Dashboard</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-1">
                <div className="flex items-center justify-between">
                  <div className='gap-1'>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-1 rounded-lg`}>
                    <Icon className="text-white"  />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Layout: Map Chart (Left) and Quick Actions + Recent Activity (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitor Activity Map</h2>
           <MapChart/>
          </div>

          {/* Right: Quick Actions and Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" onClick={()=>navigateWithRole("/dashboard/appointments")}>
                  <FaCalendarAlt className="text-blue-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Appointments</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" onClick={()=>navigateWithRole("/dashboard/attendance")}>
                  <FaListCheck className="text-green-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Attendance</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors" onClick={()=>navigateWithRole("/dashboard/scanning")}>
                  <FaEye className="text-purple-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Scanning</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors" onClick={()=>navigateWithRole("/dashboard/reports")}>
                  <FaChartLine className="text-orange-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">View Reports</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentVisitors.slice(0, 3).map((visitor) => (
                  <div key={visitor.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{visitor.name}</p>
                    <p className="text-xs text-gray-500">{visitor.company}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{visitor.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        visitor.status === 'Checked In' ? 'bg-green-100 text-green-800' :
                        visitor.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {visitor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard