import { useEffect, useMemo, useRef, useState } from 'react'
import { FaCamera, FaSync } from 'react-icons/fa'
import avatimage from '/src/assets/images/avartImage.avif'
import bgImage from '/src/assets/images/nh.jpg'
import { validatePhoneWithNumverify } from '../api/phoneVerification'
import { visitorApi } from '../api/visitor'
import { usersApi, type User } from '../api/users'
import FaceCapture from './camera/FaceCapture'
import { uploadToCloudinary } from '../utils/cloudinary'

type KioskStep =
  | 'welcome'
  | 'method'
  | 'visitorType'
  | 'dataEntry'
  | 'photo'
  | 'host'
  | 'confirmation'
  | 'printing'

type PhoneValidationState =
  | { status: 'idle' }
  | { status: 'valid'; message: string }
  | { status: 'invalid'; message: string }
  | { status: 'error'; message: string }

type VerificationModeId =
  | 'face'
  | 'fingerprint'
  | 'igipande'
  | 'id-passport'
  | 'voice'
  | 'ocr'
  | 'gesture'
  | 'motion'
  | 'pupil'

type VisitorType = 'Guests' | 'Contractors' | 'Interviews'

type VisitorForm = {
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

const initialVisitorForm: VisitorForm = {
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
  department: 'ICT',
  duration: '',
  hostName: '',
  profilePhoto: '',
  idProofType: 'National ID',
  idNumber: '',
  status: 'Employee',
  docType: 'Personal ID',
  hasEquipment: false,
}

const countryCodes = [
  { code: '+250', name: 'Rwanda', flag: 'RW' },
  { code: '+1', name: 'USA', flag: 'US' },
  { code: '+44', name: 'UK', flag: 'GB' },
  { code: '+33', name: 'France', flag: 'FR' },
  { code: '+49', name: 'Germany', flag: 'DE' },
  { code: '+254', name: 'Kenya', flag: 'KE' },
  { code: '+256', name: 'Uganda', flag: 'UG' },
]

export default function SelfRegistrationCard({
  showTopScanningBar = true,
  wrapWithBackground = true,
}: {
  showTopScanningBar?: boolean
  wrapWithBackground?: boolean
}) {
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  const [visitorForm, setVisitorForm] = useState<VisitorForm>(initialVisitorForm)
  const [selectedMode, setSelectedMode] = useState<VerificationModeId | ''>('')
  const [step, setStep] = useState<KioskStep>('welcome')
  const [visitorType, setVisitorType] = useState<VisitorType>('Guests')

  const [phoneCountryCode, setPhoneCountryCode] = useState('+250')
  // Force default Numverify country selection (auto-validation uses this)
  useEffect(() => {
    setPhoneCountryCode('+250')
  }, [])
  const [isValidatingPhone, setIsValidatingPhone] = useState(false)
  const [phoneValidationState, setPhoneValidationState] = useState<PhoneValidationState>({ status: 'idle' })

  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const [isCameraReady, setIsCameraReady] = useState(false)
  const [hosts, setHosts] = useState<User[]>([])

  // Inactivity auto reset
  const inactivityMs = 60_000
  const inactivityTimerRef = useRef<number | null>(null)

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current)
    inactivityTimerRef.current = window.setTimeout(() => {
      resetAll('welcome')
    }, inactivityMs)
  }

  useEffect(() => {
    const onAnyActivity = () => resetInactivityTimer()
    window.addEventListener('mousemove', onAnyActivity)
    window.addEventListener('keydown', onAnyActivity)
    window.addEventListener('touchstart', onAnyActivity)
    resetInactivityTimer()
    return () => {
      window.removeEventListener('mousemove', onAnyActivity)
      window.removeEventListener('keydown', onAnyActivity)
      window.removeEventListener('touchstart', onAnyActivity)
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    usersApi.getAll({ take: 500 }).then(res => setHosts(res.result || [])).catch(() => {})
  }, [])


  const verificationModes = useMemo(
    () =>
      [
        { id: 'face' as const, name: 'Face' },
        { id: 'fingerprint' as const, name: 'Fingerprint' },
        { id: 'igipande' as const, name: 'Igipande' },
        { id: 'id-passport' as const, name: 'ID/Passport' },
        { id: 'voice' as const, name: 'Voice' },
        { id: 'ocr' as const, name: 'OCR' },
        { id: 'gesture' as const, name: 'Gesture' },
        { id: 'motion' as const, name: 'Motion' },
        { id: 'pupil' as const, name: 'Pupil' },
      ] as const,
    [],
  )

  const isMethodVerified = (modeId: VerificationModeId) => {
    if (modeId === 'face' && visitorForm.profilePhoto) return true
    if ((modeId === 'id-passport' || modeId === 'igipande') && visitorForm.idNumber) return true
    if (modeId === 'ocr' && visitorForm.fullName && visitorForm.mobile) return true
    return false
  }

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const handleInputChange = (field: keyof VisitorForm, value: string | boolean) => {
    setVisitorForm((prev) => ({ ...prev, [field]: value as any }))
  }

  const validatePhone = async () => {
    // guard against empty input
    const phoneDigits = visitorForm.mobile.replace(/[^\d]/g, '')
    if (!phoneDigits.trim()) return

    setIsValidatingPhone(true)
    setPhoneValidationState({ status: 'idle' })
    setFormError(null)

    try {
      const phone = visitorForm.mobile
      const digits = phone.replace(/[^\d]/g, '')
      if (!digits.trim()) {
        setPhoneValidationState({ status: 'invalid', message: 'Enter a phone number first.' })
        return
      }

      const res = await validatePhoneWithNumverify({ phone: `${phoneCountryCode}${digits}`, countryCode: phoneCountryCode })

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

  // Fake capture removed; FaceCapture is used for real webcam capture.


  const handleCaptureFile = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file)
      setVisitorForm((prev) => ({ ...prev, profilePhoto: url }))
    } catch (e: any) {
      setFormError(e?.message || 'Failed to upload photo')
    }
  }

  const handleSubmit = async () => {
    setFormError(null)
    setFormLoading(true)

    try {
      const payload = {
        visitor: {
          fullName: visitorForm.fullName,
          mobile: visitorForm.mobile,
          email: visitorForm.email || undefined,
          visitorCompany: visitorForm.visitorCompany || undefined,
          purpose: visitorForm.purpose || undefined,
          department: visitorForm.department,
          hostName: visitorForm.hostName || undefined,
          idProofType: visitorForm.idProofType || undefined,
          idNumber: visitorForm.idNumber || undefined,
          profilePhoto: visitorForm.profilePhoto || undefined,
        },
        verificationMode: selectedMode || undefined,
        department: visitorForm.department,
        badgeType: 'QR' as const,
      }

      await visitorApi.publicCheckIn(payload)

      setVisitorForm(initialVisitorForm)
      setSelectedMode('')
      setPhoneValidationState({ status: 'idle' })
      setIsCameraReady(false)
    } catch (e: any) {
      setFormError(e?.response?.data?.message || e?.message || 'Failed to submit visitor')
    } finally {
      setFormLoading(false)
    }
  }

  const resetAll = (toStep: KioskStep = 'welcome') => {
    setVisitorForm(initialVisitorForm)
    setSelectedMode('')
    setPhoneValidationState({ status: 'idle' })
    setIsCameraReady(false)
    setFormError(null)
    setStep(toStep)
    // Reset any step-specific UI state defaults
    setVisitorType('Guests')
  }


  const content = (
    <>
      {showTopScanningBar && (
        <div className="relative w-full bg-white/90 border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Scanning Area</span>
          <input
            type="text"
            className="flex-1 max-w-xl px-3 py-1.5 border-2 border-[#1A3263] rounded text-sm focus:outline-none focus:border-orange-500 text-black bg-white/90"
            placeholder="Scan or enter ID..."
            onFocus={() => firstInputRef.current?.focus()}
          />
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FaSync size={14} />
              <span className="text-sm font-medium text-gray-700">Refresh</span>
            </button>
          </div>
        </div>
      )}

      <div className="relative p-4">
        <div className="grid grid-cols-3 gap-4 bg-white/95 rounded-lg shadow-sm p-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Names</label>
              <input
                ref={firstInputRef}
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
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Purpose</label>
              <input
                type="text"
                value={visitorForm.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Host</label>
              <div className="flex-1 relative">
                <select
                  value={visitorForm.hostName}
                  onChange={(e) => handleInputChange('hostName', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none appearance-none text-black bg-white pr-8"
                >
                  <option value="">-- Select Host --</option>
                  {hosts.map(h => (
                    <option key={h.id} value={h.fullName}>{h.fullName}{h.department ? ` (${h.department})` : ''}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-5 h-5 bg-[#1A3263] rounded flex items-center justify-center">
                    <span className="text-white text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 text-right shrink-0">Phone No</label>
              <div className="flex gap-2 flex-1">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
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
                      // Auto-validate (no button)
                      // Debounce by simple timeout to avoid too many requests
                      window.clearTimeout((validatePhone as any)._t)
                      ;(validatePhone as any)._t = window.setTimeout(() => {
                        if (next && next.replace(/[^\d]/g, '').trim()) {
                          validatePhone()
                        }
                      }, 400)
                    }}
                    placeholder="Phone number"
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  />

                  {/* Auto-validated: no manual Validate button */}
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
                {phoneValidationState.status === 'valid' && <div className="text-green-700">{phoneValidationState.message}</div>}
                {phoneValidationState.status === 'invalid' && <div className="text-red-700">{phoneValidationState.message}</div>}
                {phoneValidationState.status === 'error' && <div className="text-orange-700">{phoneValidationState.message}</div>}
              </div>
            )}

            {formError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{formError}</div>}

            <div className="flex gap-2 pt-2 justify-center">
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="px-8 py-1.5 bg-white hover:bg-gray-100 text-[#1A3263] text-sm font-bold cursor-pointer rounded border border-[#1A3263] transition-colors disabled:opacity-50"
              >
                {formLoading ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start gap-3 border-gray-300 border rounded p-3">
            <div className="w-44 h-44 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-gray-200 shadow">
              {visitorForm.profilePhoto ? (
                <img src={visitorForm.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={avatimage} alt="ProfileImage" className="w-full h-full object-cover" />
              )}
            </div>

              <div className="flex gap-2 flex-wrap justify-center">
                <label className="flex items-center gap-2 px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border border-gray-300 transition-colors cursor-pointer">
                  <FaCamera size={13} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleCaptureFile(f)
                    }}
                  />
                </label>
              </div>

              {/* Face verification capture (webcam + auto-detection when supported) */}
              <div className="w-full">
                <FaceCapture
                  autoCapture
                  onCapture={async (dataUrl) => {
                    setIsCameraReady(true)
                    setSelectedMode((prev) => (prev ? prev : 'face'))

                    try {
                      const url = await uploadToCloudinary(dataUrl)
                      setVisitorForm((prev) => ({ ...prev, profilePhoto: url }))

                      if (!visitorForm.fullName) {
                        const match = await visitorApi.faceVerify({
                          apiKey: '103745a027eb8c7f8efd7b765abce7f2207de2e182819d97b06ab7ef457380fc',
                          faceImageBase64: dataUrl,
                          department: visitorForm.department,
                        })
                        const result = (match as any)?.result ?? match
                        if (result?.matched) {
                          setVisitorForm((prev) => ({
                            ...prev,
                            fullName: result.fullName ?? prev.fullName,
                            department: result.department ?? prev.department,
                          }))
                        }
                      }
                    } catch {
                      // fallback: store base64 locally if upload fails
                      setVisitorForm((prev) => ({ ...prev, profilePhoto: dataUrl }))
                    }
                  }}
                />
              </div>

              {!isCameraReady && (
                <div className="text-xs text-gray-500 text-center">Align your face with the box. Photo will be captured automatically when supported.</div>
              )}
            </div>



          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">Verification Methods</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {verificationModes.map((mode) => {
                  const isVerified = isMethodVerified(mode.id)
                  const isSelected = selectedMode === mode.id
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={`relative flex flex-col items-center justify-center gap-1 py-2 px-1 rounded border text-center transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : isVerified
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {isVerified && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">✓</span>
                      )}
                      {isSelected && <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 animate-pulse" />}
                      <span className="text-xs text-gray-700 font-medium leading-tight">{mode.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded bg-gray-50 h-28 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Card Scan Preview</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="text-sm text-gray-600">Kiosk steps: Arrive → Enter details → Validate phone → Add photo → Submit.</div>
        </div>
      </div>
    </>
  )

  if (!wrapWithBackground) return content

  return (
    <div
      className="min-h-screen font-sans relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-white/70" />
      {content}
    </div>
  )
}

