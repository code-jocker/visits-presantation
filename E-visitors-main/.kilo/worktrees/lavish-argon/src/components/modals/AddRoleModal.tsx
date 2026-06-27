import { useState } from 'react'

interface AddRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (roleData: any) => void
}

function AddRoleModal({ isOpen, onClose, onSubmit }: AddRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', description: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 border-2 border-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Role</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input
              type="text"
              value={formData.name}
              placeholder='e.g., Administrator'
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              placeholder='Brief description of the role'
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-[#1A3263]/90"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRoleModal