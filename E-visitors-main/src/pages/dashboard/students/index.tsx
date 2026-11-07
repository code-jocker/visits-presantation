import { useEffect, useState } from 'react'
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserGraduate } from 'react-icons/fa'
import { studentApi, classApi, type StudentItem, type StudentCreateRequest, type ClassItem } from '../../../api/visitor'

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<StudentItem | null>(null)
  const [form, setForm] = useState<StudentCreateRequest>({
    studentId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    admissionNumber: '',
    classId: '',
    status: 'active',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClasses()
    loadStudents()
  }, [])

  const loadClasses = async () => {
    try {
      const res = await classApi.getAll({ limit: 100, isActive: true })
      if (res.success) setClasses(res.result)
    } catch {
      // silently fail
    }
  }

  const loadStudents = async () => {
    setIsLoading(true)
    try {
      const res = await studentApi.getAll({
        limit: 100,
        search: search || undefined,
        classId: classFilter || undefined,
      })
      if (res.success) setStudents(res.result)
    } catch (e: any) {
      setError(e?.message || 'Failed to load students')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const openForm = (item?: StudentItem) => {
    setEditing(item || null)
    setForm({
      studentId: item?.studentId || '',
      fullName: item?.fullName || '',
      email: item?.email || '',
      phoneNumber: item?.phoneNumber || '',
      admissionNumber: item?.admissionNumber || '',
      classId: item?.classId || '',
      status: item?.status || 'active',
    })
    setShowForm(true)
    setError(null)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({
      studentId: '', fullName: '', email: '', phoneNumber: '',
      admissionNumber: '', classId: '', status: 'active',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      if (editing) {
        await studentApi.update(editing.id!, { ...form, classId: form.classId || undefined })
      } else {
        await studentApi.create(form)
      }
      closeForm()
      await loadStudents()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save student')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    setIsLoading(true)
    try {
      await studentApi.delete(id)
      await loadStudents()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete student')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaUserGraduate className="text-blue-600" /> Student Management
            </h1>
            <p className="text-sm text-gray-600">Manage student records, admission numbers, and class assignments</p>
          </div>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <FaPlus size={16} /> Add Student
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100 text-sm">{error}</div>
        )}

        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-lg relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, ID, or admission number..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black bg-white"
            />
          </div>
          <div className="relative">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black bg-white"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id || ''}>
                  {c.name} {c.level ? '(' + c.level + ')' : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Full Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Admission No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-medium">{s.studentId}</td>
                    <td className="px-4 py-3 text-gray-700">{s.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{s.className || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.admissionNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phoneNumber || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openForm(s)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline underline-offset-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id!)}
                        className="ml-3 text-red-600 hover:text-red-800 text-sm font-medium underline underline-offset-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTrash size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. STU001"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Kamau"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="student@school.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="e.g. 250788123456"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                <input
                  name="admissionNumber"
                  value={form.admissionNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. ADM001"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="classId"
                    value={form.classId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black bg-white"
                  >
                    <option value="">No class assigned</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id || ''}>
                        {c.name} {c.level ? '(' + c.level + ')' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
                >
                  {isLoading ? 'Saving...' : editing ? 'Update Student' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}