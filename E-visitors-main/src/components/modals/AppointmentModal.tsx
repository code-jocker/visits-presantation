interface AppointmentDetails {
  visitorName: string
  hostName: string
  hostStatus: 'in' | 'out' // in company or out of company
  hostAvailability: 'available' | 'not-available' // available in office or not available
  appointmentTime: string
  purpose: string
  department: string
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: AppointmentDetails | null
}

function AppointmentModal({ isOpen, onClose, appointment }: AppointmentModalProps) {
  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Visitor Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs text-blue-600 font-medium mb-1">Visitor</div>
            <div className="text-sm font-semibold text-gray-800">{appointment.visitorName}</div>
          </div>

          {/* Host Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 font-medium">Meeting With</div>
              <div className="flex gap-2">
                {/* In/Out Company Status */}
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                  appointment.hostStatus === 'in' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {appointment.hostStatus === 'in' ? 'In Company' : 'Out'}
                </span>
                {/* Office Availability - Only show if host is in company */}
                {appointment.hostStatus === 'in' && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    appointment.hostAvailability === 'available' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appointment.hostAvailability === 'available' ? 'In Office' : 'Not in Office'}
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-800">{appointment.hostName}</div>
            <div className="text-xs text-gray-600 mt-1">{appointment.department}</div>
          </div>

          {/* Appointment Time */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Scheduled Time:</span>
            <span className="font-medium text-gray-800">{appointment.appointmentTime}</span>
          </div>

          {/* Purpose */}
          <div>
            <div className="text-xs text-gray-600 font-medium mb-1">Purpose</div>
            <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-200">
              {appointment.purpose}
            </div>
          </div>

          {/* Status Summary */}
          <div className={`p-3 rounded-lg border ${
            appointment.hostStatus === 'in' && appointment.hostAvailability === 'available'
              ? 'bg-green-50 border-green-200'
              : appointment.hostStatus === 'out'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="text-sm font-medium">
              {appointment.hostStatus === 'in' && appointment.hostAvailability === 'available' ? (
                <span className="text-green-700">✓ Host is in the office and available to meet</span>
              ) : appointment.hostStatus === 'out' ? (
                <span className="text-red-700">✗ Host is out of the company</span>
              ) : (
                <span className="text-yellow-700">⚠ Host is in the company but not in the office</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Proceed to Check-in
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal
