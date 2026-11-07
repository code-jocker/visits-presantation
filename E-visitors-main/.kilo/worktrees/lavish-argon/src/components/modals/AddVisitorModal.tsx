import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import type { Visitor } from '../../api/visitor'

interface AddVisitorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (visitorData: any) => Promise<void> | void
  initialData?: Visitor | null
  submitting?: boolean
}

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    host: '',
    department: '',
    visitDate: '',
    visitTime: '',
    expectedDuration: '',
    notes: ''
}

function AddVisitorModal({ isOpen, onClose, onSubmit, initialData, submitting = false }: AddVisitorModalProps) {
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (!isOpen) return

    setFormData(initialData ? {
      name: initialData.fullName || '',
      email: initialData.email || '',
      phone: initialData.mobile || '',
      company: initialData.visitorCompany || '',
      purpose: initialData.purpose || '',
      host: initialData.hostName || '',
      department: initialData.department || '',
      visitDate: initialData.entryTime ? String(initialData.entryTime).slice(0, 10) : '',
      visitTime: initialData.entryTime ? new Date(initialData.entryTime).toTimeString().slice(0, 5) : '',
      expectedDuration: '',
      notes: initialData.idNumber || '',
    } : emptyForm)
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh]">
        <style dangerouslySetInnerHTML={{
          __html: `
            .modal-content::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
        <div className="modal-content overflow-y-auto max-h-[90vh]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{initialData ? 'Edit Visitor' : 'Add New Visitor'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder='san teck'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder='go@gmail.com'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder='+25078000000000'
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder='e-visitors'
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
            </div>

            {/* Visit Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Visit Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose of Visit *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                >
                  <option value="">Select Purpose</option>
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host/Contact Person *
                </label>
                <input
                  type="text"
                  name="host"
                  placeholder='mubano'
                  value={formData.host}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="HR">Human Resources</option>
                  <option value="IT">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Reception">Reception</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    name="visitDate"
                    placeholder=''
                    value={formData.visitDate}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                    style={{ colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Time *
                  </label>
                  <input
                    type="time"
                    name="visitTime"
                    placeholder=''
                    value={formData.visitTime}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Duration (hours)
                </label>
                <input
                  type="number"
                  name="expectedDuration"
                  value={formData.expectedDuration}
                  onChange={handleChange}
                  placeholder='1120'
                  min="0.5"
                  max="8"
                  step="0.5"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              
              rows={3}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
              placeholder="Any additional information about the visit..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-[#1A3263]/90 disabled:opacity-60"
            >
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Visitor'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default AddVisitorModal
