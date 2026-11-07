import { useState } from 'react'
import { FaFilePdf, FaFileCsv, FaFileExcel, FaTimes, FaCheck } from 'react-icons/fa'

type ReportFormat = 'excel' | 'pdf' | 'csv'

interface GenerateAutoReportModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (format: ReportFormat) => void
}

const predefinedFields = [
  { id: 'date', label: 'Date', description: 'Visit date from entry time' },
  { id: 'time', label: 'Time', description: 'Visit time from entry time' },
  { id: 'visitorName', label: 'Visitor Name', description: 'Full name of the visitor' },
  { id: 'contactInfo', label: 'Contact Info', description: 'Mobile number or email' },
  { id: 'purpose', label: 'Purpose of Visit', description: 'Reason for the visit' },
]

export default function GenerateAutoReportModal({ isOpen, onClose, onConfirm }: GenerateAutoReportModalProps) {
  const [format, setFormat] = useState<ReportFormat>('excel')

  const handleConfirm = () => {
    onConfirm(format)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Generate Auto Report</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Generate a visitor attendance report with predefined fields. Report will include all checked-in visitors for today.
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Predefined Report Fields</h3>
          <div className="space-y-2">
            {predefinedFields.map((field) => (
              <div key={field.id} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-4 h-4 rounded border border-green-500 bg-green-50 flex items-center justify-center">
                  <FaCheck className="w-2.5 h-2.5 text-green-600" />
                </div>
                <span className="font-medium">{field.label}</span>
                <span className="text-gray-500 text-xs">({field.description})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Select Format</h3>
          <div className="space-y-3">
            <button
              onClick={() => setFormat('excel')}
              className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                format === 'excel' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FaFileExcel className={format === 'excel' ? 'text-green-600' : 'text-gray-400'} size={24} />
              <span className="font-medium">Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => setFormat('pdf')}
              className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                format === 'pdf' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FaFilePdf className={format === 'pdf' ? 'text-red-600' : 'text-gray-400'} size={24} />
              <span className="font-medium">PDF (.pdf)</span>
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                format === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FaFileCsv className={format === 'csv' ? 'text-blue-600' : 'text-gray-400'} size={24} />
              <span className="font-medium">CSV (.csv)</span>
            </button>
          </div>
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
            className="flex-1 px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}