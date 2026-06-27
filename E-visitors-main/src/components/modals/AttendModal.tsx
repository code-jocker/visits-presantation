import { useState } from 'react'
import { FaUser, FaFingerprint, FaIdCard, FaMicrophone, FaHandPaper, FaRunning, FaCamera, FaRedo, FaSave, FaTimes, FaSearch } from 'react-icons/fa'
import { MdQrCodeScanner, MdVisibility } from 'react-icons/md'

interface AttendModalProps {
  isOpen: boolean
  onClose: () => void
}

interface VerificationMode {
  id: string
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  hasData?: boolean
}

interface VisitorForm {
  mobile: string
  email: string
  fullName: string
  passType: string
  visitorCompany: string
  purpose: string
  badgeId: string
  whenToMeet: string
  date: string
  time: string
  department: string
  duration: string
  hostName: string
  profilePhoto: string
  idProofType: string
  idNumber: string
}

function AttendModal({ isOpen, onClose }: AttendModalProps) {
  const [selectedMode, setSelectedMode] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const [isFirstTime] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [visitorForm, setVisitorForm] = useState<VisitorForm>({
    mobile: '',
    email: '',
    fullName: '',
    passType: 'Visitor',
    visitorCompany: '',
    purpose: '',
    badgeId: '',
    whenToMeet: '',
    date: '',
    time: '',
    department: '',
    duration: '',
    hostName: '',
    profilePhoto: '',
    idProofType: 'National ID',
    idNumber: ''
  })

  const verificationModes: VerificationMode[] = [
    { id: 'face', name: 'Face', icon: FaUser, hasData: true },
    { id: 'fingerprint', name: 'Fingerprint', icon: FaFingerprint, hasData: false },
    { id: 'igipande', name: 'Igipande', icon: FaIdCard, hasData: true },
    { id: 'id-passport', name: 'ID/Passport', icon: FaIdCard, hasData: true },
    { id: 'voice', name: 'Voice', icon: FaMicrophone, hasData: false },
    { id: 'ocr', name: 'OCR', icon: MdQrCodeScanner, hasData: false },
    { id: 'gesture', name: 'Gesture', icon: FaHandPaper, hasData: false },
    { id: 'motion', name: 'Motion', icon: FaRunning, hasData: false },
    { id: 'pupil', name: 'Pupil', icon: MdVisibility, hasData: false }
  ]

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId)
    setIsScanning(true)
    
    setTimeout(() => {
      setIsScanning(false)
      setVisitorForm(prev => ({
        ...prev,
        fullName: 'John Doe',
        mobile: '+250788123456',
        email: 'john.doe@techsolutions.com',
        visitorCompany: 'Tech Solutions Ltd',
        idNumber: 'ID123456789'
      }))
    }, 2000)
  }

  const handleInputChange = (field: keyof VisitorForm, value: string) => {
    setVisitorForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setVisitorForm({
      mobile: '',
      email: '',
      fullName: '',
      passType: 'Visitor',
      visitorCompany: '',
      purpose: '',
      badgeId: '',
      whenToMeet: '',
      date: '',
      time: '',
      department: '',
      duration: '',
      hostName: '',
      profilePhoto: '',
      idProofType: 'National ID',
      idNumber: ''
    })
    setSelectedMode('')
    setIsScanning(false)
    onClose()
  }

  const handleSave = () => {
    console.log('Saving visitor:', visitorForm)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
          >
            <FaTimes size={24} />
          </button>

          <div className="p-6">
            {/* Verification Methods */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Select Verification Method</h2>
                <div className="relative w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search visitor by name..."
                    className="w-full pl-10 pr-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {verificationModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <div key={mode.id} className="space-y-2">
                      <button
                        onClick={() => handleModeSelect(mode.id)}
                        disabled={isScanning}
                        className={`w-full flex flex-col items-center p-1 rounded-lg border-2 transition-all hover:shadow-md ${
                          selectedMode === mode.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isScanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Icon 
                          size={18} 
                          className={`mb-2 ${
                            selectedMode === mode.id ? 'text-blue-600' : 'text-gray-600'
                          }`} 
                        />
                        <span className="text-sm font-medium text-gray-800">{mode.name}</span>
                      </button>
                      <div>
                        <input
                          type="text"
                          value={mode.hasData ? '••••••••' : ''}
                          readOnly
                          className="w-full text-center text-black px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                          placeholder="No data"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Scanning Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {isScanning ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-700">Scanning with {verificationModes.find(m => m.id === selectedMode)?.name}...</span>
                    </div>
                  ) : (
                    <span className="text-lg font-medium text-gray-800">
                      {isFirstTime ? '🆕 First Time Visitor' : '🔄 Returning Visitor'}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 flex gap-1 py-2 bg-[#1A3263] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaSave className='mt-1'/> Save Visitor
                  </button>
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={visitorForm.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={visitorForm.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+250 xxx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={visitorForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Type</label>
                    <select
                      value={visitorForm.passType}
                      onChange={(e) => handleInputChange('passType', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Visitor">Visitor</option>
                      <option value="Employee">Employee</option>
                      <option value="Contractor">Contractor</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Company</label>
                    <input
                      type="text"
                      value={visitorForm.visitorCompany}
                      onChange={(e) => handleInputChange('visitorCompany', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      value={visitorForm.purpose}
                      onChange={(e) => handleInputChange('purpose', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Reason for visiting"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Visit Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge ID</label>
                    <input
                      type="text"
                      value={visitorForm.badgeId}
                      onChange={(e) => handleInputChange('badgeId', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Badge ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Host Name</label>
                    <input
                      type="text"
                      value={visitorForm.hostName}
                      onChange={(e) => handleInputChange('hostName', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Person to meet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={visitorForm.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={visitorForm.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={visitorForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                      value={visitorForm.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Duration</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="Half day">Half day</option>
                      <option value="Full day">Full day</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Profile & ID Proof */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2 items-center justify-center w-full">
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FaCamera size={16} />
                    </button>
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      <FaRedo size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Profile Photo */}
                  <div className="text-center">
                    <div className="w-46 h-46 mx-auto rounded-lg bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                      {visitorForm.profilePhoto ? (
                        <img src={visitorForm.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser size={48} className="text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* ID Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Type</label>
                    <select
                      value={visitorForm.idProofType}
                      onChange={(e) => handleInputChange('idProofType', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="National ID">National ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Igipande">Igipande</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    <input
                      type="text"
                      value={visitorForm.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter ID number"
                    />
                  </div>

                  {/* ID Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Photo</label>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors">
                        <FaCamera size={24} className="mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Upload ID Photo</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AttendModal
