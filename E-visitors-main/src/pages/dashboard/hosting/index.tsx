import { useEffect, useState } from 'react'
import {
  FaUserCheck, FaUsers, FaCalendarCheck, FaUserTimes,
  FaPlus, FaSearch, FaEdit, FaTrash, FaBuilding, FaTimes
} from 'react-icons/fa'
import { usersApi, type User, type UserCreateRequest } from '../../../api/users'

const DEPARTMENTS = ['ICT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing', 'Security']

const emptyForm: UserCreateRequest = {
  fullName: '',
  email: '',
  phoneNumber: '',
  department: '',
  role: 'host',
  scannedId: '',
  status: 'ACTIVE',
}

function Hostmanagement() {
  const [hosts, setHosts] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [editHost, setEditHost] = useState<User | null>(null)
  const [form, setForm] = useState<UserCreateRequest>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchHosts = () => {
    setLoading(true)
    usersApi.getAll({ take: 500 })
      .then((res) => setHosts(res.result || []))
      .catch(() => setHosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchHosts() }, [])

  const filtered = hosts.filter((h) => {
    const q = searchTerm.toLowerCase()
    const matchSearch = !q ||
      h.fullName?.toLowerCase().includes(q) ||
      h.email?.toLowerCase().includes(q) ||
      h.department?.toLowerCase().includes(q)
    const matchDept = departmentFilter === 'all' || h.department?.toLowerCase() === departmentFilter.toLowerCase()
    const matchStatus = statusFilter === 'all' || h.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchSearch && matchDept && matchStatus
  })

  const stats = [
    { title: 'Total Hosts', value: hosts.length, icon: FaUserCheck, color: 'bg-blue-500' },
    { title: 'Active Hosts', value: hosts.filter(h => h.status?.toLowerCase() === 'active').length, icon: FaUsers, color: 'bg-green-500' },
    { title: 'Pending', value: hosts.filter(h => h.status?.toLowerCase() === 'pending').length, icon: FaCalendarCheck, color: 'bg-yellow-500' },
    { title: 'Inactive Hosts', value: hosts.filter(h => h.status?.toLowerCase() === 'inactive').length, icon: FaUserTimes, color: 'bg-red-500' },
  ]

  const openAdd = () => {
    setEditHost(null)
    setForm(emptyForm)
    setFormError(null)
    setShowModal(true)
  }

  const openEdit = (host: User) => {
    setEditHost(host)
    setForm({
      fullName: host.fullName,
      email: host.email || '',
      phoneNumber: host.phoneNumber || '',
      department: host.department || '',
      role: host.role || 'host',
      scannedId: host.scannedId || '',
      status: host.status || 'ACTIVE',
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this host?')) return
    await usersApi.delete(id).catch(() => {})
    fetchHosts()
  }

  const handleSave = async () => {
    if (!form.fullName.trim()) { setFormError('Full name is required'); return }
    setSaving(true)
    setFormError(null)
    try {
      if (editHost) {
        await usersApi.update(editHost.id, {
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          department: form.department,
          role: form.role,
          status: form.status,
        })
      } else {
        await usersApi.create({ ...form, scannedId: form.scannedId || `HOST-${Date.now()}` })
      }
      setShowModal(false)
      fetchHosts()
    } catch (e: any) {
      setFormError(e?.response?.data?.message || e?.message || 'Failed to save host')
    } finally {
      setSaving(false)
    }
  }

  const statusColor = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="!text-3xl font-bold text-gray-900">Host Management</h1>
        <p className="text-gray-600">Manage employees who can host visitors</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6" style={{ scrollbarWidth: 'none' }}>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent outline-none"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={openAdd}
                className="bg-[#1A3263] text-white px-4 py-2 rounded-lg hover:bg-[#2C4A8B] flex items-center gap-2 whitespace-nowrap"
              >
                <FaPlus size={14} /> Add Host
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading hosts...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#1A3263]">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-white">Host</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((host) => (
                    <tr key={host.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{host.fullName}</p>
                        <p className="text-sm text-gray-500">{host.email || '—'}</p>
                        <p className="text-sm text-gray-500">{host.phoneNumber || '—'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-gray-400" size={14} />
                          <span className="text-gray-700">{host.department || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{host.role || '—'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(host.status)}`}>
                          {host.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700 text-sm">
                        {host.createdAt ? new Date(host.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(host)} className="p-2 text-gray-400 hover:text-green-600" title="Edit">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => handleDelete(host.id)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && filtered.length === 0 && (
              <div className="p-10 text-center">
                <FaUserCheck className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 font-medium">No hosts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#1A3263] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-base">{editHost ? 'Edit Host' : 'Add New Host'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-black focus:border-[#1A3263] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="john@company.com"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-black focus:border-[#1A3263] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                  placeholder="+250 7XX XXX XXX"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-black focus:border-[#1A3263] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-black focus:border-[#1A3263] outline-none"
                  >
                    <option value="">Select dept.</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-black focus:border-[#1A3263] outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {formError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#1A3263] text-white rounded-lg text-sm font-bold hover:bg-[#2C4A8B] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : editHost ? 'Save Changes' : 'Add Host'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Hostmanagement
