import { useState } from 'react'

interface Equipment {
  type: string
  id: string
}

interface EquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  equipmentList: Equipment[]
  setEquipmentList: (list: Equipment[]) => void
}

function EquipmentModal({ isOpen, onClose, equipmentList, setEquipmentList }: EquipmentModalProps) {
  const [selectedType, setSelectedType] = useState('')
  const [equipmentId, setEquipmentId] = useState('')
  const [customType, setCustomType] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const availableEquipment = ['Laptop', 'Phone', 'Tablet', 'Camera', 'Car', 'Bike', 'Badge', 'Keys']

  if (!isOpen) return null

  const handleSelectType = (type: string) => {
    setSelectedType(type)
    setShowCustomInput(false)
    setCustomType('')
  }

  const handleAddCustom = () => {
    setShowCustomInput(true)
    setSelectedType('')
  }

  const handleAdd = () => {
    const type = showCustomInput ? customType : selectedType
    if (type.trim() && equipmentId.trim()) {
      if (editingIndex !== null) {
        const updated = [...equipmentList]
        updated[editingIndex] = { type: type.trim(), id: equipmentId.trim() }
        setEquipmentList(updated)
        setEditingIndex(null)
      } else {
        setEquipmentList([...equipmentList, { type: type.trim(), id: equipmentId.trim() }])
      }
      setSelectedType('')
      setCustomType('')
      setEquipmentId('')
      setShowCustomInput(false)
    }
  }

  const handleEdit = (index: number) => {
    const equipment = equipmentList[index]
    if (availableEquipment.includes(equipment.type)) {
      setSelectedType(equipment.type)
      setShowCustomInput(false)
    } else {
      setCustomType(equipment.type)
      setShowCustomInput(true)
    }
    setEquipmentId(equipment.id)
    setEditingIndex(index)
  }

  const handleRemove = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
      setSelectedType('')
      setCustomType('')
      setEquipmentId('')
      setShowCustomInput(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Visitor Equipment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Equipment:</h4>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {availableEquipment.map((type) => (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                className={`px-3 py-2 text-sm rounded border-2 transition-colors ${
                  selectedType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {showCustomInput ? (
            <div className="mb-3">
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Enter custom equipment type..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          ) : (
            <button
              onClick={handleAddCustom}
              className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Custom Equipment
            </button>
          )}

          {(selectedType || showCustomInput) && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                placeholder="Enter ID/Plate/Serial number..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAdd()
                }}
              />
              <button
                onClick={handleAdd}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                {editingIndex !== null ? 'Update Equipment' : 'Add Equipment'}
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Added Equipment:</h4>
          {equipmentList.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No equipment added yet</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {equipmentList.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{item.type}</div>
                    <div className="text-xs text-gray-600">ID: {item.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default EquipmentModal
