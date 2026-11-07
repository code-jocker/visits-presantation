import { useState } from 'react'
// import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaCalendarAlt, FaCalendarCheck, FaClock, FaCalendarTimes, FaPlus, FaSearch, FaEdit, FaEye, FaUser, FaEllipsisV } from 'react-icons/fa'
import ScheduleAppointmentModal from '../../../components/modals/ScheduleAppointmentModal'

function AppointmentPage() {
  // const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const handleScheduleAppointment = (appointmentData: any) => {
    console.log('Scheduling appointment:', appointmentData)
    // Add appointment scheduling logic here
    setShowScheduleModal(false)
  }

  // Get current role parameter
  // const currentRole = searchParams.get('role') || 'customer'

  const stats = [
    { title: 'Total Appointments', value: '32', icon: FaCalendarAlt, color: 'bg-blue-500' },
    { title: 'Confirmed', value: '24', icon: FaCalendarCheck, color: 'bg-green-500' },
    { title: 'Pending', value: '6', icon: FaClock, color: 'bg-yellow-500' },
    { title: 'Cancelled', value: '2', icon: FaCalendarTimes, color: 'bg-red-500' }
  ]

  const appointments = [
    {
      id: 1,
      visitorName: 'John Smith',
      visitorEmail: 'john.smith@techcorp.com',
      visitorPhone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      purpose: 'Business Meeting',
      host: 'Sarah Johnson',
      department: 'Sales',
      date: '2024-01-15',
      time: '10:00',
      duration: '2 hours',
      status: 'Confirmed',
      location: 'Conference Room A',
      notes: 'Quarterly review meeting'
    }
  ]

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.host.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || appointment.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
      <div className="flex-shrink-0 mb-6">
        <h1 className="!text-3xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-gray-600">Schedule and manage visitor appointments</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Appointment Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments by visitor, company, or host..."
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
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#1A3263]/90 flex items-center gap-2"
              >
                <FaPlus size={14} />
                Schedule Appointment
              </button>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-hidden overflow-y-auto rounded-lg">
            <table className="w-full">
              <thead className='bg-[#1A3263]'>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-white">Visitor</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Purpose</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Host</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Date_and_Time</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.visitorName}</p>
                        <p className="text-sm text-gray-500">{appointment.visitorEmail}</p>
                        <p className="text-sm text-gray-500">{appointment.visitorPhone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{appointment.company}</td>
                    <td className="py-4 px-4 text-gray-700">{appointment.purpose}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" size={14} />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.host}</p>
                          <p className="text-sm text-gray-500">{appointment.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.date}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{appointment.duration}</td>
                    <td className="py-4 px-4 text-gray-700">{appointment.location}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === appointment.id ? null : appointment.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <FaEllipsisV size={14} />
                        </button>
                        {openDropdown === appointment.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => {
                                  console.log('View', appointment.id)
                                  setOpenDropdown(null)
                                }}
                              >
                                <FaEye size={14} className="text-blue-600" />
                                View Details
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => {
                                  console.log('Edit', appointment.id)
                                  setOpenDropdown(null)
                                }}
                              >
                                <FaEdit size={14} className="text-green-600" />
                                Edit
                              </button>
                              {appointment.status === 'Pending' && (
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={() => {
                                    console.log('Confirm', appointment.id)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <FaCalendarCheck size={14} className="text-green-600" />
                                  Confirm
                                </button>
                              )}
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => {
                                  console.log('Cancel', appointment.id)
                                  setOpenDropdown(null)
                                }}
                              >
                                <FaCalendarTimes size={14} className="text-red-600" />
                                Cancel
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <div className="p-8 text-center">
              <FaCalendarAlt className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleAppointment}
      />
    </div>
  )
}
export default AppointmentPage;