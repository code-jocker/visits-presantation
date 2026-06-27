import { useState, useEffect } from 'react'
import { FaUsers, FaUserCheck, FaUserClock, FaSearch, FaEye, FaEdit, FaFilePdf, FaFileWord, FaPrint } from 'react-icons/fa'
import ExportReportModal from '../../../components/modals/ExportReportModal'

function AttendedUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterType, setFilterType] = useState<'day' | 'time'>('day')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [shouldFilter, setShouldFilter] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations', 'Finance']

  const handleExport = (type: 'pdf' | 'word' | 'print') => {
    setExportFormat(type)
    setShowExportModal(true)
  }

  const handleGenerateReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { selectedFields, startDate, endDate, format })
  }

  const exportFields = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'department', label: 'Department' },
    { id: 'checkIn', label: 'Check In Time' },
    { id: 'checkOut', label: 'Check Out Time' },
    { id: 'status', label: 'Status' },
    { id: 'badge', label: 'Badge ID' },
  ]

  useEffect(() => {
    if (startDateTime && endDateTime) {
      setShouldFilter(true)
    } else if (!startDateTime && !endDateTime) {
      setShouldFilter(false)
    }
  }, [startDateTime, endDateTime])

  const stats = [
    { title: 'Total Users Today', value: '45', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Checked In', value: '38', icon: FaUserCheck, color: 'bg-green-500' },
    { title: 'Checked Out', value: '7', icon: FaUserClock, color: 'bg-gray-500' }
  ]

  const attendedUsers = [
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', checkIn: '08:30', checkOut: null, date: '2024-01-15', status: 'Checked In', badge: 'U001' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', checkIn: '09:00', checkOut: '17:30', date: '2024-01-15', status: 'Checked Out', badge: 'U002' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', checkIn: '08:45', checkOut: null, date: '2024-01-16', status: 'Checked In', badge: 'U003' }
  ]

  const filteredUsers = attendedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase().replace(' ', '_') === statusFilter
    const matchesDepartment = !filterDepartment || user.department === filterDepartment
    
    let matchesDateTime = true
    if (shouldFilter && startDateTime && endDateTime) {
      if (filterType === 'day') {
        matchesDateTime = user.date >= startDateTime && user.date <= endDateTime
      } else {
        matchesDateTime = user.checkIn >= startDateTime && user.checkIn <= endDateTime
      }
    }
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDateTime
  })

  const getStatusColor = (status: string) => {
    return status === 'Checked In' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="time"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 1;
            filter: brightness(0) saturate(100%);
          }
        `
      }} />
      <div className="flex-shrink-0 mb-6">
        <h1 className="!text-3xl font-bold text-gray-900">Attended Users</h1>
        <p className="text-gray-600">Track employee attendance in real-time</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={18} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
              </select>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  title="Export as PDF"
                >
                  <FaFilePdf size={16} />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={() => handleExport('word')}
                  className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Export as Word"
                >
                  <FaFileWord size={16} />
                  <span className="hidden sm:inline">Word</span>
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="flex items-center gap-2 px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
                  title="Print"
                >
                  <FaPrint size={16} />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className='bg-[#1A3263]'>
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-white">User</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Check In</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Check Out</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Badge</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{user.department}</td>
                    <td className="py-4 px-4 text-gray-700">{user.checkIn}</td>
                    <td className="py-4 px-4 text-gray-700">{user.checkOut || '-'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {user.badge}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600" title="View Details">
                          <FaEye size={14} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600" title="Edit">
                          <FaEdit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Attended Users Report"
      />
    </div>
  )
}

export default AttendedUsers
