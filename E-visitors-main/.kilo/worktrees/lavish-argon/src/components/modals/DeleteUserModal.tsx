import { useState } from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
}

export default function DeleteUserModal({ isOpen, onClose, onConfirm, userName }: DeleteUserModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (inputValue !== userName) {
      setError('Username does not match')
      return
    }
    onConfirm()
    handleClose()
  }

  const handleClose = () => {
    setInputValue('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <FaExclamationTriangle className="text-red-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This action cannot be undone. This will permanently delete the user account and remove all associated data.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Please type <span className="font-semibold text-gray-900">{userName}</span> to confirm:
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError('')
            }}
            placeholder="Enter username"
            className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!inputValue}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  )
}
