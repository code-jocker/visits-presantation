import { useState } from 'react'
// import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaUserCheck, FaUsers, FaCalendarCheck, FaUserTimes, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaBuilding } from 'react-icons/fa'

function Hostmanagement() {
  // const navigate = useNavigate()
  // const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Get current role parameter
  // const currentRole = searchParams.get('role') || 'customer'

  const stats = [
    { title: 'Total Hosts', value: '48', icon: FaUserCheck, color: 'bg-blue-500' },
    { title: 'Active Hosts', value: '42', icon: FaUsers, color: 'bg-green-500' },
    { title: 'Pending Approvals', value: '6', icon: FaCalendarCheck, color: 'bg-yellow-500' },
    { title: 'Inactive Hosts', value: '6', icon: FaUserTimes, color: 'bg-red-500' }
  ]

  const hosts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Sales',
      position: 'Sales Manager',
      status: 'Active',
      totalVisitors: 24,
      pendingVisitors: 3,
      lastActivity: '2024-01-15 14:30',
      joinDate: '2023-03-15'
    },
    {
      id: 2,
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      phone: '+1 (555) 987-6543',
      department: 'HR',
      position: 'HR Specialist',
      status: 'Active',
      totalVisitors: 18,
      pendingVisitors: 1,
      lastActivity: '2024-01-15 11:20',
      joinDate: '2023-01-20'
    },
    {
      id: 3,
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Operations',
      position: 'Operations Lead',
      status: 'Active',
      totalVisitors: 31,
      pendingVisitors: 2,
      lastActivity: '2024-01-15 09:45',
      joinDate: '2022-11-10'
    },
    {
      id: 4,
      name: 'Tom Anderson',
      email: 'tom.anderson@company.com',
      phone: '+1 (555) 321-0987',
      department: 'IT',
      position: 'IT Support',
      status: 'Inactive',
      totalVisitors: 12,
      pendingVisitors: 0,
      lastActivity: '2024-01-10 16:15',
      joinDate: '2023-08-05'
    }
  ]

  const filteredHosts = hosts.filter(host => {
    const matchesSearch = host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || host.department.toLowerCase() === departmentFilter.toLowerCase()
    const matchesStatus = statusFilter === 'all' || host.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
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
        <h1 className="!text-3xl font-bold text-gray-900">Host Management</h1>
        <p className="text-gray-600">Manage employees who can host visitors</p>
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

        {/* Host Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hosts by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="hr">Human Resources</option>
                <option value="it">Information Technology</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <button className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#1A3263]/90 flex items-center gap-2">
                <FaPlus size={14} />
                Add Host
              </button>
            </div>
          </div>

          {/* Hosts Table */}
          <div className="overflow-x-auto  rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className='bg-[#1A3263]'>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-white">Host</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Position</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Total Visitors</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Pending</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Last Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHosts.map((host) => (
                  <tr key={host.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{host.name}</p>
                        <p className="text-sm text-gray-500">{host.email}</p>
                        <p className="text-sm text-gray-500">{host.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-400" size={14} />
                        <span className="text-gray-700">{host.department}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{host.position}</td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {host.totalVisitors}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {host.pendingVisitors > 0 ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                          {host.pendingVisitors}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(host.status)}`}>
                        {host.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700 text-sm">{host.lastActivity}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600" title="View Details">
                          <FaEye size={14} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600" title="Remove">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredHosts.length === 0 && (
            <div className="p-8 text-center">
              <FaUserCheck className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hosts found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hostmanagement;