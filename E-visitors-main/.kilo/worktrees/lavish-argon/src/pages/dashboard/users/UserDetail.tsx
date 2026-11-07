import { useEffect, useState } from 'react'
import { FaPhone, FaBuilding, FaCalendarAlt, FaShieldAlt, FaClock, FaEye, FaCheck, FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usersApi, type UserWithDetails } from '../../../api/users'

function UserDetails() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<UserWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentRole = searchParams.get('role') || 'owner'
  const userId = searchParams.get('id') || ''

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await usersApi.getById(userId)
        setUser(res.result as UserWithDetails)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [userId])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading user...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!user) return <div className="p-8 text-center text-gray-500">User not found.</div>

  const visitHistory: any[] = user.visitHistory || []
  const activityLog: any[] = user.activityLog || []

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
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-1">
          <button 
            onClick={() => navigate(`/dashboard/users?role=${currentRole}`)}
            className="p-2 text-gray-600 hover:text-[#1A3263] hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="!text-3xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Complete user information and activity</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200 text-3xl font-bold text-gray-500">
                  {user.fullName?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phoneNumber || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{user.company || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {user.role || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{user.department || '-'}</p>
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-3">
                    <FaClock className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium text-gray-900">{user.lastLogin}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">{user.createdAt?.slice(0, 10) || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['profile', 'permissions', 'visits', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                      ? 'border-[#1A3263] text-[#1A3263]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900">{user.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <p className="text-gray-900">{user.email || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <p className="text-gray-900">{user.phoneNumber || '-'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <p className="text-gray-900">{user.company || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <p className="text-gray-900">{user.department || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <p className="text-gray-900">{user.role || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Permissions</h3>
              {user.permissions && user.permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaCheck className="text-green-500" size={16} />
                      <span className="text-gray-900">{permission}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No permissions data available.</p>
              )}
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === 'visits' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Visits Managed</h3>
              {visitHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Visitor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitHistory.map((visit, i) => (
                        <tr key={visit.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">{visit.visitor}</td>
                          <td className="py-4 px-4 text-gray-700">{visit.purpose}</td>
                          <td className="py-4 px-4 text-gray-700">{visit.date}</td>
                          <td className="py-4 px-4 text-gray-700">{visit.time}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {visit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No visit history available.</p>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
              {activityLog.length > 0 ? (
                <div className="space-y-4">
                  {activityLog.map((activity, i) => (
                    <div key={activity.id ?? i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FaEye className="text-blue-600" size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.timestamp}{activity.ip ? ` • IP: ${activity.ip}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No activity log available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetails
