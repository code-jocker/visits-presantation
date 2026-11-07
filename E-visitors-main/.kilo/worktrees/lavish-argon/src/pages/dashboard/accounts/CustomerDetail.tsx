import { useState } from 'react'
import { FaPhone, FaBuilding, FaCalendarAlt, FaShieldAlt, FaClock, FaArrowLeft, FaSearch, FaPlus, FaTrash, FaUser, FaFingerprint, FaIdCard, FaMicrophone, FaHandPaper, FaRunning } from 'react-icons/fa'
import { MdQrCodeScanner, MdVisibility } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

function CustomerDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [searchTerm, setSearchTerm] = useState('')
  const [blacklistedUsers, setBlacklistedUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', reason: 'Security violation', dateAdded: '2024-01-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', reason: 'Inappropriate behavior', dateAdded: '2024-01-08' }
  ])

  const [verificationTools, setVerificationTools] = useState([
    { id: 1, name: 'Face', description: 'Facial recognition verification', active: true, type: 'face', icon: FaUser },
    { id: 2, name: 'Fingerprint', description: 'Biometric fingerprint verification', active: true, type: 'fingerprint', icon: FaFingerprint },
    { id: 3, name: 'Igipande', description: 'Rwanda national ID card verification', active: false, type: 'igipande', icon: FaIdCard },
    { id: 4, name: 'ID/Passport', description: 'Government ID or passport verification', active: false, type: 'id-passport', icon: FaIdCard },
    { id: 5, name: 'Voice', description: 'Voice pattern recognition', active: false, type: 'voice', icon: FaMicrophone },
    { id: 6, name: 'OCR', description: 'Optical character recognition scanning', active: true, type: 'ocr', icon: MdQrCodeScanner },
    { id: 7, name: 'Gesture', description: 'Hand gesture recognition', active: false, type: 'gesture', icon: FaHandPaper },
    { id: 8, name: 'Motion', description: 'Motion detection verification', active: false, type: 'motion', icon: FaRunning },
    { id: 9, name: 'Pupil', description: 'Eye pupil recognition system', active: false, type: 'pupil', icon: MdVisibility }
  ])

  // Mock customer data
  const customer = {
    id: parseInt(id || '1'),
    companyName: 'TechCorp Solutions',
    contactPerson: 'John Smith',
    contactPersonPhone: '+1 (555) 987-6543',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Tech City, TC 12345',
    plan: 'Enterprise',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    users: 45,
    monthlyRevenue: 900,
    joinDate: '2023-06-15',
    lastActivity: '2024-01-15 14:30'
  }

  // Mock users for search
  const availableUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@techcorp.com', department: 'HR' },
    { id: 2, name: 'Bob Wilson', email: 'bob@techcorp.com', department: 'IT' },
    { id: 3, name: 'Carol Davis', email: 'carol@techcorp.com', department: 'Finance' },
    { id: 4, name: 'David Brown', email: 'david@techcorp.com', department: 'Marketing' }
  ]

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToBlacklist = (user: any) => {
    const reason = prompt('Enter reason for blacklisting:')
    if (reason) {
      setBlacklistedUsers([...blacklistedUsers, {
        id: Date.now(),
        name: user.name,
        email: user.email,
        reason,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setSearchTerm('')
    }
  }

  const handleRemoveFromBlacklist = (userId: number) => {
    setBlacklistedUsers(blacklistedUsers.filter(user => user.id !== userId))
  }

  const handleToggleVerificationTool = (toolId: number) => {
    setVerificationTools(tools => 
      tools.map(tool => 
        tool.id === toolId ? { ...tool, active: !tool.active } : tool
      )
    )
  }


  const visitHistory = [
    { id: 1, visitor: 'Alice Johnson', purpose: 'Business Meeting', date: '2024-01-15', time: '09:00', status: 'Completed' },
    { id: 2, visitor: 'Bob Wilson', purpose: 'Interview', date: '2024-01-14', time: '14:30', status: 'Completed' },
    { id: 3, visitor: 'Carol Davis', purpose: 'Consultation', date: '2024-01-12', time: '11:00', status: 'Completed' }
  ]

  const activityLog = [
    { id: 1, action: 'User login', timestamp: '2024-01-15 14:30', user: 'john@techcorp.com' },
    { id: 2, action: 'Visitor registered', timestamp: '2024-01-15 14:15', user: 'alice@techcorp.com' },
    { id: 3, action: 'Report generated', timestamp: '2024-01-15 13:45', user: 'bob@techcorp.com' }
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

      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-1">
          <button 
            onClick={() => navigate('/dashboard/customers')}
            className="p-2 text-gray-600 hover:text-[#1A3263] hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="!text-2xl font-bold text-gray-900">Customer Details</h1>
            <p className="text-gray-600">Complete customer information and management</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Customer Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <FaBuilding className="text-blue-600" size={48} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{customer.companyName}</h2>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
               <div className='bg-[#1A3263] text-white rounded-full px-4 py-1 text-sm font-medium]'>
                 <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {customer.status}
                  </span>
               </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium text-gray-900">{customer.contactPerson}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {customer.plan}
                    </span>
                  </div>
                </div>
                  <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Activity</p>
                    <p className="font-medium text-gray-900">{customer.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Users</p>
                    <p className="font-medium text-gray-900">{customer.users}</p>
                  </div>
                </div>
              
              
                  <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact person Phone</p>
                    <p className="font-medium text-gray-900">{customer.contactPersonPhone}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">{customer.joinDate}</p>
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
              {['profile', 'subscription', 'blacklist', 'visits', 'tools', 'activity'].map((tab) => (
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <p className="text-gray-900">{customer.companyName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                      <p className="text-gray-900">{customer.contactPerson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <p className="text-gray-900">{customer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <p className="text-gray-900">{customer.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <p className="text-gray-900">{customer.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                      <p className="text-gray-900">{customer.plan}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Users</label>
                      <p className="text-gray-900">{customer.users}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Revenue</label>
                      <p className="text-gray-900">${customer.monthlyRevenue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Plan</label>
                    <p className="text-gray-900">{customer.plan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {customer.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <p className="text-gray-900">{customer.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <p className="text-gray-900">{customer.endDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blacklist Tab */}
          {activeTab === 'blacklist' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Blacklist</h3>
              </div>
              
              {/* Search Users */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Add User to Blacklist</h4>
                <div className="relative mb-4">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users to blacklist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {searchTerm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Search Results:</h5>
                    {filteredUsers.length > 0 ? (
                      <div className="space-y-2">
                        {filteredUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email} • {user.department}</p>
                            </div>
                            <button
                              onClick={() => handleAddToBlacklist(user)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              <FaPlus size={12} className="inline mr-1" />
                              Blacklist
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No users found</p>
                    )}
                  </div>
                )}
              </div>

              {/* Blacklisted Users */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Blacklisted Users ({blacklistedUsers.length})</h4>
                {blacklistedUsers.length > 0 ? (
                  <div className="space-y-3">
                    {blacklistedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-red-600">Reason: {user.reason}</p>
                          <p className="text-xs text-gray-500">Added: {user.dateAdded}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromBlacklist(user.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Remove from blacklist"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No users blacklisted</p>
                )}
              </div>
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === 'visits' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit History</h3>
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
                    {visitHistory.map((visit) => (
                      <tr key={visit.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{visit.visitor}</td>
                        <td className="py-3 px-4 text-gray-700">{visit.purpose}</td>
                        <td className="py-3 px-4 text-gray-700">{visit.date}</td>
                        <td className="py-3 px-4 text-gray-700">{visit.time}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {visit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
  {/* Tools Activation Tab */}
          {activeTab === 'tools' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Verification Tools</h3>
                  <p className="text-sm text-gray-600">Manage verification methods available for visitor check-in</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verificationTools.map((tool) => (
                  <div key={tool.id} className={`border-2 rounded-lg p-4 transition-all ${
                    tool.active 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <tool.icon className={`text-xl ${tool.active ? 'text-green-600' : 'text-gray-400'}`} />
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tool.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tool.active ? 'Active' : 'Inactive'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tool.active}
                            onChange={() => handleToggleVerificationTool(tool.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                    
                    {tool.active && (
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Available for visitor verification
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <p className="text-sm text-blue-800">
                  Active tools will be available as verification options when visitors check in. 
                  Visitors can choose from any of the enabled verification methods during the scanning process.
                </p>
              </div>
            </div>
          )}
          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">by {activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        
        </div>
      </div>

   
    
    </div>
  )
}

export default CustomerDetail