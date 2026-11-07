import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaUsers, FaUserShield, FaUserCheck, FaUserTimes, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaFilePdf, FaFileWord, FaPrint, FaBan, FaUserClock } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { AddUserModal, AddRoleModal } from '../../../components/modals'
import DeleteUserModal from '../../../components/modals/DeleteUserModal'
import SuspendModal from '../../../components/modals/SuspendModal'
import EditUserModal from '../../../components/modals/EditUserModal'
import ExportReportModal from '../../../components/modals/ExportReportModal'
import { usersApi, type User } from '../../../api/users'
import { rolesApi, type Role } from '../../../api/roles'

function Users() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userToDelete, setUserToDelete] = useState<{ id: string; fullName: string } | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  
  // API State
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    inactiveUsers: 0,
    pendingUsers: 0
  })

  // Get current role parameter
  const currentRole = searchParams.get('role') || 'owner'

  // Fetch users and roles on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch users
      const usersResponse = await usersApi.getAll()
      if (usersResponse.success && usersResponse.result) {
        setUsers(usersResponse.result)
        // Calculate stats
        const total = usersResponse.result.length
        const active = usersResponse.result.filter((u) => u.status?.toLowerCase() === 'active').length
        const admin = usersResponse.result.filter((u) => u.role === 'Admin').length
        const inactive = usersResponse.result.filter((u) => u.status?.toLowerCase() === 'inactive').length
        const pending = usersResponse.result.filter((u) => u.status?.toLowerCase() === 'pending').length
        
        setStats({
          totalUsers: total,
          activeUsers: active,
          adminUsers: admin,
          inactiveUsers: inactive,
          pendingUsers: pending
        })
      }

      // Fetch roles
      const rolesResponse = await rolesApi.getAll()
      if (rolesResponse.success && rolesResponse.result) {
        setRoles(rolesResponse.result)
      }
    } catch (err: any) {
      console.error('Error fetching data:', err)
      const msg = err?.response?.data?.message || err?.message || 'Failed to load users and roles'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (userData: any) => {
    try {
      const response = await usersApi.create(userData)
      if (response.success) {
        console.log('User added successfully:', response.result)
        setShowAddUserModal(false)
        fetchData() // Refresh the list
      }
    } catch (err) {
      console.error('Error adding user:', err)
      setError('Failed to add user')
    }
  }

  const handleEditUser = async (userData: any) => {
    try {
      if (selectedUser?.id) {
        const response = await usersApi.update(selectedUser.id, userData)
        if (response.success) {
          console.log('User updated successfully:', response.result)
          setShowEditModal(false)
          setSelectedUser(null)
          fetchData() // Refresh the list
        }
      }
    } catch (err) {
      console.error('Error updating user:', err)
      setError('Failed to update user')
    }
  }

  const handleSuspendUser = async (reason: string) => {
    try {
      if (selectedUser?.id) {
        const response = await usersApi.update(selectedUser.id, { status: 'Suspended' })
        if (response.success) {
          console.log('User suspended:', selectedUser?.fullName, 'Reason:', reason)
          setShowSuspendModal(false)
          setSelectedUser(null)
          fetchData() // Refresh the list
        }
      }
    } catch (err) {
      console.error('Error suspending user:', err)
      setError('Failed to suspend user')
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await usersApi.activate(userId)
      if (response.success) {
        fetchData()
      }
    } catch (err) {
      console.error('Error approving user:', err)
      setError('Failed to approve user')
    }
  }

  const handleAddRole = async (roleData: any) => {
    try {
      const response = await rolesApi.create(roleData)
      if (response.success) {
        console.log('Role added successfully:', response.result)
        setShowAddRoleModal(false)
        fetchData() // Refresh the list
      }
    } catch (err) {
      console.error('Error adding role:', err)
      setError('Failed to add role')
    }
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete({ id: user.id as string, fullName: user.fullName })
    setShowDeleteUserModal(true)
  }

  const confirmDeleteUser = async () => {
    if (userToDelete?.id) {
      try {
        const response = await usersApi.delete(userToDelete.id)
        if (response.success) {
          console.log('User deleted:', userToDelete)
          setShowDeleteUserModal(false)
          setUserToDelete(null)
          fetchData() // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting user:', err)
        setError('Failed to delete user')
      }
    }
  }

  const handleExport = (type: 'pdf' | 'word' | 'print') => {
    setExportFormat(type)
    setShowExportModal(true)
  }

  const handleGenerateReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { selectedFields, startDate, endDate, format })
  }

  const exportFields = [
    { id: 'fullName', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'department', label: 'Department' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Created Date' },
  ]

  const statsDisplay = [
    { title: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Active Users', value: stats.activeUsers, icon: FaUserCheck, color: 'bg-green-500' },
    { title: 'Admin Users', value: stats.adminUsers, icon: FaUserShield, color: 'bg-purple-500' },
    { title: 'Inactive Users', value: stats.inactiveUsers, icon: FaUserTimes, color: 'bg-red-500' },
    { title: 'Pending Approval', value: stats.pendingUsers, icon: FaUserClock, color: 'bg-yellow-500' }
  ]

  const permissions = [
    'View Dashboard',
    'Manage Users',
    'Manage Visitors',
    'View Reports',
    'System Settings',
    'Security Alerts',
    'Export Data',
    'Audit Logs'
  ]

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === 'all' || user.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesRole && matchesStatus
  })

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
        <h1 className="!text-3xl py-1 font-bold text-gray-900">Users & Roles</h1>
        <p className="text-gray-600">Manage system users, roles, and permissions</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => {
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
                  ? 'border-[#1A3263] text-[#1A3263]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Users Management
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'roles'
                  ? 'border-[#1A3263] text-[#1A3263]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Roles & Permissions
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
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
                <option value="suspended">Suspended</option>
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

              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#1A3263]/90 flex items-center gap-2"
              >
                <FaPlus size={14} />
                Add New User
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading users...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No users found</div>
              ) : (
                <table className="w-full">
                  <thead className='bg-[#1A3263]'>
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-white">User</th>
                      <th className="text-left py-3 px-4 font-medium text-white">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-white">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {user.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.fullName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{user.department || '-'}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                            user.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            user.status?.toLowerCase() === 'suspended' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status || 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 text-blue-600 hover:text-blue-900"
                              onClick={() => navigate(`/dashboard/users/${user.id}?role=${currentRole}`)}
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button 
                              className="p-2 text-green-600 hover:text-green-900"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowEditModal(true)
                              }}
                              title="Edit User"
                            >
                              <FaEdit size={18} />
                            </button>
                            {user.status?.toLowerCase() === 'pending' && (
                              <button
                                className="p-2 text-yellow-600 hover:text-yellow-800"
                                onClick={() => handleApproveUser(user.id)}
                                title="Approve User"
                              >
                                <FaUserCheck size={18} />
                              </button>
                            )}
                            <div className="relative">
                              <button 
                                className="p-2 text-gray-600 hover:text-gray-900"
                                onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id as string)}
                                title="More Actions"
                              >
                                <HiDotsVertical size={18} />
                              </button>
                              {openDropdownId === user.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setShowSuspendModal(true)
                                      setOpenDropdownId(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <FaBan size={14} className="text-orange-600" />
                                    Suspend User
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteUser(user)
                                      setOpenDropdownId(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-200"
                                  >
                                    <FaTrash size={14} className="text-red-600" />
                                    Delete User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
              <button
                onClick={() => setShowAddRoleModal(true)}
                className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#1A3263]/90 flex items-center gap-2"
              >
                <FaPlus size={14} />
                Add New Role
              </button>
            </div>

            {/* Roles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {loading ? (
                <div className="col-span-full text-center text-gray-500">Loading roles...</div>
              ) : roles.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No roles found</div>
              ) : (
                roles.map((role) => (
                  <div key={role.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{role.name}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEdit size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  </div>
                ))
              )}
            </div>

            {/* Permissions Matrix */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Permissions Matrix</h4>
              {loading ? (
                <div className="text-center text-gray-500">Loading permissions...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 font-medium text-gray-700">Permission</th>
                        {roles.map((role) => (
                          <th key={role.id} className="text-center py-2 px-4 font-medium text-gray-700">
                            {role.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((permission, permIndex) => (
                        <tr key={permIndex} className="border-t border-gray-200">
                          <td className="py-3 px-4 text-gray-700">{permission}</td>
                          {roles.map((role) => (
                            <td key={role.id} className="py-3 px-4 text-center">
                              {permIndex % 2 === 0 ? (
                                <FaToggleOn className="text-green-500 text-xl mx-auto cursor-pointer" />
                              ) : (
                                <FaToggleOff className="text-gray-300 text-xl mx-auto cursor-pointer" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />

      <AddRoleModal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        onSubmit={handleAddRole}
      />

      {selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onSubmit={handleEditUser}
          user={selectedUser}
        />
      )}

      <SuspendModal
        isOpen={showSuspendModal}
        onClose={() => {
          setShowSuspendModal(false)
          setSelectedUser(null)
        }}
        onConfirm={handleSuspendUser}
        userName={selectedUser?.fullName || ''}
      />

      <DeleteUserModal
        isOpen={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false)
          setUserToDelete(null)
        }}
        onConfirm={confirmDeleteUser}
        userName={userToDelete?.fullName || ''}
      />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Users Report"
      />
    </div>
  )
}

export default Users