import { useState } from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

interface SuspendModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  userName: string
}

export default function SuspendModal({ isOpen, onClose, onConfirm, userName }: SuspendModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const suspendReasons = [
    'Violation of terms of service',
    'Suspicious activity detected',
    'Payment issues',
    'Security concerns',
    'Inappropriate behavior',
    'Other'
  ]

  const handleConfirm = () => {
    if (inputValue !== userName) {
      setError('Username does not match')
      return
    }
    
    const reason = selectedReason === 'Other' ? customReason : selectedReason
    if (!reason.trim()) return
    
    onConfirm(reason)
    handleClose()
  }

  const handleClose = () => {
    setSelectedReason('')
    setCustomReason('')
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
            <div className="bg-orange-100 p-2 rounded-full">
              <FaExclamationTriangle className="text-orange-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Suspend User</h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You are about to suspend <span className="font-semibold text-gray-900">{userName}</span>. 
            This will temporarily disable their account access.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for suspension:
            </label>
            <div className="space-y-2">
              {suspendReasons.map((reason) => (
                <label key={reason} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="suspendReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Please specify:
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom reason..."
                rows={3}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">
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
              className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
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
            disabled={!selectedReason || (selectedReason === 'Other' && !customReason.trim()) || !inputValue}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suspend User
          </button>
        </div>
      </div>
    </div>
  )
}