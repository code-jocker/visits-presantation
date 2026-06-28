import { useState, useEffect } from 'react'
import { FaInfo, FaLock, FaUsers, FaClipboardList, FaSearch, FaPlus, FaEdit, FaTrash, FaSave, FaToggleOn, FaToggleOff, FaSpinner, FaFile, FaTrashAlt } from 'react-icons/fa'
import DeleteLogModal from '../../../components/modals/DeleteLogModal'
import { visitorApi } from '../../../api/visitor'
import { reportsApi } from '../../../api/reports'
import { toast } from 'react-toastify'

let featuresCache: { selfRegistrationEnabled: boolean; selfCheckoutEnabled: boolean } | null = null

function Settings() {
  const [activeTab, setActiveTab] = useState('webinfo')
  const [searchTerm, setSearchTerm] = useState('')

  const [selfRegistrationEnabled, setSelfRegistrationEnabled] = useState(true)
  const [selfCheckoutEnabled, setSelfCheckoutEnabled] = useState(true)
  const [featuresLoading, setFeaturesLoading] = useState(true)
  const [savingFeature, setSavingFeature] = useState<string | null>(null)

  const [retentionDays, setRetentionDays] = useState(30)
  const [savingRetention, setSavingRetention] = useState(false)

  useEffect(() => {
    if (featuresCache) {
      setSelfRegistrationEnabled(featuresCache.selfRegistrationEnabled)
      setSelfCheckoutEnabled(featuresCache.selfCheckoutEnabled)
      setFeaturesLoading(false)
      return
    }
    visitorApi.getSystemFeatures().then((res) => {
      if (res.success && res.result) {
        featuresCache = res.result
        setSelfRegistrationEnabled(res.result.selfRegistrationEnabled)
        setSelfCheckoutEnabled(res.result.selfCheckoutEnabled)
      }
    }).catch((err) => {
      console.error('[Features] Load error:', err)
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load system features')
    }).finally(() => {
      setFeaturesLoading(false)
    })

    reportsApi.getRetention().then((res) => {
      if (res.success) {
        setRetentionDays(res.result.retentionDays)
      }
    }).catch((err) => {
      console.error('[Retention] Load error:', err)
    })
  }, [])

  const handleToggleFeature = async (featureKey: 'self_registration' | 'self_checkout', currentValue: boolean) => {
    if (savingFeature) return
    const nextValue = !currentValue

    setSavingFeature(featureKey)
    if (featureKey === 'self_registration') {
      setSelfRegistrationEnabled(nextValue)
      if (featuresCache) featuresCache.selfRegistrationEnabled = nextValue
    } else {
      setSelfCheckoutEnabled(nextValue)
      if (featuresCache) featuresCache.selfCheckoutEnabled = nextValue
    }

    try {
      const res = await visitorApi.updateSystemFeature({ featureKey, isEnabled: nextValue })
      if (!res.success) {
        if (featureKey === 'self_registration') {
          setSelfRegistrationEnabled(currentValue)
          if (featuresCache) featuresCache.selfRegistrationEnabled = currentValue
        } else {
          setSelfCheckoutEnabled(currentValue)
          if (featuresCache) featuresCache.selfCheckoutEnabled = currentValue
        }
        toast.error(res.message || 'Failed to update feature')
      } else {
        toast.success(`${featureKey === 'self_registration' ? 'Self-registration' : 'Self-checkout'} ${nextValue ? 'enabled' : 'disabled'}`)
      }
    } catch (err: any) {
      if (featureKey === 'self_registration') {
        setSelfRegistrationEnabled(currentValue)
        if (featuresCache) featuresCache.selfRegistrationEnabled = currentValue
      } else {
        setSelfCheckoutEnabled(currentValue)
        if (featuresCache) featuresCache.selfCheckoutEnabled = currentValue
      }
      const status = err?.response?.status
      if (status === 401) {
        toast.error('Session expired. Please log in again.')
      } else if (status === 403) {
        toast.error('You do not have permission to change this setting. Permission: setting:update required.')
      } else {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to update feature')
      }
    } finally {
      setSavingFeature(null)
    }
  }

  const handleSaveRetention = async () => {
    if (savingRetention) return
    setSavingRetention(true)
    try {
      const res = await reportsApi.setRetention(retentionDays)
      if (res.success) {
        toast.success(`Report retention set to ${retentionDays} days`)
      } else {
        toast.error(res.message || 'Failed to save retention setting')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save retention setting')
    } finally {
      setSavingRetention(false)
    }
  }

  const [webInfo, setWebInfo] = useState({
    systemName: 'E-Visitors Management System',
    systemDescription: 'Comprehensive visitor management platform for modern businesses',
    version: '2.1.0',
    supportEmail: 'support@e-visitors.com'
  })

  const [authData, setAuthData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [roles] = useState([
    { id: 1, name: 'Super Admin', description: 'Full system access and control', permissions: 8, users: 2 },
    { id: 2, name: 'Admin', description: 'Administrative privileges with limited system access', permissions: 6, users: 5 },
    { id: 3, name: 'Manager', description: 'Department management and user oversight', permissions: 4, users: 12 },
    { id: 4, name: 'User', description: 'Basic user access for daily operations', permissions: 2, users: 45 }
  ])

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

  const tabs = [
    { id: 'webinfo', label: 'Web Info', icon: FaInfo },
    { id: 'authentication', label: 'Authentication', icon: FaLock },
    { id: 'roles', label: 'Roles', icon: FaUsers },
    { id: 'features', label: 'Features', icon: FaToggleOn },
    { id: 'reports', label: 'Reports', icon: FaFile },
    { id: 'logs', label: 'System Logs', icon: FaClipboardList },
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
        <h1 className="!text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 bg-[#1A3263]">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-4 px-1 border-b-3 font-medium text-medium !font-bold ${
                  activeTab === id
                    ? 'border-yellow-500 text-white'
                    : 'border-transparent text-gray-300 hover:text-gray-400'
                }`}
              >
                <Icon className="inline mr-2" />
                {label}
              </button>
            ))}
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

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Features</h2>
            <p className="text-gray-500 text-sm mb-6">Toggle self-service features for kiosk and public access.</p>
            {featuresLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <FaSpinner className="animate-spin" /> Loading features...
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">Self-Registration</h3>
                    <p className="text-sm text-gray-500">Allow visitors to register themselves at the kiosk without staff assistance.</p>
                  </div>
                  <button
                    onClick={() => handleToggleFeature('self_registration', selfRegistrationEnabled)}
                    disabled={savingFeature === 'self_registration'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selfRegistrationEnabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {savingFeature === 'self_registration' ? (
                      <FaSpinner className="animate-spin" size={14} />
                    ) : selfRegistrationEnabled ? (
                      <FaToggleOn size={14} />
                    ) : (
                      <FaToggleOff size={14} />
                    )}
                    {selfRegistrationEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">Self-Checkout</h3>
                    <p className="text-sm text-gray-500">Allow visitors to check out by scanning their QR code at the kiosk.</p>
                  </div>
                  <button
                    onClick={() => handleToggleFeature('self_checkout', selfCheckoutEnabled)}
                    disabled={savingFeature === 'self_checkout'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selfCheckoutEnabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {savingFeature === 'self_checkout' ? (
                      <FaSpinner className="animate-spin" size={14} />
                    ) : selfCheckoutEnabled ? (
                      <FaToggleOn size={14} />
                    ) : (
                      <FaToggleOff size={14} />
                    )}
                    {selfCheckoutEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Settings</h2>
            <p className="text-gray-500 text-sm mb-6">Configure automatic report retention and cleanup settings.</p>
            
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Auto-Delete Retention Period</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Set the default number of days to keep generated reports before automatic deletion.
                </p>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                    <select
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={7}>7 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={90}>90 Days</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      Reports older than <span className="font-semibold text-gray-900">{retentionDays} days</span> will be automatically deleted.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveRetention}
                    disabled={savingRetention}
                    className="flex items-center gap-2 bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {savingRetention ? (
                      <FaSpinner className="animate-spin" size={14} />
                    ) : (
                      <FaSave size={14} />
                    )}
                    Save
                  </button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaTrashAlt className="text-yellow-600 mt-0.5" size={16} />
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-1">Auto Delete Reports</h3>
                    <p className="text-sm text-yellow-800">
                      Use the "Auto Delete Report" button on the Reports page to immediately delete reports older than the configured retention period.
                    </p>
                  </div>
                </div>
              </div>
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