import { useState, useEffect } from 'react'
import { FaUsers, FaArrowRight, FaArrowDown, FaChartLine, FaEye, FaCalendarAlt, FaUserCheck, FaSync, FaSearch } from 'react-icons/fa'
import VisitorPieChart from '../../../../components/ui/VisitorPieChart'
import AttendModal from '../../../../components/modals/AttendModal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { visitorApi, type Visitor } from '../../../../api/visitor'



function HelpDeskDashboard() {
  const [showAttendModal, setShowAttendModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin')
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'day' | 'time'>('day')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [shouldFilter, setShouldFilter] = useState(false)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loadingVisitors, setLoadingVisitors] = useState(true)

  useEffect(() => {
    visitorApi.getAll({ limit: 500 })
      .then(res => setVisitors(res.result || []))
      .catch(() => {})
      .finally(() => setLoadingVisitors(false))
  }, [])

  const departments = Array.from(new Set(visitors.map(v => v.department).filter(Boolean))) as string[]

  const checkedIn = visitors.filter(v => v.status === 'CHECKED_IN' || v.status === 'IN')
  const checkedOut = visitors.filter(v => v.status === 'CHECKED_OUT' || v.status === 'OUT')

  const stats = {
    total: visitors.length,
    checkIn: checkedIn.length,
    checkOut: checkedOut.length,
  }

  const checkInVisitors = checkedIn.map(v => ({
    id: v.id,
    name: v.fullName,
    company: v.visitorCompany || '-',
    email: v.email || '-',
    phone: v.mobile || '-',
    purpose: v.purpose || '-',
    host: v.hostName || '-',
    department: v.department || '-',
    time: v.entryTime ? new Date(v.entryTime).toLocaleTimeString() : '-',
    date: v.entryTime ? v.entryTime.slice(0, 10) : '-',
    badge: v.badgeId || '-',
  }))

  const checkOutVisitors = checkedOut.map(v => ({
    id: v.id,
    name: v.fullName,
    company: v.visitorCompany || '-',
    email: v.email || '-',
    phone: v.mobile || '-',
    purpose: v.purpose || '-',
    host: v.hostName || '-',
    department: v.department || '-',
    time: v.exitTime ? new Date(v.exitTime).toLocaleTimeString() : '-',
    date: v.exitTime ? v.exitTime.slice(0, 10) : '-',
    badge: v.badgeId || '-',
  }))

  useEffect(() => {
    if (startDateTime && endDateTime) setShouldFilter(true)
    else if (!startDateTime && !endDateTime) setShouldFilter(false)
  }, [startDateTime, endDateTime])

  const currentVisitors = activeTab === 'checkin' ? checkInVisitors : checkOutVisitors
  const filteredVisitors = currentVisitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.host.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !filterDepartment || visitor.department === filterDepartment
    
    let matchesDateTime = true
    if (shouldFilter && startDateTime && endDateTime) {
      if (filterType === 'day') {
        matchesDateTime = visitor.date >= startDateTime && visitor.date <= endDateTime
      } else {
        matchesDateTime = visitor.time >= startDateTime && visitor.time <= endDateTime
      }
    }
    
    return matchesSearch && matchesDepartment && matchesDateTime
  })
  const navigate = useNavigate()

   const navigateWithRole = (path: string) => {
    navigate(roleParam ? `${path}?role=${roleParam}` : path)
  }
  

  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="time"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 1;
            filter: brightness(0) saturate(100%);
          }
        `
      }} />
      
      {/* Header - Fixed */}
      <div className='flex-shrink-0 flex items-center justify-between'>
        <div>
          <h1 className="!text-lg font-bold text-gray-900">Help Desk Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-[#1A3263] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="Refresh">
            <FaSync size={14} />
          </button>
        </div>
      </div>

      {/* Attend Button - Centered */}
      {/* <div className="flex justify-center mt-[-30px] ">
        <button 
          onClick={() => setShowAttendModal(true)}
          className="px-4 sm:px-8 py-2 sm:py-3 cursor-pointer bg-[#1A3263] text-white rounded-lg hover:bg-[#1A3263]/90 transition-colors flex items-center gap-2 text-lg font-bold"
        >
          Attend
          <img src={checkGif} alt="Attend" className="w-10 h-8" />
        </button>
      </div> */}

      {/* Attend Modal */}
      <AttendModal isOpen={showAttendModal} onClose={() => setShowAttendModal(false)} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-500 p-1 rounded-lg">
                <FaUsers className="text-white"  />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-lg font-bold text-green-600">{stats.checkIn}</p>
              </div>
              <div className="bg-green-500 p-1 rounded-lg">
                <FaArrowRight className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked Out</p>
                <p className="text-lg font-bold text-red-600">{stats.checkOut}</p>
              </div>
              <div className="bg-red-500 p-1 rounded-lg">
                <FaArrowDown className="text-white"  />
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: Chart (Left) and Quick Actions + Recent Activity (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitor Status Distribution</h2>
            <VisitorPieChart total={stats.total} checkIn={stats.checkIn} checkOut={stats.checkOut} />
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
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" onClick={()=>navigateWithRole("/dashboard/handover")}>
                  <FaUserCheck className="text-green-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Hand over</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors" onClick={()=>navigateWithRole("/dashboard/attendance")}>
                  <FaEye className="text-purple-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Attendance</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"onClick={()=>navigateWithRole("/dashboard/reports")}>
                  <FaChartLine className="text-orange-600" size={18} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Reports</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {currentVisitors.slice(0, 3).map((visitor) => (
                  <div key={visitor.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{visitor.name}</p>
                    <p className="text-xs text-gray-500">{visitor.company}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{visitor.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === 'checkin' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {activeTab === 'checkin' ? 'Checked In' : 'Checked Out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('checkin')}
                className={`pb-2 px-4 font-medium transition-colors ${
                  activeTab === 'checkin'
                    ? 'text-[#1A3263] border-b-2 border-[#1A3263]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Check In
              </button>
              <button
                onClick={() => setActiveTab('checkout')}
                className={`pb-2 px-4 font-medium transition-colors ${
                  activeTab === 'checkout'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Check Out
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search visitors, companies, or hosts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'day' | 'time')}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="day">Day</option>
                <option value="time">Time</option>
              </select>
              
              <input
                type={filterType === 'day' ? 'date' : 'time'}
                placeholder="Start"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              />
              
              <input
                type={filterType === 'day' ? 'date' : 'time'}
                placeholder="End"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              />
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loadingVisitors ? (
              <div className="p-8 text-center text-gray-500">Loading visitors...</div>
            ) : (
            <table className="min-w-full">
              <thead className='bg-[#1A3263]'>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Visitor</th>
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Purpose</th>
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Host</th>
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Badge</th>
                  <th className="text-left py-3 px-4 font-medium text-white whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{visitor.name}</p>
                        <p className="text-sm text-gray-500">{visitor.email}</p>
                        <p className="text-sm text-gray-500">{visitor.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{visitor.company}</td>
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{visitor.purpose}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{visitor.host}</p>
                        <p className="text-sm text-gray-500">{visitor.department}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{visitor.time}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {visitor.badge}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button className="p-2 text-gray-400 hover:text-blue-600" title="View Details">
                        <FaEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpDeskDashboard