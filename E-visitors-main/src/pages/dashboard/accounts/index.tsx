import { useState } from 'react'
import { FaBuilding, FaUsers, FaCalendarAlt, FaEye, FaEdit, FaPlus, FaSearch, FaFilePdf, FaFileWord, FaPrint, FaBan } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AddCustomer from '../../../components/modals/AddCustomer'
import ExportReportModal from '../../../components/modals/ExportReportModal'
import { HiBuildingOffice2 } from 'react-icons/hi2'
import EditCustomer from '../../../components/modals/EditCustomer'
import SuspendCustomer from '../../../components/modals/SuspendCustomer'
// import DeleteCustomer  from '../../components/modals/DeleteCustomer'

function Customers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')

  const handleAddCustomer = (customerData: any) => {
    console.log('Adding customer:', customerData)
  }

  const handleEditCustomer = (customerData: any) => {
    console.log('Updating customer:', customerData)
    setShowEditModal(false)
    setSelectedCustomer(null)
  }


  const handleSuspendCustomer = (reason: string) => {
    console.log('Suspending customer:', selectedCustomer?.companyName, 'Reason:', reason)
    setShowSuspendModal(false)
    setSelectedCustomer(null)
  }

  const handleExport = (type: 'pdf' | 'word' | 'print') => {
    setExportFormat(type)
    setShowExportModal(true)
  }

  const handleGenerateReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { selectedFields, startDate, endDate, format })
    // Handle report generation logic here
  }

  // Define available fields for export
  const exportFields = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'contactPerson', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'plan', label: 'Subscription Plan' },
    { id: 'users', label: 'Total Users' },
    { id: 'Total Trial', label: 'Total Trial' },
    { id: 'status', label: 'Status' },
    { id: 'joinDate', label: 'Join Date' },
  ]



  // Mock customer data
  const customers = [
    {
      id: 1,
      companyName: 'TechCorp Solutions',
      contactPerson: 'John Smith',
      email: 'john@techcorp.com',
      Category: 'Enterprise',
      plan: "Paid",
      users: 45,
      Total_Trial: 900,
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      companyName: 'StartupHub Inc',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@startuphub.com',
      Category: 'Professional',
      plan: "Trial",
      users: 12,
      Total_Trial: 200,
      status: 'Inactive',
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      companyName: 'Global Enterprises',
      contactPerson: 'Mike Wilson',
      email: 'mike@global.com',
      Category: 'Basic',
      plan: "Pending",
      users: 8,
      Total_Trial: 82,
      status: 'Cancelled',
      joinDate: '2023-11-10'
    }
  ]

  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h1 className="!text-3xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">Manage your customer companies and subscriptions</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <FaBuilding className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <HiBuildingOffice2 className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trials</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500">
                <FaUsers className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total End Users</p>
                <p className="text-2xl font-bold text-gray-900">3,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-500">
                <FaCalendarAlt className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Export Options */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-100 transition-colors"
                title="Export as PDF"
              >
                <FaFilePdf size={16} />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={() => handleExport('word')}
                className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-100 transition-colors"
                title="Export as Word"
              >
                <FaFileWord size={16} />
                <span className="hidden sm:inline">Word</span>
              </button>
              <button
                onClick={() => handleExport('print')}
                className="flex items-center gap-2 px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                title="Print"
              >
                <FaPrint size={16} />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2"
            >
              <FaPlus size={14} />
              Add New Customer
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
                    Categoires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Plan
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.Category === 'Enterprise' ? 'bg-blue-100 text-blue-800' :
                          customer.Category === 'Professional' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {customer.Category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.users}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.Total_Trial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                          customer.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.plan === 'Paid' ? 'bg-green-100 text-green-800' :
                          customer.plan === 'Trial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {customer.plan}
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
                        <button className="text-green-600 hover:text-green-900" onClick={() => {
                          setSelectedCustomer(customer)
                          setShowEditModal(true)
                        }}>
                          <FaEdit size={18} />
                        </button>
                        {/* this is for susspend */}

                        <button onClick={() => {
                          setSelectedCustomer(customer)
                          setShowSuspendModal(true)
                        }}
                          className="text-red-600  hover:text-red-700 "
                        >
                          <FaBan size={18} />
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

      {/* Modals */}
      <AddCustomer
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCustomer}
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

        
      <SuspendCustomer
        isOpen={showSuspendModal}
        customerName={selectedCustomer?.companyName || ''}
        onClose={() => {
          setShowSuspendModal(false)
          setSelectedCustomer(null)
        }}
        onSubmit={handleSuspendCustomer}
      />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Customer Report"
      />
    </div>
  )
}

export default Customers