import { useState } from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

interface AutoDeleteReportModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (retentionDays: number) => void
  currentRetentionDays?: number
}

export default function AutoDeleteReportModal({ isOpen, onClose, onConfirm, currentRetentionDays = 30 }: AutoDeleteReportModalProps) {
  const [retentionDays, setRetentionDays] = useState(currentRetentionDays)

  const handleConfirm = () => {
    onConfirm(retentionDays)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <FaExclamationTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Auto Delete Reports</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Automatically delete reports older than the selected retention period. This action cannot be undone.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Reports older than <span className="font-semibold text-gray-900">{retentionDays} days</span> will be permanently deleted.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Warning:</span> Deleting reports will also remove associated records from the database. This action cannot be reversed.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Reports
          </button>
        </div>
      </div>
    </div>
  )
}