import { useState } from 'react'
import { FaInfo, FaLock, FaUsers, FaClipboardList, FaSearch, FaPlus, FaEdit, FaTrash, FaSave } from 'react-icons/fa'
import DeleteLogModal from '../../../components/modals/DeleteLogModal'

function Settings() {
  const [activeTab, setActiveTab] = useState('webinfo')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Web Info State
  const [webInfo, setWebInfo] = useState({
    systemName: 'E-Visitors Management System',
    systemDescription: 'Comprehensive visitor management platform for modern businesses',
    version: '2.1.0',
    supportEmail: 'support@e-visitors.com'
  })
  
  // Authentication State
  const [authData, setAuthData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // Roles Data
  const [roles] = useState([
    { id: 1, name: 'Super Admin', description: 'Full system access and control', permissions: 8, users: 2 },
    { id: 2, name: 'Admin', description: 'Administrative privileges with limited system access', permissions: 6, users: 5 },
    { id: 3, name: 'Manager', description: 'Department management and user oversight', permissions: 4, users: 12 },
    { id: 4, name: 'User', description: 'Basic user access for daily operations', permissions: 2, users: 45 }
  ])
  
  // System Logs Data
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, timestamp: '2024-01-20 14:30:25', user: 'admin@system.com', action: 'User Login', details: 'Successful login from IP 192.168.1.100', level: 'info' },
    { id: 2, timestamp: '2024-01-20 14:25:12', user: 'system', action: 'Database Backup', details: 'Automated backup completed successfully', level: 'info' },
    { id: 3, timestamp: '2024-01-20 14:20:45', user: 'manager@company.com', action: 'Role Updated', details: 'Modified permissions for User role', level: 'warning' },
    { id: 4, timestamp: '2024-01-20 14:15:33', user: 'system', action: 'Security Alert', details: 'Multiple failed login attempts detected', level: 'error' },
    { id: 5, timestamp: '2024-01-20 14:10:18', user: 'admin@system.com', action: 'System Settings', details: 'Updated system configuration', level: 'info' }
  ])
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, logId: 0, logAction: '' })
  
  const handleDeleteLog = (logId: number) => {
    setSystemLogs(systemLogs.filter(log => log.id !== logId))
    setDeleteModal({ isOpen: false, logId: 0, logAction: '' })
  }
  
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleSaveWebInfo = () => {
    console.log('Saving web info:', webInfo)
    alert('System information updated successfully!')
  }
  
  const handleChangePassword = () => {
    if (authData.newPassword !== authData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    console.log('Changing password')
    alert('Password changed successfully!')
    setAuthData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'info': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
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
      <div className='flex-shrink-0'>
        <h1 className="!text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 bg-[#1A3263]">
            <button
              onClick={() => setActiveTab('webinfo')}
              className={`py-4 px-1 border-b-3 font-medium  text-medium !font-bold ${
                activeTab === 'webinfo'
                  ? 'border-yellow-500 text-white'
                  : 'border-transparent text-gray-300  hover:text-gray-400'
              }`}
            >
              <FaInfo className="inline mr-2" />
              Web Info
            </button>
            <button
              onClick={() => setActiveTab('authentication')}
              className={`py-4 px-1 border-b-2 font-medium text-medium !font-bold ${
                activeTab === 'authentication'
                  ? 'border-yellow-500 text-white'
                  : 'border-transparent text-gray-300 hover:text-gray-400'
              }`}
            >
              <FaLock className="inline mr-2" />
              Authentication
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-4 font-medium text-medium !font-bold ${
                activeTab === 'roles'
                  ? 'border-yellow-500 text-white'
                  : 'border-transparent text-gray-300 hover:text-gray-400'
              }`}
            >
              <FaUsers className="inline mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-medium text-medium !font-bold ${
                activeTab === 'logs'
                  ? 'border-yellow-500 text-white'
                  : 'border-transparent text-gray-300 hover:text-gray-400'
              }`}
            >
              <FaClipboardList className="inline mr-2" />
              System Logs
            </button>
          </nav>
        </div>

        {/* Web Info Tab */}
        {activeTab === 'webinfo' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                <input
                  type="text"
                  value={webInfo.systemName}
                  onChange={(e) => setWebInfo({...webInfo, systemName: e.target.value})}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Description</label>
                <textarea
                  value={webInfo.systemDescription}
                  onChange={(e) => setWebInfo({...webInfo, systemDescription: e.target.value})}
                  rows={3}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={webInfo.version}
                  onChange={(e) => setWebInfo({...webInfo, version: e.target.value})}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={webInfo.supportEmail}
                  onChange={(e) => setWebInfo({...webInfo, supportEmail: e.target.value})}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSaveWebInfo}
                className="flex items-center gap-2 bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                <FaSave size={14} />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Authentication Tab */}
        {activeTab === 'authentication' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={authData.currentPassword}
                  onChange={(e) => setAuthData({...authData, currentPassword: e.target.value})}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={authData.newPassword}
                  onChange={(e) => setAuthData({...authData, newPassword: e.target.value})}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={authData.confirmPassword}
                  onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                <FaLock size={14} />
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
              <button className="flex items-center gap-2 bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                <FaPlus size={14} />
                Add New Role
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Permissions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Users</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{role.name}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{role.description}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {role.permissions} permissions
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{role.users} users</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800">
                            <FaEdit size={14} />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-800">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Logs Tab */}
        {activeTab === 'logs' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Activity Logs</h2>
            <div className="space-y-3">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{log.action}</span>
                      <span className="text-sm text-gray-500">by {log.user}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{log.details}</p>
                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, logId: log.id, logAction: log.action })}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete log"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        <DeleteLogModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, logId: 0, logAction: '' })}
          onConfirm={() => handleDeleteLog(deleteModal.logId)}
          logAction={deleteModal.logAction}
        />
      </div>
    </div>
  )
}
export default Settings;