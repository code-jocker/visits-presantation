import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaCalendarAlt, FaUsers, FaTools, FaClock, FaCheckCircle, FaExclamationCircle, FaEye, FaEdit, FaPlus } from 'react-icons/fa'

function Staff() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  
  const navigateWithRole = (path: string) => {
    navigate(roleParam ? `${path}?role=${roleParam}` : path)
  }

  const stats = [
    { title: 'Today\'s Appointments', value: '8', icon: FaCalendarAlt, color: 'bg-blue-500' },
    { title: 'Pending Meetings', value: '3', icon: FaClock, color: 'bg-yellow-500' },
    { title: 'Equipment Assigned', value: '12', icon: FaTools, color: 'bg-green-500' },
    { title: 'Completed Tasks', value: '24', icon: FaCheckCircle, color: 'bg-purple-500' }
  ]

  const upcomingAppointments = [
    { id: 1, title: 'Client Meeting', visitor: 'John Smith', time: '10:00 AM', status: 'Confirmed', location: 'Conference Room A' },
    { id: 2, title: 'Project Review', visitor: 'Alice Brown', time: '02:00 PM', status: 'Pending', location: 'Office 205' },
    { id: 3, title: 'Equipment Handover', visitor: 'Bob Wilson', time: '04:30 PM', status: 'Confirmed', location: 'Reception' }
  ]

  const assignedEquipment = [
    { id: 1, name: 'Laptop Dell XPS 15', code: 'EQ-001', status: 'In Use', assignedTo: 'John Doe', dueDate: '2024-02-15' },
    { id: 2, name: 'Projector Epson', code: 'EQ-045', status: 'Available', assignedTo: '-', dueDate: '-' },
    { id: 3, name: 'Conference Phone', code: 'EQ-023', status: 'Maintenance', assignedTo: '-', dueDate: '2024-01-20' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Use': return 'bg-blue-100 text-blue-800'
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Maintenance': return 'bg-red-100 text-red-800'
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

      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="!text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600">Manage your appointments, meetings, and equipment</p>
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
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <button 
                onClick={() => navigateWithRole('/dashboard/appointments')}
                className="text-[#1A3263] hover:text-[#1A3263]/80 text-sm font-medium flex items-center gap-1"
              >
                <FaPlus size={12} />
                New
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <FaUsers className="inline mr-1" size={12} />
                          {appointment.visitor}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <FaClock className="inline mr-1" size={12} />
                          {appointment.time} • {appointment.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <FaEye className="inline mr-1" size={12} />
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        <FaEdit className="inline mr-1" size={12} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Equipment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Assigned Equipment</h2>
              <button 
                onClick={() => navigateWithRole('/dashboard/equipments')}
                className="text-[#1A3263] hover:text-[#1A3263]/80 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {assignedEquipment.map((equipment) => (
                  <div key={equipment.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{equipment.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Code: {equipment.code}</p>
                        {equipment.assignedTo !== '-' && (
                          <p className="text-sm text-gray-500 mt-1">
                            Assigned to: {equipment.assignedTo}
                          </p>
                        )}
                        {equipment.dueDate !== '-' && (
                          <p className="text-sm text-gray-500">
                            Due: {equipment.dueDate}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                        {equipment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigateWithRole('/dashboard/appointments')}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <FaCalendarAlt className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-900">Appointments</p>
            </button>
            <button 
              onClick={() => navigateWithRole('/dashboard/visitors')}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <FaUsers className="mx-auto text-green-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-900">Visitors</p>
            </button>
            <button 
              onClick={() => navigateWithRole('/dashboard/equipments')}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <FaTools className="mx-auto text-purple-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-900">Equipment</p>
            </button>
            <button 
              onClick={() => navigateWithRole('/dashboard/reports')}
              className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
            >
              <FaExclamationCircle className="mx-auto text-orange-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-900">Reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Staff