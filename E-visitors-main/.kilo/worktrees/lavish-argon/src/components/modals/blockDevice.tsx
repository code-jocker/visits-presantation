import { FaTimes, FaBan, FaExclamationTriangle } from 'react-icons/fa'

interface BlockDeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  deviceInfo: {
    ipAddress: string
    deviceInfo: string
    location: string
    threatType: string
    severity: string
  }
}

function BlockDeviceModal({ isOpen, onClose, onConfirm, deviceInfo }: BlockDeviceModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            Block Device
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to block this device? This action will prevent all future access attempts from this device.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">IP Address:</span>
                <span className="text-gray-900">{deviceInfo.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Device:</span>
                <span className="text-gray-900">{deviceInfo.deviceInfo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Location:</span>
                <span className="text-gray-900">{deviceInfo.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Threat Type:</span>
                <span className="text-red-600 font-medium">{deviceInfo.threatType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Severity:</span>
                <span className={`font-medium ${
                  deviceInfo.severity === 'Critical' ? 'text-red-600' :
                  deviceInfo.severity === 'High' ? 'text-orange-600' :
                  deviceInfo.severity === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {deviceInfo.severity}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. The device will be permanently blocked from accessing the system.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <FaBan size={16} />
            Block Device
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockDeviceModal