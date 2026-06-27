import { useState, useEffect } from 'react'
import { FaBuilding, FaUsers, FaDollarSign, FaCalendarAlt, FaEye, FaEdit, FaSearch, FaExclamationTriangle, FaFilePdf, FaFileWord, FaPrint } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import ExportReportModal from '../../../../components/modals/ExportReportModal'
import { TbLockOpen2 } from 'react-icons/tb'
import EditCustomer from '../../../../components/modals/EditCustomer'
import { usersApi } from '../../../../api/users'

function SuspendedCustomers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')
const [customers, setCustomers] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSuspended: 0,
    lostRevenue: '$0',
    affectedUsers: 0,
    avgSuspensionDays: 0
  })

   useEffect(() => {
     const fetchSuspendedCustomers = async () => {
       try {
         // Fetch users with suspended status
         const response = await usersApi.getAll({ take: 1000 })
        const allUsers = response.result || []
        
        // Filter suspended users
        const suspendedUsers = allUsers.filter((user: any) => user.status === 'Suspended')
        setCustomers(suspendedUsers)

        // Calculate statistics
        const totalSuspended = suspendedUsers.length
        const affectedUsers = suspendedUsers.reduce((sum: number, user: any) => sum + (user.users || 0), 0)
        const lostRevenue = suspendedUsers.reduce((sum: number, user: any) => sum + (user.monthlyRevenue || 0), 0)
        
        let totalDays = 0
        suspendedUsers.forEach((user: any) => {
          if (user.suspendedDate) {
            const days = Math.floor((new Date().getTime() - new Date(user.suspendedDate).getTime()) / (1000 * 60 * 60 * 24))
            totalDays += days
          }
        })
        const avgSuspensionDays = totalSuspended > 0 ? Math.round(totalDays / totalSuspended) : 0

        setStats({
          totalSuspended,
          lostRevenue: `$${lostRevenue.toLocaleString()}`,
          affectedUsers,
          avgSuspensionDays
        })
} catch (err) {
         console.error('Error fetching suspended customers:', err)
         setCustomers([])
       }
     }

     fetchSuspendedCustomers()
   }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportFields = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'contactPerson', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'plan', label: 'Plan' },
    { id: 'users', label: 'Users' },
    { id: 'suspendedDate', label: 'Suspended Date' },
    { id: 'reason', label: 'Suspension Reason' },
    { id: 'joinDate', label: 'Join Date' }
  ]

  const handleExport = (format: 'pdf' | 'word' | 'print') => {
    setExportFormat(format)
    setShowExportModal(true)
  }

  const handleExportReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { format, fields: selectedFields, startDate, endDate })
  }

    const handleEditCustomer = (customerData: any) => {
    console.log('Updating customer:', customerData)
    setShowEditModal(false)
    setSelectedCustomer(null)
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
        <h1 className="!text-2xl font-bold text-gray-900">Suspended Customers</h1>
        <p className="text-gray-600">Manage customers with suspended accounts</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Alert Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                These accounts are temporarily suspended. Review each case carefully before taking action.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <FaBuilding className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suspended Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSuspended}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500">
                <FaDollarSign className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lost Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lostRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <FaUsers className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Affected Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.affectedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <FaCalendarAlt className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Suspension</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgSuspensionDays} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search suspended customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <button onClick={() => handleExport('pdf')} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
              <FaFilePdf size={14} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button onClick={() => handleExport('word')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <FaFileWord size={14} />
              <span className="hidden sm:inline">Word</span>
            </button>
            <button onClick={() => handleExport('print')} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
              <FaPrint size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>

          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1A3263]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Suspended Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.companyName}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.plan === 'Enterprise' ? 'bg-blue-100 text-blue-800' :
                          customer.plan === 'Professional' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {customer.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.users}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.suspendedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.reason === 'Payment overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {customer.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye size={18} />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Unsuspend" onClick={() => window.alert("Susspend is comming soon")}>
                          <TbLockOpen2 size={18} />
                        </button>
                        <button className="text-green-600 hover:text-green-900" onClick={() => {
                          setSelectedCustomer(customer)
                          setShowEditModal(true)
                        }}>
                          <FaEdit size={18} />
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
        onExport={handleExportReport}
        exportFormat={exportFormat}
        fields={exportFields}
      />

        <EditCustomer
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedCustomer(null)
        }}
        onSubmit={handleEditCustomer}
        customerData={selectedCustomer}
      />
    </div>
  )
}

export default SuspendedCustomers