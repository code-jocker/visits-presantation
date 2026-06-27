import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaSearch, FaEdit, FaTrash, FaEye, FaBan, FaFilePdf, FaFileWord, FaPrint } from 'react-icons/fa'
import ExportReportModal from '../../../../components/modals/ExportReportModal'

function BlacklistedUsers() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')

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
    { id: 'role', label: 'Role' },
    { id: 'department', label: 'Department' },
    { id: 'blacklistedDate', label: 'Blacklisted Date' },
    { id: 'reason', label: 'Reason' },
  ]

  const currentRole = searchParams.get('role') || 'owner'

  const blacklistedUsers = [
    {
      id: 4,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      name: 'Tom Wilson',
      email: 'tom.wilson@company.com',
      role: 'User',
      department: 'Sales',
      blacklistedDate: '2024-01-05',
      reason: 'Policy violation'
    }
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
      {/* Header - Fixed */}
      <div className='flex-shrink-0'>
        <div className="flex items-center gap-3 mb-2">
          <FaBan className="text-gray-600" size={32} />
          <h1 className="!text-3xl font-bold text-gray-900">Blacklisted Users</h1>
        </div>
        <p className="text-gray-600">Manage all blacklisted users in the system</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blacklisted users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
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

          <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className='bg-[#1A3263]'>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-white">User</th>
                <th className="text-left py-3 px-4 font-medium text-white">Role</th>
                <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                <th className="text-left py-3 px-4 font-medium text-white">Blacklisted Date</th>
                <th className="text-left py-3 px-4 font-medium text-white">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blacklistedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{user.department}</td>
                  <td className="py-4 px-4 text-gray-700">{user.blacklistedDate}</td>
                  <td className="py-4 px-4 text-gray-700">{user.reason}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-green-600 hover:text-blue-900"
                        onClick={() => navigate(`/dashboard/users/${user.id}?role=${currentRole}`)}
                      >
                        <FaEye size={18} />
                      </button>
                      <button className="p-2 text-green-600 hover:text-green-900">
                        <FaEdit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-900">
                        <FaTrash size={18} />
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
        title="Export Blacklisted Users Report"
      />
    </div>
  )
}

export default BlacklistedUsers
