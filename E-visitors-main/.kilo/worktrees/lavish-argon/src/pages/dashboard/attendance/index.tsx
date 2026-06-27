import { useEffect, useMemo, useState } from 'react'
import { FaEdit, FaFilePdf, FaFileWord, FaPlus, FaPrint, FaSearch, FaTrash, FaUserCheck, FaUserClock, FaUserTimes, FaUsers } from 'react-icons/fa'
import AddVisitorModal from '../../../components/modals/AddVisitorModal'
import ExportReportModal from '../../../components/modals/ExportReportModal'
import { visitorApi, type Visitor, type VisitorCreateRequest, type VisitorUpdateRequest } from '../../../api/visitor'

function Attendance() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false)
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  const [filterType, setFilterType] = useState<'day' | 'time'>('day')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'print'>('pdf')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const departments = Array.from(new Set(visitors.map(v => v.department).filter(Boolean))) as string[]

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await visitorApi.getAll({ limit: 200 })
      setVisitors(response.result || [])
    } catch (err) {
      console.error('Error loading visitors:', err)
      setError('Failed to load visitors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchVisitors()
  }, [])

  const toEntryTime = (visitDate?: string, visitTime?: string) => {
    if (!visitDate) return undefined
    return new Date(`${visitDate}T${visitTime || '00:00'}`).toISOString()
  }

  const mapFormToPayload = (visitorData: any): VisitorCreateRequest | VisitorUpdateRequest => ({
    fullName: visitorData.name,
    email: visitorData.email || undefined,
    mobile: visitorData.phone || undefined,
    visitorCompany: visitorData.company || undefined,
    purpose: visitorData.purpose || undefined,
    hostName: visitorData.host || undefined,
    department: visitorData.department || undefined,
    idNumber: visitorData.notes || undefined,
    passType: 'Visitor',
    status: editingVisitor?.status || 'ACTIVE',
    entryTime: toEntryTime(visitorData.visitDate, visitorData.visitTime),
  })

  const handleSaveVisitor = async (visitorData: any) => {
    try {
      setSaving(true)
      setError(null)
      const payload = mapFormToPayload(visitorData)

      if (editingVisitor?.id) {
        await visitorApi.update(editingVisitor.id, payload)
      } else {
        await visitorApi.create(payload as VisitorCreateRequest)
      }

      setShowAddVisitorModal(false)
      setEditingVisitor(null)
      await fetchVisitors()
    } catch (err) {
      console.error('Error saving visitor:', err)
      setError('Failed to save visitor')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteVisitor = async (visitorId: string | number) => {
    if (!window.confirm('Delete this visitor?')) return

    try {
      setSaving(true)
      setError(null)
      await visitorApi.delete(visitorId)
      await fetchVisitors()
    } catch (err) {
      console.error('Error deleting visitor:', err)
      setError('Failed to delete visitor')
    } finally {
      setSaving(false)
    }
  }

  const handleCheckOut = async (visitor: Visitor) => {
    if (!visitor.id) return

    try {
      setSaving(true)
      setError(null)
      await visitorApi.checkOut({ visitorId: visitor.id })
      await fetchVisitors()
    } catch (err) {
      console.error('Error checking out visitor:', err)
      setError('Failed to check out visitor')
    } finally {
      setSaving(false)
    }
  }

  const handleMarkCheckedIn = async (visitor: Visitor) => {
    if (!visitor.id) return

    try {
      setSaving(true)
      setError(null)
      await visitorApi.update(visitor.id, { status: 'CHECKED_IN', entryTime: new Date().toISOString(), exitTime: null })
      await fetchVisitors()
    } catch (err) {
      console.error('Error checking in visitor:', err)
      setError('Failed to check in visitor')
    } finally {
      setSaving(false)
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
    { id: 'name', label: 'Visitor Name' },
    { id: 'email', label: 'Email' },
    { id: 'company', label: 'Company' },
    { id: 'purpose', label: 'Purpose' },
    { id: 'host', label: 'Host' },
    { id: 'department', label: 'Department' },
    { id: 'checkIn', label: 'Check In Time' },
    { id: 'checkOut', label: 'Check Out Time' },
    { id: 'status', label: 'Status' },
    { id: 'badge', label: 'Badge ID' },
  ]

  const filteredVisitors = useMemo(() => {
    return visitors.filter(visitor => {
      const haystack = [
        visitor.fullName,
        visitor.visitorCompany,
        visitor.hostName,
        visitor.mobile,
        visitor.email,
        visitor.badgeId,
      ].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = haystack.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || visitor.status?.toLowerCase() === statusFilter
      const matchesDepartment = !filterDepartment || visitor.department === filterDepartment

      let matchesDateTime = true
      if (startDateTime && endDateTime) {
        const sourceValue = filterType === 'day'
          ? (visitor.entryTime || visitor.createdAt || '').slice(0, 10)
          : visitor.entryTime ? new Date(visitor.entryTime).toTimeString().slice(0, 5) : ''
        matchesDateTime = !!sourceValue && sourceValue >= startDateTime && sourceValue <= endDateTime
      }

      return matchesSearch && matchesStatus && matchesDepartment && matchesDateTime
    })
  }, [endDateTime, filterDepartment, filterType, searchTerm, startDateTime, statusFilter, visitors])

  const stats = [
    { title: 'Total Visitors', value: visitors.length, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Checked In', value: visitors.filter(v => v.status === 'CHECKED_IN' || v.status === 'IN').length, icon: FaUserCheck, color: 'bg-green-500' },
    { title: 'Active', value: visitors.filter(v => v.status === 'ACTIVE').length, icon: FaUserClock, color: 'bg-yellow-500' },
    { title: 'Checked Out', value: visitors.filter(v => v.status === 'CHECKED_OUT' || v.status === 'OUT').length, icon: FaUserTimes, color: 'bg-gray-500' }
  ]

  const formatDateTime = (value?: string) => {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'CHECKED_IN':
      case 'IN':
        return 'bg-green-100 text-green-800'
      case 'CHECKED_OUT':
      case 'OUT':
        return 'bg-gray-100 text-gray-800'
      case 'ACTIVE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="!text-3xl font-bold text-gray-900">Visitor Management</h1>
            <p className="text-gray-600">Manage and track all visitors in real-time</p>
          </div>
          <button
            onClick={() => {
              setEditingVisitor(null)
              setShowAddVisitorModal(true)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A3263] px-4 py-2 text-white hover:bg-blue-800"
          >
            <FaPlus size={14} /> Add Visitor
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={18} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="checked_in">Checked In</option>
                <option value="active">Active</option>
                <option value="checked_out">Checked Out</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'day' | 'time')}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="day">Day</option>
                <option value="time">Time</option>
              </select>
              <input
                type={filterType === 'day' ? 'date' : 'time'}
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              />
              <input
                type={filterType === 'day' ? 'date' : 'time'}
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
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

          {error && <div className="m-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {loading && <div className="p-8 text-center text-gray-500">Loading visitors...</div>}

          {!loading && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[1080px]">
                <thead className="bg-[#1A3263]">
                  <tr className="border-b border-gray-200">
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
                          <p className="text-sm text-gray-500">{visitor.mobile || '-'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{visitor.visitorCompany || '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{visitor.purpose || '-'}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{visitor.hostName || '-'}</p>
                          <p className="text-sm text-gray-500">{visitor.department || '-'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{formatDateTime(visitor.entryTime)}</td>
                      <td className="py-4 px-4 text-gray-700">{formatDateTime(visitor.exitTime)}</td>
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
                          <button
                            onClick={() => {
                              setEditingVisitor(visitor)
                              setShowAddVisitorModal(true)
                            }}
                            className="p-2 text-gray-400 hover:text-green-600"
                            title="Edit"
                            disabled={saving}
                          >
                            <FaEdit size={14} />
                          </button>
                          {(visitor.status === 'CHECKED_IN' || visitor.status === 'IN') ? (
                            <button onClick={() => handleCheckOut(visitor)} className="p-2 text-gray-400 hover:text-red-600" title="Check Out" disabled={saving}>
                              <FaUserTimes size={14} />
                            </button>
                          ) : (
                            <button onClick={() => handleMarkCheckedIn(visitor)} className="p-2 text-gray-400 hover:text-green-600" title="Check In" disabled={saving}>
                              <FaUserCheck size={14} />
                            </button>
                          )}
                          {visitor.id && (
                            <button onClick={() => handleDeleteVisitor(visitor.id!)} className="p-2 text-gray-400 hover:text-red-600" title="Delete" disabled={saving}>
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredVisitors.length === 0 && (
            <div className="p-8 text-center">
              <FaUsers className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      <AddVisitorModal
        isOpen={showAddVisitorModal}
        onClose={() => {
          setShowAddVisitorModal(false)
          setEditingVisitor(null)
        }}
        onSubmit={handleSaveVisitor}
        initialData={editingVisitor}
        submitting={saving}
      />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleGenerateReport}
        fields={exportFields}
        exportFormat={exportFormat}
        title="Export Visitor Report"
      />
    </div>
  )
}

export default Attendance
