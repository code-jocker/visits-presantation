import { FaFilePdf, FaFileWord, FaFileExcel, FaTimes } from 'react-icons/fa'
import Button from '../ui/Button'

type ReportFormat = 'excel' | 'word' | 'pdf'

interface ReportConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (format: ReportFormat) => void
  visitorCount: number
  threshold: number
}

export default function ReportConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  visitorCount,
  threshold,
}: ReportConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Generate Report</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Visitor threshold reached ({visitorCount}/{threshold}). Select format to generate report.
          Visitors will be deleted after report generation.
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => onConfirm('excel')}
            className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFileExcel className="text-green-600" size={24} />
            <span className="font-medium">Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => onConfirm('word')}
            className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFileWord className="text-blue-600" size={24} />
            <span className="font-medium">Word (.doc)</span>
          </button>
          <button
            onClick={() => onConfirm('pdf')}
            className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFilePdf className="text-red-600" size={24} />
            <span className="font-medium">PDF (.pdf)</span>
          </button>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}