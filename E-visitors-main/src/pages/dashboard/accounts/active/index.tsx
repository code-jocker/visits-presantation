import { useState, useEffect } from 'react'
import { FaBuilding, FaUsers, FaCalendarAlt, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilePdf, FaFileWord, FaPrint } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AddCustomer from '../../../../components/modals/AddCustomer'
import ExportReportModal from '../../../../components/modals/ExportReportModal'
import { usersApi } from '../../../../api/users'

function ActiveCustomers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    usersApi.getAll({ take: 1000 })
      .then(res => setCustomers((res.result || []).filter((u: any) => u.status?.toLowerCase() === 'active')))
      .catch(() => setError('Failed to load active customers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    [c.fullName, c.email, c.company, c.department].filter(Boolean).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportFields = [
    { id: 'fullName', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'company', label: 'Company' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Join Date' },
  ]

  const handleExport = (format: 'pdf' | 'word' | 'print') => {
    setExportFormat(format)
    setShowExportModal(true)
  }

  const handleAddCustomer = (data: any) => {
    console.log('Adding customer:', data)
    setShowAddModal(false)
  }

  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />

      <div className="flex-shrink-0">
        <h1 className="!text-2xl font-bold text-gray-900">Active Customers</h1>
        <p className="text-gray-600">Manage your active customer accounts</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Customers', value: customers.length, icon: FaBuilding, color: 'bg-green-500' },
            { label: 'Active Trials', value: '—', icon: FaBuilding, color: 'bg-green-500' },
            { label: 'Active Users', value: customers.length, icon: FaUsers, color: 'bg-green-500' },
            { label: 'Avg. Subscription', value: '—', icon: FaCalendarAlt, color: 'bg-green-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${s.color}`}>
                <s.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search active customers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">
                <FaFilePdf size={16} /><span className="hidden sm:inline">PDF</span>
              </button>
              <button onClick={() => handleExport('word')} className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                <FaFileWord size={16} /><span className="hidden sm:inline">Word</span>
              </button>
              <button onClick={() => handleExport('print')} className="flex items-center gap-2 px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600">
                <FaPrint size={16} /><span className="hidden sm:inline">Print</span>
              </button>
            </div>
            <button onClick={() => setShowAddModal(true)} className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2">
              <FaPlus size={14} />Add New Customer
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {error && <div className="p-4 text-sm text-red-700 bg-red-50">{error}</div>}
          {loading && <div className="p-8 text-center text-gray-500">Loading...</div>}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#1A3263]">
                  <tr>
                    {['Name', 'Email', 'Company', 'Role', 'Join Date', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No active customers found.</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.company || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.role || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.createdAt?.slice(0, 10) || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => navigate(`/dashboard/customers/${c.id}`)} className="text-blue-600 hover:text-blue-900"><FaEye size={18} /></button>
                          <button className="text-green-600 hover:text-green-900"><FaEdit size={18} /></button>
                          <button className="text-red-600 hover:text-red-900"><FaTrash size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddCustomer isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddCustomer} />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => {}}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Active Customers Report"
      />
    </div>
  )
}

export default ActiveCustomers
