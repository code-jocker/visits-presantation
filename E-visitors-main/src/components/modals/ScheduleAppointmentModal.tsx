import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

interface ScheduleAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (appointmentData: any) => void
}

function ScheduleAppointmentModal({ isOpen, onClose, onSubmit }: ScheduleAppointmentModalProps) {
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    company: '',
    purpose: '',
    host: '',
    department: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '',
    location: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      visitorName: '',
      visitorEmail: '',
      visitorPhone: '',
      company: '',
      purpose: '',
      host: '',
      department: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: '',
      location: '',
      notes: ''
    })
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
          <div className="flex items-center justify-between flex-shrink-0 p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Schedule New Appointment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visitor Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Visitor Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visitor Name *
                  </label>
                  <input
                    type="text"
                    name="visitorName"
                    placeholder='Visitor name'
                    value={formData.visitorName}
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
                    name="visitorEmail"
                    placeholder='Visit Email'
                    value={formData.visitorEmail}
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
                    name="visitorPhone"
                    placeholder='Visitor Phone Number'
                    value={formData.visitorPhone}
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
                    placeholder='Company or Organization'   
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
                
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
                    <option value="Presentation">Presentation</option>
                    <option value="Training">Training</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host/Contact Person *
                  </label>
                  <select
                    name="host"
                    value={formData.host}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                  >
                    <option value="">Select Host</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Davis">Mike Davis</option>
                    <option value="Emily Chen">Emily Chen</option>
                    <option value="Tom Anderson">Tom Anderson</option>
                  </select>
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
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Time *
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      required
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                  >
                    <option value="">Select Duration</option>
                    <option value="0.5 hours">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                    <option value="4 hours">4 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                  >
                    <option value="">Select Location</option>
                    <option value="Conference Room A">Conference Room A</option>
                    <option value="Conference Room B">Conference Room B</option>
                    <option value="Meeting Room 1">Meeting Room 1</option>
                    <option value="Meeting Room 2">Meeting Room 2</option>
                    <option value="Presentation Hall">Presentation Hall</option>
                    <option value="HR Office">HR Office</option>
                    <option value="Reception">Reception</option>
                  </select>
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
                placeholder="Any additional information about the appointment..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-[#1A3263]/90"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ScheduleAppointmentModal