import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

interface DeleteLogModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  logAction: string
}

export default function DeleteLogModal({ isOpen, onClose, onConfirm, logAction }: DeleteLogModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <FaExclamationTriangle className="text-red-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Log</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this log entry?
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{logAction}</span>
          </p>
          <p className="text-sm text-red-600 mt-3">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
