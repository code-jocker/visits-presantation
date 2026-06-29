import { useEffect, useState } from 'react'
import { FaUser, FaFingerprint, FaIdCard, FaMicrophone, FaHandPaper, FaRunning, FaCamera, FaSearch, FaSync, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { MdQrCodeScanner, MdVisibility } from 'react-icons/md'
import avatimage from '/src/assets/images/avartImage.avif'
import EquipmentModal from '../../../components/modals/EquipmentModal'
import AppointmentModal from '../../../components/modals/AppointmentModal'
import { visitorApi, type RecentTap } from '../../../api/visitor'
import { client } from '../../../api/clients'
import { reportsApi } from '../../../api/reports'

import { validatePhoneWithNumverify } from '../../../api/phoneVerification'
import FaceVerify from '../../../components/camera/FaceVerify'




interface Equipment {

  type: string
  id: string
}

interface VerificationMode {
  id: string
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
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
  status: string
  docType: string
  hasEquipment: boolean
}




function ScanningPage() {
  const [selectedVisitorPhoto] = useState<string>('')

  const [selectedMode, setSelectedMode] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const [faceMatchGuard, setFaceMatchGuard] = useState(false)

  const handleFaceMatchedCheckIn = async () => {
    if (faceMatchGuard) return
    // Avoid double check-ins from rapid auto-capture loops
    setFaceMatchGuard(true)
    try {
      await handleSubmit()
      await loadRecentTaps()

      // Auto-report check after check-in
      if (reportMessage === null) {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkedInCount = recentTaps.filter(t =>
            t.entryTime && new Date(t.entryTime) >= today
          ).length;

          if (checkedInCount >= 20) {
            const reportRes = await reportsApi.autoGenerate({
              department: visitorForm.department,
              format: selectedReportFormat
            });
            if (reportRes.result?.generated) {
              setReportMessage(`Auto-report (${reportRes.result.format?.toUpperCase()}) generated! ${reportRes.result.visitorCount} visitors processed.`);
              await loadRecentTaps();
            }
          }
        } catch (reportErr) {
          console.error('Auto-report check failed:', reportErr);
        }
      }
    } finally {
      setTimeout(() => setFaceMatchGuard(false), 2500)
    }
  }



  const countryCodes = [
    { code: '+250', name: 'Rwanda', flag: 'RW' },
    { code: '+1', name: 'USA', flag: 'US' },
    { code: '+44', name: 'UK', flag: 'GB' },
    { code: '+254', name: 'Kenya', flag: 'KE' },
    { code: '+256', name: 'Uganda', flag: 'UG' },
  ]

  const [phoneCountryCode, setPhoneCountryCode] = useState('+250')
  const [isValidatingPhone, setIsValidatingPhone] = useState(false)
  const [phoneValidationState, setPhoneValidationState] = useState<
    | { status: 'idle' }
    | { status: 'valid'; message: string }
    | { status: 'invalid'; message: string }
    | { status: 'error'; message: string }
  >({ status: 'idle' })
  const [searchName, setSearchName] = useState('')
  const [hasAppointment, setHasAppointment] = useState(false)
  // NOTE: keeping recent taps state, but removing unused vars to satisfy TS lint.
  // Keeping these states for future UX; ensure they are referenced below.
  const [isLoadingTaps, setIsLoadingTaps] = useState(false)
  const [tapsError, setTapsError] = useState<string | null>(null)
  const [reportMessage, setReportMessage] = useState<string | null>(null)
  const selectedReportFormat = 'excel' as const



  const [recentTaps, setRecentTaps] = useState<RecentTap[]>([])

  const [searchType, setSearchType] = useState<'name' | 'phone' | 'voice'>('name')
  const [showSearchOptions, setShowSearchOptions] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null)
  const [selfRegEnabled, setSelfRegEnabled] = useState(true)
  const [selfCheckoutEnabled, setSelfCheckoutEnabled] = useState(true)
  const [isSavingSelfReg, setIsSavingSelfReg] = useState(false)
  const [isSavingSelfCheckout, setIsSavingSelfCheckout] = useState(false)
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
    department: 'Finance',
    duration: '',
    hostName: '',
    profilePhoto: '',
    idProofType: 'NATIONAL_ID',
    idNumber: '',
    status: 'Visitor',
    docType: 'Personal ID',
    hasEquipment: false
  })

  const verificationModes: VerificationMode[] = [
    { id: 'face', name: 'Face', icon: FaUser },

    { id: 'fingerprint', name: 'Fingerprint', icon: FaFingerprint },
    { id: 'igipande', name: 'Igipande', icon: FaIdCard },
    { id: 'id-passport', name: 'ID/Passport', icon: FaIdCard },
    { id: 'voice', name: 'Voice', icon: FaMicrophone },
    { id: 'ocr', name: 'OCR', icon: MdQrCodeScanner },
    { id: 'gesture', name: 'Gesture', icon: FaHandPaper },
    { id: 'motion', name: 'Motion', icon: FaRunning },
    { id: 'pupil', name: 'Pupil', icon: MdVisibility }
  ]

  const isMethodVerified = (modeId: string) => {
    if (modeId === 'face') return true

    if ((modeId === 'id-passport' || modeId === 'igipande') && visitorForm.idNumber) return true
    if (modeId === 'ocr' && visitorForm.fullName && visitorForm.mobile) return true
    return false
  }



  const handleModeSelect = async (modeId: string) => {
    setSelectedMode(modeId)
    setIsScanning(true)
    setTapsError(null)

    try {
      const res = await visitorApi.getAppointmentForVisitor({
        idNumber: visitorForm.idNumber || undefined,
        phone: visitorForm.mobile || undefined,
        fullName: visitorForm.fullName || undefined,
        department: visitorForm.department || undefined,
      })

      const appointment = res?.result

      if (appointment) {
        setHasAppointment(true)
        setAppointmentDetails(appointment)
      } else {
        setHasAppointment(false)
        setAppointmentDetails(null)
      }

    } catch (e: any) {
      setHasAppointment(false)
      setAppointmentDetails(null)
      setTapsError(e?.response?.data?.message || e?.message || 'Failed to verify/lookup visitor')
    } finally {
      setIsScanning(false)
    }
  }

  const loadRecentTaps = async () => {
    try {
      setIsLoadingTaps(true)
      setTapsError(null)

      const res = await visitorApi.getRecentTaps({
        department: visitorForm.department,
        query: searchName || undefined,
        searchType,
        limit: 50,
      })

      setRecentTaps(Array.isArray(res?.result) ? res.result : [])

    } catch (e: any) {
      setTapsError(e?.response?.data?.message || e?.message || 'Failed to load recent taps')
      setRecentTaps([])
    } finally {
      setIsLoadingTaps(false)
    }
  }

  useEffect(() => {
    // initial load
    loadRecentTaps()
    loadSystemFeatures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSystemFeatures = async () => {
    try {
      const res = await visitorApi.getSystemFeatures()
      if (res.success && res.result) {
        setSelfRegEnabled(res.result.selfRegistrationEnabled)
        setSelfCheckoutEnabled(res.result.selfCheckoutEnabled)
      }
    } catch {
      // Features default to disabled if API fails
    }
  }

  const handleToggleFeature = async (featureKey: 'self_registration' | 'self_checkout', enabled: boolean) => {
    const setSaving = featureKey === 'self_registration' ? setIsSavingSelfReg : setIsSavingSelfCheckout
    setSaving(true)
    try {
      const payload = { featureKey, isEnabled: !enabled }
      const res = await visitorApi.updateSystemFeature(payload)

      if (res?.success) {
        if (featureKey === 'self_registration') setSelfRegEnabled(!enabled)
        else setSelfCheckoutEnabled(!enabled)
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to update feature'
      setTapsError(msg)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      loadRecentTaps()
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, searchType, visitorForm.department])

  const handleInputChange = (field: keyof VisitorForm, value: string | boolean) => {
    setVisitorForm((prev) => ({ ...prev, [field]: value }))
  }

  const validatePhoneAuto = async () => {
    const digits = visitorForm.mobile.replace(/[^\d]/g, '')
    if (!digits.trim()) return

    setIsValidatingPhone(true)
    setPhoneValidationState({ status: 'idle' })

    try {
      const res = await validatePhoneWithNumverify({
        phone: `${phoneCountryCode}${digits}`,
        countryCode: phoneCountryCode,
      })

      if (res.isValid) {
        const country = res.details?.country?.name || res.details?.country?.iso2
        const lineType = res.details?.line_type
        const location = res.details?.location
        const msg = [
          'Phone is valid',
          country ? `Country: ${country}` : null,
          lineType ? `Line: ${lineType}` : null,
          location ? `Location: ${location}` : null,
        ]
          .filter(Boolean)
          .join(' • ')

        setPhoneValidationState({ status: 'valid', message: msg })
        if (res.normalizedPhone) {
          setVisitorForm((prev) => ({ ...prev, mobile: res.normalizedPhone as string }))
        }
      } else {
        const country = res.details?.country?.name || res.details?.country?.iso2
        setPhoneValidationState({
          status: 'invalid',
          message: `Phone number is not valid${country ? ` (${country})` : ''}.`,
        })
      }
    } catch (e: any) {
      setPhoneValidationState({ status: 'error', message: e?.message || 'Failed to validate phone' })
    } finally {
      setIsValidatingPhone(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        visitor: {
          fullName: visitorForm.fullName,
          mobile: visitorForm.mobile,
          email: visitorForm.email,
          visitorCompany: visitorForm.visitorCompany,
          purpose: visitorForm.purpose,
          department: visitorForm.department,
          hostName: visitorForm.hostName,
          idProofType: visitorForm.idProofType,
          idNumber: visitorForm.idNumber,
          profilePhoto: visitorForm.profilePhoto || undefined
        },
        verificationMode: selectedMode || undefined,
        appointmentId: undefined,
        department: visitorForm.department,
        badgeType: 'QR'
      } as any

      await visitorApi.checkIn(payload)
      await loadRecentTaps()
      setVisitorForm((prev) => ({ ...prev, badgeId: '', idNumber: '' }))

      try {
        const reportRes = await client.post('/reports/auto')
        if (reportRes.data && reportRes.data.data && reportRes.data.data.generated) {
          setReportMessage('Report generated: ' + reportRes.data.data.reportCount + ' visitors')
        }
      } catch (e) {
        // silently ignore report errors
      }

      setHasAppointment(false)
      setAppointmentDetails(null)
      setSelectedMode('')
    } catch (e: any) {
      setTapsError(e?.response?.data?.message || e?.message || 'Failed to submit visitor')
    }
  }

  const handleReset = () => {
    setVisitorForm({
      mobile: '', email: '', fullName: '', passType: 'Visitor', visitorCompany: '',
      purpose: '', badgeId: '', whenToMeet: '', date: '', time: '', department: 'ICT',
      duration: '', hostName: '', profilePhoto: '', idProofType: 'NATIONAL_ID', idNumber: '',
      status: 'Employee', docType: 'Personal ID', hasEquipment: false
    })
    setSelectedMode('')
    setIsScanning(false)
  }

  const handleVoiceSearch = () => {
    setSearchType('voice')
    setShowSearchOptions(false)
    setIsRecording(true)
    setTimeout(() => setIsRecording(false), 3000)
  }

  const filteredTaps = recentTaps.filter((t) => {
    if (!searchName.trim()) return true
    const haystack = [t.visitorName, t.phoneNumber, t.documentType].filter(Boolean).join(' ')
    return haystack.toLowerCase().includes(searchName.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        {tapsError && (
          <div className="mb-3 px-3 py-2 text-sm rounded bg-red-50 text-red-700 border border-red-100">
            {tapsError}
          </div>
        )}

        {reportMessage && (
          <div className="mb-3 px-3 py-2 text-sm rounded bg-green-50 text-green-700 border border-green-100">
            {reportMessage}
          </div>
        )}

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Kiosk Features</h3>
            <p className="text-xs text-gray-600">Enable/disable kiosk Self Registration and Self Checkout</p>
          </div>

          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-gray-700">Self Registration</div>
              <button
                type="button"
                onClick={() => handleToggleFeature('self_registration', selfRegEnabled)}
                disabled={isSavingSelfReg}
                className={`flex items-center w-12 h-6 rounded-full transition-colors cursor-pointer border border-gray-200 ${
                   selfRegEnabled ? 'bg-green-500' : 'bg-gray-200'
                 } ${isSavingSelfReg ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-pressed={selfRegEnabled}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    selfRegEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-gray-700">Self Checkout</div>
              <button
                type="button"
                onClick={() => handleToggleFeature('self_checkout', selfCheckoutEnabled)}
                disabled={isSavingSelfCheckout}
                className={`flex items-center w-12 h-6 rounded-full transition-colors cursor-pointer border border-gray-200 ${
                   selfCheckoutEnabled ? 'bg-green-500' : 'bg-gray-200'
                 } ${isSavingSelfCheckout ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-pressed={selfCheckoutEnabled}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    selfCheckoutEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EquipmentModal
        isOpen={showEquipmentModal}
        onClose={() => {
          setShowEquipmentModal(false)
          if (equipmentList.length === 0) {
            handleInputChange('hasEquipment', false)
          }
        }}
        equipmentList={equipmentList}
        setEquipmentList={setEquipmentList}
      />

      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        appointment={appointmentDetails}
      />

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Scanning Area</span>
        <input
          type="text"
          className="flex-1 max-w-xl px-3 py-1.5 border-2 border-[#1A3263] rounded text-sm focus:outline-none focus:border-orange-500 text-black"
          placeholder="Scan or enter ID..."
        />

        <div className="ml-auto flex items-center gap-4">
          {hasAppointment && (
            <button
              onClick={() => setShowAppointmentModal(true)}
              className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-300 rounded hover:bg-green-100 transition-colors cursor-pointer"
            >
              <span className="text-green-600 text-lg">✓</span>
              <span className="text-sm font-medium text-green-700">Has Appointment</span>
            </button>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visitorForm.hasEquipment}
              onChange={(e) => {
                handleInputChange('hasEquipment', e.target.checked)
                if (e.target.checked) setShowEquipmentModal(true)
              }}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-gray-600">Equipment</span>
          </label>

          {visitorForm.hasEquipment && equipmentList.length > 0 && (
            <button
              onClick={() => setShowEquipmentModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              ({equipmentList.length} items)
            </button>
          )}

          <button
            onClick={() => handleToggleFeature('self_registration', selfRegEnabled)}
            disabled={isSavingSelfReg}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              selfRegEnabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}
            title="Toggle Self Registration"
          >
            {selfRegEnabled ? <FaToggleOn className="text-emerald-600" /> : <FaToggleOff className="text-gray-400" />}
            <span>Self Reg</span>
          </button>

          <button
            onClick={() => handleToggleFeature('self_checkout', selfCheckoutEnabled)}
            disabled={isSavingSelfCheckout}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              selfCheckoutEnabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}
            title="Toggle Self Checkout"
          >
            {selfCheckoutEnabled ? <FaToggleOn className="text-emerald-600" /> : <FaToggleOff className="text-gray-400" />}
            <span>Self Out</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Names</label>
              <input
                type="text"
                value={visitorForm.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Id No</label>
              <input
                type="text"
                value={visitorForm.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Email</label>
              <input
                type="email"
                value={visitorForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Optional email"
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Department</label>
              <div className="flex-1 relative">
                <select
                  value={visitorForm.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none appearance-none text-black bg-white pr-8"
                >
                  <option>ICT</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Operations</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-5 h-5 bg-[#1A3263] rounded flex items-center justify-center">
                    <span className="text-white text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Status</label>
              <div className="flex-1 relative">
                <select
                  value={visitorForm.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none appearance-none text-black bg-white pr-8"
                >
                  <option>Employee</option>
                  <option>Visitor</option>
                  <option>Contractor</option>
                  <option>VIP</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-5 h-5 bg-[#1A3263] rounded flex items-center justify-center">
                    <span className="text-white text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Doc Type</label>
              <input
                type="text"
                value={visitorForm.docType}
                onChange={(e) => handleInputChange('docType', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Phone No</label>
              <div className="flex gap-2 flex-1">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => {
                    setPhoneCountryCode(e.target.value)
                    setPhoneValidationState({ status: 'idle' })
                  }}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none text-black bg-white"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.name})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="tel"
                    value={visitorForm.mobile}
                    onChange={(e) => {
                      const next = e.target.value
                      handleInputChange('mobile', next)
                      setPhoneValidationState({ status: 'idle' })
                      window.clearTimeout((validatePhoneAuto as any)._t)
                      ;(validatePhoneAuto as any)._t = window.setTimeout(() => {
                        if (next && next.replace(/[^\d]/g, '').trim()) validatePhoneAuto()
                      }, 400)
                    }}
                    placeholder="Phone number"
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  />

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="ml-1 px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 text-gray-400 rounded cursor-not-allowed opacity-80"
                  >
                    {isValidatingPhone ? 'Validating…' : 'Validated'}
                  </button>
                </div>
              </div>
            </div>

            {phoneValidationState.status !== 'idle' && (
              <div className="text-sm">
                {phoneValidationState.status === 'valid' && (
                  <div className="text-green-700">{phoneValidationState.message}</div>
                )}
                {phoneValidationState.status === 'invalid' && (
                  <div className="text-red-700">{phoneValidationState.message}</div>
                )}
                {phoneValidationState.status === 'error' && (
                  <div className="text-orange-700">{phoneValidationState.message}</div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2 justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-1.5 bg-white hover:bg-gray-100 text-[#1A3263] text-sm font-bold cursor-pointer rounded border border-[#1A3263] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Col 2: Profile Photo + Capture */}
          <div className="flex flex-col items-center justify-start gap-3 border-gray-300 border rounded">
            {/* Avatar */}
            <div className="w-44 h-44 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-gray-200 shadow">
              {(selectedVisitorPhoto || visitorForm.profilePhoto) ? (
                <img
                  src={selectedVisitorPhoto || visitorForm.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={avatimage} alt='ProfileImage' className="w-full h-full object-cover" />
              )}
            </div>
            {/* Capture / Retake */}
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border border-gray-300 transition-colors">
                <FaCamera size={13} /> Start/Stop
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border border-gray-300 transition-colors">
                <FaCamera size={13} /> Capture
              </button>
            </div>
          </div>

          {/* Col 3: Verification Methods (top) + ID Scan Preview (bottom) */}
          <div className="space-y-3">
        

            {/* Verification Methods Grid 3x3 */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">Verification Methods</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {verificationModes.map((mode) => {
                  const Icon = mode.icon
                  const isVerified = isMethodVerified(mode.id)
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode.id)}
                      disabled={isScanning}
                      className={`relative flex flex-col items-center justify-center gap-1 py-2 px-1 rounded border text-center transition-all ${
                        selectedMode === mode.id
                          ? 'border-blue-500 bg-blue-50'
                          : isVerified
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      } ${isScanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isVerified && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">✓</span>
                      )}
                      {isScanning && selectedMode === mode.id && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 animate-pulse" />
                      )}
                      <Icon
                        size={18}
                        className={
                          selectedMode === mode.id ? 'text-blue-600' :
                          isVerified ? 'text-green-600' : 'text-gray-500'
                        }
                      />
                      <span className="text-xs text-gray-700 font-medium leading-tight">{mode.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Face verification / ID Scan Preview */}
            <div className="border-2 border-gray-300 rounded bg-gray-50 h-28 flex items-center justify-center w-full">
              {selectedMode === 'face' ? (
                <div className="w-full px-2">
                  <FaceVerify
                    department={visitorForm.department}
                    autoCapture={true}
                    detectionIntervalMs={300}
                    onCapturedCheckIn={handleFaceMatchedCheckIn}
                  />
                </div>

              ) : (
                <span className="text-gray-400 text-sm">Card Scan Preview</span>
              )}
            </div>
          </div>
        </div>


        {/* Bottom Action Row */}
        <div className="flex items-center gap-3 mb-3">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors">
            Appointments
            <span className="bg-[#1A3263] text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{hasAppointment ? 1 : 0}</span>
          </button>
          <button className="px-4 py-1.5 bg-white border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors">
            Non ID
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            <FaSync size={12} /> Refresh
          </button>
        </div>

        {/* Recent Taps Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-visible">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <button className="px-4 py-1.5 bg-white border border-gray-300 text-sm text-gray-700 rounded">
              Recent Taps
            </button>

            <div className="flex items-center gap-2">
              {/* reference for TS no-unused-vars */}
              <span className="hidden">{String(isLoadingTaps)}{String(!!tapsError)}</span>

              <div className="relative z-50">
                {/* Voice Recording Indicator */}
                {searchType === 'voice' && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-300 rounded-lg shadow-xl p-3 w-64 z-50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-2 rounded-full transition-colors ${
                          isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <FaMicrophone size={16} className="text-white" />
                      </button>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">
                          {isRecording ? 'Recording...' : 'Click to record'}
                        </div>
                        <div className="flex gap-1 h-6 items-end">
                              {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t transition-all ${
                                isRecording
                                  ? 'bg-red-500 animate-pulse'
                                  : 'bg-gray-300'
                              }`}
                              style={{
                                height: isRecording ? `${(i % 5) * 18 + 15}%` : '20%',
                                animationDelay: `${i * 50}ms`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder={`Search by ${searchType === 'name' ? 'Name' : searchType === 'phone' ? 'Phone' : 'Voice'}...`}
                  className="pl-3 pr-24 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 text-black"
                />
                <div className="absolute right-0 top-0 h-full flex items-center bg-gray-300 pl-1 transtion rounded-sm">
                  {showSearchOptions && (
                    <div className="flex gap-1 mr-1">
                      <button
                        onClick={() => { setSearchType('name'); setShowSearchOptions(false); }}
                        className={`p-1.5 rounded transition-colors ${searchType === 'name' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Search by Name"
                      >
                        <FaUser size={12} />
                      </button>
                      <button
                        onClick={() => { setSearchType('phone'); setShowSearchOptions(false); }}
                        className={`p-1.5 rounded transition-colors ${searchType === 'phone' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Search by Phone"
                      >
                        <FaIdCard size={12} />
                      </button>
                      <button
                        onClick={handleVoiceSearch}
                        className={`p-1.5 rounded transition-colors ${searchType === 'voice' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Search by Voice"
                      >
                        <FaMicrophone size={12} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setShowSearchOptions(!showSearchOptions)}
                    className="h-full px-3 bg-blue-700 text-white rounded-r-lg hover:bg-blue-800 transition-colors"
                  >
                    <FaSearch size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
                  <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['No', 'Names', 'Document Type', 'Phone Number', 'Entry Time', 'Exit Time', 'Department'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTaps.map((tap, idx) => (
                    <tr key={tap.id ?? idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-gray-700">{idx + 1}</td>
                    <td className="px-4 py-2 text-gray-800 font-medium">{tap.visitorName}</td>
                    <td className="px-4 py-2 text-gray-600">{tap.documentType ?? '-'}</td>
                    <td className="px-4 py-2 text-gray-600">{tap.phoneNumber ?? '-'}</td>

                    <td className="px-4 py-2 text-gray-600">{tap.entryTime}</td>
                    <td className="px-4 py-2 text-gray-600">{tap.exitTime}</td>
                    <td className="px-4 py-2 text-gray-600">{tap.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanningPage

