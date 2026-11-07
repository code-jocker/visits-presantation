import { useState } from 'react'
import { FaTimes, FaSearch } from 'react-icons/fa'

interface Role {
  id: string
  name: string
  description: string
}

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRoles: string[]
  onRoleToggle: (roleId: string) => void
}

function RoleSelectionModal({ isOpen, onClose, selectedRoles, onRoleToggle }: RoleSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock roles data
  const roles: Role[] = [
    { id: 'admin', name: 'Administrator', description: 'Full system access' },
    { id: 'manager', name: 'Manager', description: 'Department management' },
    { id: 'employee', name: 'Employee', description: 'Standard user access' },
    { id: 'visitor', name: 'Visitor', description: 'Limited guest access' },
    { id: 'security', name: 'Security', description: 'Security personnel' },
    { id: 'receptionist', name: 'Receptionist', description: 'Front desk staff' },
    { id: 'hr', name: 'HR Staff', description: 'Human resources' },
    { id: 'it', name: 'IT Support', description: 'Technical support' }
  ]

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Select Allowed Roles</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredRoles.map((role) => (
              <label key={role.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => onRoleToggle(role.id)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{role.name}</div>
                  <div className="text-sm text-gray-500">{role.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelectionModal