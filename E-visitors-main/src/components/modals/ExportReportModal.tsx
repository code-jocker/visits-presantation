import { useState } from 'react'
import { FaTimes, FaDownload } from 'react-icons/fa'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (selectedFields: string[], startDate: string, endDate: string, format: 'pdf' | 'word' | 'print') => void
  fields: { id: string; label: string }[]
  exportFormat: 'pdf' | 'word' | 'print'
  title?: string
}

function ExportReportModal({ 
  isOpen, 
  onClose, 
  onExport, 
  fields, 
  exportFormat,
  title = 'Export Report'
}: ExportReportModalProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.id))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleToggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleSelectAll = () => {
    setSelectedFields(fields.map(f => f.id))
  }

  const handleDeselectAll = () => {
    setSelectedFields([])
  }

  const handleExport = () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field')
      return
    }
    onExport(selectedFields, startDate, endDate, exportFormat)
    handleClose()
  }

  const handleClose = () => {
    setSelectedFields(fields.map(f => f.id))
    setStartDate('')
    setEndDate('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Export Format: <span className="font-medium text-[#1A3263]">{exportFormat.toUpperCase()}</span>
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 hide-scrollbar">
          {/* Date Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Date Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                Select Fields ({selectedFields.length}/{fields.length})
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border border-gray-200 rounded-lg p-4 hide-scrollbar" style={{ maxHeight: '16rem', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {fields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleToggleField(field.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedFields.length === 0}
              className="flex-1 px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              <FaDownload size={14} />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportReportModal
