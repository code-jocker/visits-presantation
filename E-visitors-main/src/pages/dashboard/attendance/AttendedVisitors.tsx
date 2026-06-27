import { useEffect, useState } from 'react'
import { FaUsers, FaUserCheck, FaUserTimes, FaSearch, FaEye, FaEdit, FaFilePdf, FaFileWord, FaPrint } from 'react-icons/fa'
import ExportReportModal from '../../../components/modals/ExportReportModal'
import { visitorApi, type Visitor } from '../../../api/visitor'

function AttendedVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await visitorApi.getAll({ limit: 500 })
        setVisitors(res.result || [])
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load visitors')
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const handleExport = (type: 'pdf' | 'word' | 'print') => {
    setExportFormat(type)
    setShowExportModal(true)
  }

  const handleGenerateReport = (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => {
    console.log('Generating report:', { selectedFields, startDate, endDate, format })
  }

  const exportFields = [
    { id: 'name', label: 'Visitor Name' },
    { id: 'email', label: 'Email' },
    { id: 'company', label: 'Company' },
    { id: 'purpose', label: 'Purpose' },
    { id: 'host', label: 'Host' },
    { id: 'checkIn', label: 'Check In Time' },
    { id: 'checkOut', label: 'Check Out Time' },
    { id: 'status', label: 'Status' },
    { id: 'badge', label: 'Badge ID' },
  ]

  const checkedIn = visitors.filter(v => v.status === 'CHECKED_IN' || v.status === 'IN')
  const checkedOut = visitors.filter(v => v.status === 'CHECKED_OUT' || v.status === 'OUT')

  const stats = [
    { title: 'Total Visitors Today', value: visitors.length, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Checked In', value: checkedIn.length, icon: FaUserCheck, color: 'bg-green-500' },
    { title: 'Checked Out', value: checkedOut.length, icon: FaUserTimes, color: 'bg-gray-500' },
  ]

  const filteredVisitors = visitors.filter(visitor => {
    const haystack = [visitor.fullName, visitor.visitorCompany, visitor.hostName, visitor.email]
      .filter(Boolean).join(' ').toLowerCase()
    const matchesSearch = haystack.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'checked_in' && (visitor.status === 'CHECKED_IN' || visitor.status === 'IN')) ||
      (statusFilter === 'checked_out' && (visitor.status === 'CHECKED_OUT' || visitor.status === 'OUT'))
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status?: string) => {
    return (status === 'CHECKED_IN' || status === 'IN') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-6">
        <h1 className="!text-3xl font-bold text-gray-900">Attended Visitors</h1>
        <p className="text-gray-600">Track visitor attendance in real-time</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
              </select>
              <div className="flex items-center gap-2">
                <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors" title="Export as PDF">
                  <FaFilePdf size={16} /><span className="hidden sm:inline">PDF</span>
                </button>
                <button onClick={() => handleExport('word')} className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors" title="Export as Word">
                  <FaFileWord size={16} /><span className="hidden sm:inline">Word</span>
                </button>
                <button onClick={() => handleExport('print')} className="flex items-center gap-2 px-3 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors" title="Print">
                  <FaPrint size={16} /><span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>
          </div>

          {error && <div className="m-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {loading && <div className="p-8 text-center text-gray-500">Loading visitors...</div>}

          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className='bg-[#1A3263]'>
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-white">Visitor</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Purpose</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Host</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Check In</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Check Out</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Badge</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitors.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{visitor.fullName}</p>
                          <p className="text-sm text-gray-500">{visitor.email || '-'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{visitor.visitorCompany || '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{visitor.purpose || '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{visitor.hostName || '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{visitor.entryTime ? new Date(visitor.entryTime).toLocaleTimeString() : '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{visitor.exitTime ? new Date(visitor.exitTime).toLocaleTimeString() : '-'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visitor.status)}`}>
                          {visitor.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {visitor.badgeId || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600" title="View Details">
                            <FaEye size={14} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600" title="Edit">
                            <FaEdit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredVisitors.length === 0 && (
                <div className="p-8 text-center text-gray-500">No visitors found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Attended Visitors Report"
      />
    </div>
  )
}

export default AttendedVisitors
