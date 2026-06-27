import { useState } from 'react'
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface ReportField {
  id: string
  label: string
  value: string
  type: 'text' | 'number' | 'date' | 'email' | 'textarea'
}

function CreateReport() {
  const navigate = useNavigate()
  const [reportTitle, setReportTitle] = useState('')
  const [reportType, setReportType] = useState('custom')
  const [fields, setFields] = useState<ReportField[]>([])
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'date' | 'email' | 'textarea'>('text')

  const addField = () => {
    if (!newFieldLabel.trim()) return
    
    const newField: ReportField = {
      id: Date.now().toString(),
      label: newFieldLabel,
      value: '',
      type: newFieldType
    }
    
    setFields([...fields, newField])
    setNewFieldLabel('')
    setNewFieldType('text')
  }

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
  }

  const updateFieldValue = (id: string, value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, value } : field
    ))
  }

  const handleSaveReport = () => {
    if (!reportTitle.trim()) {
      alert('Please enter a report title')
      return
    }

    const reportData = {
      title: reportTitle,
      type: reportType,
      fields: fields,
      createdAt: new Date().toISOString(),
      status: 'draft'
    }

    console.log('Saving report:', reportData)
    navigate('/dashboard/reports')
  }

  return (
    <div className="flex flex-col h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {/* Header - Fixed */}
      <div className='flex-shrink-0 flex justify-between items-center'>
        <div>
          <h1 className="!text-2xl font-bold text-gray-900">Create New Report</h1>
          <p className="text-gray-600 mt-1">Add custom fields to generate your report</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/reports')}
          className="text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={24} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 mt-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Report Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title *
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Enter report title"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="custom">Custom</option>
              <option value="attendance">Attendance</option>
              <option value="performance">Performance</option>
              <option value="financial">Financial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add New Field */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Add Report Fields</h2>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Enter field label (e.g., Employee Name, Department)"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addField()}
            />
          </div>
          
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value as any)}
            className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="email">Email</option>
            <option value="textarea">Textarea</option>
          </select>

          <button
            onClick={addField}
            className="bg-[#1A3263] text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <FaPlus size={14} />
            Add Field
          </button>
        </div>
      </div>

      {/* Report Fields */}
      {fields.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Report Fields ({fields.length})</h2>
          
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    <span className="ml-2 text-xs text-gray-500">({field.type})</span>
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => updateFieldValue(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      rows={3}
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => updateFieldValue(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
                
                <button
                  onClick={() => removeField(field.id)}
                  className="mt-8 text-red-600 hover:text-red-800 p-2"
                  title="Remove field"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FaPlus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
          <p className="text-gray-500">Add custom fields above to start building your report</p>
        </div>
      )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate('/dashboard/reports')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveReport}
            disabled={!reportTitle.trim()}
            className="bg-[#1A3263] text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <FaSave size={14} />
            Save Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateReport
