import React, { useState, useRef, useEffect } from 'react'
import { FaRegCircle, FaRegCheckSquare, FaCaretDown, FaCloudUploadAlt, FaStar, FaCalendarAlt, FaClock, FaTh, FaAlignLeft } from 'react-icons/fa'

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const options = [
    { label: 'Short answer', icon: <FaAlignLeft /> },
    { label: 'Paragraph', icon: <FaAlignLeft /> },
    { label: 'Multiple choice', icon: <FaRegCircle /> },
    { label: 'Checkboxes', icon: <FaRegCheckSquare /> },
    { label: 'Dropdown', icon: <FaCaretDown /> },
    { label: 'File upload', icon: <FaCloudUploadAlt /> },
    { label: 'Linear scale', icon: <FaTh /> },
    { label: 'Rating', icon: <FaStar /> },
    { label: 'Multiple choice grid', icon: <FaTh /> },
    { label: 'Checkbox grid', icon: <FaTh /> },
    { label: 'Date', icon: <FaCalendarAlt /> },
    { label: 'Time', icon: <FaClock /> },
  ]

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find(opt => opt.label.toLowerCase() === value?.toLowerCase())

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap text-sm"
      >
        <span className="flex items-center">
          {selectedOption && <span className="mr-2">{selectedOption.icon}</span>}
          {value || 'Select an option'}
        </span>
        <FaCaretDown />
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg mt-2 w-64 max-h-64 overflow-y-auto text-sm">
          {options.map((option) => (
            <div
              key={option.label}
              onClick={() => handleSelect(option.label)}
              className="flex text-black items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown