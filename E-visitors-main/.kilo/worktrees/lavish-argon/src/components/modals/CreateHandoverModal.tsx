import { useState } from 'react'
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa'

interface HandoverItem {
  category: string
  description: string
  status: 'completed' | 'pending' | 'issue'
  notes?: string
}

interface CreateHandoverModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (handoverData: any) => void
}

function CreateHandoverModal({ isOpen, onClose, onSubmit }: CreateHandoverModalProps) {
  const [formData, setFormData] = useState({
    outgoingStaff: '',
    incomingStaff: '',
    shift: '',
    date: '',
    time: '',
    generalNotes: ''
  })

  const [items, setItems] = useState<HandoverItem[]>([
    { category: 'Security Check', description: '', status: 'pending' },
    { category: 'Equipment', description: '', status: 'pending' }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: keyof HandoverItem, value: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const addItem = () => {
    setItems(prev => [...prev, { category: '', description: '', status: 'pending' }])
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, items })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Create New Handover</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outgoing Staff *
                </label>
                <input
                  type="text"
                  name="outgoingStaff"
                  placeholder='ex. name of staff handing over'
                  value={formData.outgoingStaff}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incoming Staff *
                </label>
                <input
                  type="text"
                  name="incomingStaff"
                  placeholder='ex. name of staff receiving handover'
                  value={formData.incomingStaff}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                >
                  <option value="">Select shift</option>
                  <option value="Night to Day">Night to Day</option>
                  <option value="Day to Evening">Day to Evening</option>
                  <option value="Evening to Night">Evening to Night</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent [color-scheme:light]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent [color-scheme:light]"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Handover Items</h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <FaPlus size={12} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Category"
                          value={item.category}
                          onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.status}
                          onChange={(e) => handleItemChange(index, 'status', e.target.value)}
                          className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="issue">Issue</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Notes
              </label>
              <textarea
                name="generalNotes"
                value={formData.generalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                placeholder="Any additional notes or observations..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Create Handover
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateHandoverModal
