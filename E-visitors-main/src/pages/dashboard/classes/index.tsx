import { useEffect, useState } from 'react'
import { FaPlus, FaSearch, FaTrash, FaSchool } from 'react-icons/fa'
import { classApi, type ClassItem, type ClassCreateRequest } from '../../../api/visitor'

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ClassItem | null>(null)
  const [form, setForm] = useState<ClassCreateRequest>({ name: '', description: '', level: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    setIsLoading(true)
    try {
      const res = await classApi.getAll({ limit: 100, search: search || undefined })
      if (res.success) setClasses(res.result)
    } catch (e: any) {
      setError(e?.message || 'Failed to load classes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const openForm = (item?: ClassItem) => {
    setEditing(item || null)
    setForm({ name: item?.name || '', description: item?.description || '', level: item?.level || '' })
    setShowForm(true)
    setError(null)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ name: '', description: '', level: '' })
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
        await classApi.update(editing.id!, { ...form, level: form.level || undefined })
      } else {
        await classApi.create(form)
      }
      closeForm()
      await loadClasses()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save class')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return
    setIsLoading(true)
    try {
      await classApi.delete(id)
      await loadClasses()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete class')
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
              <FaSchool className="text-blue-600" /> Class Management
            </h1>
            <p className="text-sm text-gray-600">Manage school classes, grades, and levels</p>
          </div>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <FaPlus size={16} /> Add Class
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100 text-sm">{error}</div>
        )}

        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-xl relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search classes..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black bg-white"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading classes...</div>
          ) : classes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No classes found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Class Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.level || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.description || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openForm(c)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline underline-offset-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id!)}
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
                {editing ? 'Edit Class' : 'Add New Class'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <input
                  name="level"
                  value={form.level}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior, Junior, Form 3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Third Form - Science Stream"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
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
                  {isLoading ? 'Saving...' : editing ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}