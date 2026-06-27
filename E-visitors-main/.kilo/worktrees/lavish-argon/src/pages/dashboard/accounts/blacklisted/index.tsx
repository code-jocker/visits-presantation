import { useState, useEffect } from 'react'
import {
  FaUsers,
  FaDollarSign,
  FaEye,
  FaEdit,
  FaSearch,
  FaShieldAlt,
  FaBan,
  FaExclamationCircle,
  FaFilePdf,
  FaFileWord,
  FaPrint,
  FaUndo
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import ExportReportModal from '../../../../components/modals/ExportReportModal'
import EditCustomer from '../../../../components/modals/EditCustomer'
import { usersApi } from '../../../../api/users'

function BlacklistedCustomers() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [reasonFilter, setReasonFilter] = useState('all')

  const [showEditModal, setShowEditModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')

  const [customers, setCustomers] = useState<any[]>([])

  const [stats, setStats] = useState({
    blacklistedCount: 0,
    preventedLosses: '$0',
    blockedUsers: 0,
    securityIncidents: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch blacklisted customers from backend
  useEffect(() => {
    const fetchBlacklistedCustomers = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch users with blacklisted status
        // NOTE: send pagination params to match backend expectations
        const response = await usersApi.getAll({ skip: 0, take: 1000 })
        const allUsers = response.result || []

        // Filter blacklisted users
        const blacklistedUsers = allUsers.filter((user: any) => user?.status === 'Blacklisted')
        setCustomers(blacklistedUsers)

        // Calculate statistics
        const blacklistedCount = blacklistedUsers.length
        const blockedUsers = blacklistedUsers.reduce((sum: number, user: any) => sum + (user?.users || 0), 0)
        const preventedLosses = blacklistedUsers.reduce((sum: number, user: any) => sum + (user?.monthlyRevenue || 0), 0)

        setStats({
          blacklistedCount,
          preventedLosses: `$${preventedLosses.toLocaleString()}`,
          blockedUsers,
          securityIncidents: Math.max(blacklistedCount, 1)
        })
      } catch (err: any) {
        console.error('Error fetching blacklisted customers:', err?.response || err)
        setError('Failed to load blacklisted customers')
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlacklistedCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const companyName = String(customer?.companyName ?? '').toLowerCase()
    const contactPerson = String(customer?.contactPerson ?? '').toLowerCase()
    const email = String(customer?.email ?? '').toLowerCase()
    const reason = String(customer?.reason ?? '')

    const matchesSearch =
      companyName.includes(searchTerm.toLowerCase()) ||
      contactPerson.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())

    const matchesReason = reasonFilter === 'all' || reason === reasonFilter

    return matchesSearch && matchesReason
  })

  const exportFields = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'contactPerson', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'plan', label: 'Previous Plan' },
    { id: 'users', label: 'Users Affected' },
    { id: 'blacklistedDate', label: 'Blacklisted Date' },
    { id: 'reason', label: 'Blacklist Reason' },
    { id: 'joinDate', label: 'Join Date' }
  ]

  const handleExport = (format: 'pdf' | 'word' | 'print') => {
    setExportFormat(format)
    setShowExportModal(true)
  }

  const handleEditCustomer = (customerData: any) => {
    console.log('Updating customer:', customerData)
    setShowEditModal(false)
    setSelectedCustomer(null)
  }

  const handleExportReport = (
    selectedFields: string[],
    startDate: string,
    endDate: string,
    format: 'pdf' | 'word' | 'print'
  ) => {
    console.log('Generating report:', { format, fields: selectedFields, startDate, endDate })
  }

  return (
    <div className="flex flex-col h-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
        }}
      />

      {/* Header - Fixed */}
      <div className="flex-shrink-0">
        <h1 className="!text-2xl font-bold text-gray-900">Blacklisted Customers</h1>
        <p className="text-gray-600">Manage permanently blocked customer accounts</p>
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Alert Banner */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> These accounts are permanently blacklisted due to serious violations.
                Exercise extreme caution when reviewing.
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
        ) : null}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500">
                <FaBan className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blacklisted Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blacklistedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500">
                <FaDollarSign className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prevented Losses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.preventedLosses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500">
                <FaUsers className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blocked Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blockedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-500">
                <FaShieldAlt className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.securityIncidents}</p>
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
                placeholder="Search blacklisted customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Reasons</option>
              <option value="Fraudulent activity">Fraudulent Activity</option>
              <option value="System abuse">System Abuse</option>
              <option value="Terms violation">Terms Violation</option>
            </select>

            <button
              onClick={() => handleExport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaFilePdf size={14} />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={() => handleExport('word')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaFileWord size={14} />
              <span className="hidden sm:inline">Word</span>
            </button>

            <button
              onClick={() => handleExport('print')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Previous Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Users Affected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Blacklisted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <FaBan className="text-red-500" size={12} />
                          {customer?.companyName}
                        </div>
                        <div className="text-sm text-gray-500">{customer?.email}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer?.contactPerson}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer?.plan === 'Enterprise'
                            ? 'bg-blue-100 text-blue-800'
                            : customer?.plan === 'Professional'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {customer?.plan}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer?.users}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer?.blacklistedDate}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {customer?.reason}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>

                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setShowEditModal(true)
                          }}
                        >
                          <FaEdit size={18} />
                        </button>

                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Undo Blacklist"
                          onClick={() => window.alert('This is preparation , it will come soon.')}
                        >
                          <FaUndo size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaShieldAlt className="text-gray-600" size={16} />
            <h3 className="text-sm font-medium text-gray-900">Security Notice</h3>
          </div>
          <p className="text-xs text-gray-600">
            All blacklisted accounts are monitored for attempted access. Any suspicious activity is automatically logged and reported to
            security team.
          </p>
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

export default BlacklistedCustomers

