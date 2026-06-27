import { useEffect, useState, useRef } from 'react'
import {
  FaCamera,
  FaCalendarCheck,
  FaUserTie,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaRedo,
  FaCheck,
  FaPrint,
  FaDownload,
  FaExclamationTriangle,
  FaClock,
  FaInfoCircle,
  FaSearch,
  FaHome
} from 'react-icons/fa'
import { useInactivityTimer } from '../hooks/useInactivityTimer'
import { usePhoneValidation } from '../hooks/usePhoneValidation'
import useKioskDevice from '../hooks/useKioskDevice'
import evsLogo from '../assets/logos/evs.png'
import bgImage from '../assets/images/nh.jpg'
import borderImage from '../assets/images/design.png'
import cloudImage from '../assets/images/kigaliport.png'
import { visitorApi } from '../api/visitor'
import { notificationsApi } from '../api/notifications'
import { usersApi, type User } from '../api/users'
import FaceCapture from './camera/FaceCapture'
import { uploadToCloudinary } from '../utils/cloudinary'
import BadgeQr from './qr/BadgeQr'
import Button from './ui/Button'
import Navbar from './ui/navbar'

type StepKey = 'welcome' | 'details' | 'photo' | 'host' | 'confirmation'

type VisitorType = 'Guests' | 'Contractors' | 'Interviews'

type VisitorForm = {
  mobile: string
  email: string
  fullName: string
  visitorCompany: string
  purpose: string
  date: string
  time: string
  department: string
  hostName: string
  profilePhoto: string
  idProofType: string
  idNumber: string
  hasEquipment: boolean
}

const initialVisitorForm: VisitorForm = {
  mobile: '',
  email: '',
  fullName: '',
  visitorCompany: '',
  purpose: '',
  date: '',
  time: '',
  department: 'ICT',
  hostName: '',
  profilePhoto: '',
  idProofType: 'NATIONAL_ID',
  idNumber: '',
  hasEquipment: false,
}

const normalizeMobile = (value: string, countryCode: string) => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('+')) return digits.replace(/^\+/, '')
  if (digits.length === 9 && countryCode === '+250') return `250${digits}`
  return digits
}

const isValidEmail = (value: string) => !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const STORAGE_KEY = 'self_registration_form'

const countryCodes = [
  { code: '+250', name: 'Rwanda' },
  { code: '+1', name: 'USA' },
  { code: '+44', name: 'UK' },
  { code: '+33', name: 'France' },
  { code: '+49', name: 'Germany' },
  { code: '+254', name: 'Kenya' },
  { code: '+256', name: 'Uganda' },
]

const steps = [
  { key: 'welcome' as StepKey, label: 'Welcome', icon: <FaHome size={14} /> },
  { key: 'details' as StepKey, label: 'Details', icon: <FaInfoCircle size={14} /> },
  { key: 'photo' as StepKey, label: 'Identity', icon: <FaCamera size={14} /> },
  { key: 'host' as StepKey, label: 'Meeting', icon: <FaUserTie size={14} /> },
  { key: 'confirmation' as StepKey, label: 'Review', icon: <FaCheckCircle size={14} /> },
]

export default function SelfRegistrationCard({
  showTopScanningBar = true,
}: {
  showTopScanningBar?: boolean
}) {
  const [visitorForm, setVisitorForm] = useState<VisitorForm>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...initialVisitorForm, ...parsed.form, ...{ date: parsed.form?.date || initialVisitorForm.date, time: parsed.form?.time || initialVisitorForm.time } }
      }
    } catch {
      return
    }
    return { ...initialVisitorForm, date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5) }
  })
  const [step, setStep] = useState<StepKey>('welcome')
  const [visitorType, setVisitorType] = useState<VisitorType>('Guests')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+250')
  const phoneValidation = usePhoneValidation(phoneCountryCode)
  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [hosts, setHosts] = useState<User[]>([])
  const [hostsFiltered, setHostsFiltered] = useState<User[]>([])
  const [hostSearch, setHostSearch] = useState('')
 const [badge, setBadge] = useState<{ badgeId: string; status: string; isReturning?: boolean } | null>(null)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
   const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null)
   const warningTimeoutRef = useRef<number | null>(null)
   const kioskDevice = useKioskDevice()

   useEffect(() => {
     visitorApi.getSystemFeatures().then((res) => {
       if (res.success && res.result) {
         setIsFeatureEnabled(res.result.selfRegistrationEnabled)
       } else {
         setIsFeatureEnabled(true)
       }
     }).catch(() => {
       setIsFeatureEnabled(true)
     })
     usersApi.getAll({ take: 500 }).then((res) => {
       const allHosts = res.result || []
       setHosts(allHosts)
       setHostsFiltered(allHosts)
     }).catch(() => {})
   }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form: visitorForm, step, visitorType }))
    } catch {
      return
    }
  }, [visitorForm, step, visitorType])

useEffect(() => {
     if (!hostSearch.trim()) {
       setHostsFiltered(hosts)
     } else {
       const filtered = hosts.filter(h => 
         h.fullName.toLowerCase().includes(hostSearch.toLowerCase()) ||
         (h.department && h.department.toLowerCase().includes(hostSearch.toLowerCase()))
       )
       setHostsFiltered(filtered)
     }
   }, [hostSearch, hosts])

  const handleHostSelect = async (host: User) => {
    handleInputChange('hostName', host.fullName)
    setHostSearch(host.fullName)
    
    // Send instant notification to host when selected
    try {
      await notificationsApi.notifyHostAppointmentRequest({
        hostName: host.fullName,
        visitorName: visitorForm.fullName || 'New Visitor',
        department: visitorForm.department,
        appointmentDate: visitorForm.date,
        appointmentTime: visitorForm.time,
      })
    } catch (e) {
      console.error('Failed to notify host:', e)
    }
  }

  const handleInputChange = (field: keyof VisitorForm, value: string | boolean) => {
    setVisitorForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCaptureFile = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file)
      setVisitorForm((prev) => ({ ...prev, profilePhoto: url }))
      setIsCameraReady(true)
    } catch (e) {
      let message = 'Photo upload failed'
      if (e instanceof Error) message = e.message
      setFormError(message)
    }
  }

  const handleSubmit = async () => {
    // Fast UX: mark loading immediately and prevent double-submit.
    if (formLoading) return
    setFormError(null)
    setFormLoading(true)

    try {
      const normalizedMobile = normalizeMobile(visitorForm.mobile, phoneCountryCode)
      const email = visitorForm.email.trim()

      // Keep validations synchronous to avoid extra async latency.
      if (normalizedMobile.length < 10 || normalizedMobile.length > 15) {
        setFormError('Enter a valid phone number with country code (10-15 digits).')
        return
      }

      if (!isValidEmail(email)) {
        setFormError('Enter a valid email address or leave the email field empty.')
        return
      }

      const payload = {
        visitor: {
          fullName: visitorForm.fullName,
          mobile: normalizedMobile,
          email: email || undefined,
          visitorCompany: visitorForm.visitorCompany || undefined,
          purpose: visitorForm.purpose || undefined,
          department: visitorForm.department,
          hostName: visitorForm.hostName || undefined,
          idProofType: visitorForm.idProofType || undefined,
          idNumber: visitorForm.idNumber || undefined,
          profilePhoto: visitorForm.profilePhoto || undefined,
        },
        verificationMode: 'face',
        department: visitorForm.department,
        badgeType: 'QR' as const,
        visitorType,
        date: visitorForm.date || undefined,
        time: visitorForm.time || undefined,
      }

      // IMPORTANT: immediately await the check-in; on success switch steps.
      // (This is the only network call on the final step.)
      const res = await visitorApi.publicCheckIn(payload)

      setBadge({
        badgeId: String(res.result?.badgeId || `BADGE-${Date.now()}`),
        status: 'CHECKED_IN',
        isReturning: res.result?.isReturning,
      })
      setStep('confirmation')
    } catch (e) {
      let message = 'Check-in failed'
      if (e instanceof Error) {
        const errWithResponse = e as Error & { response?: { data?: { message?: string } } }
        message = errWithResponse.response?.data?.message || e.message
      }
      setFormError(message)
    } finally {
      setFormLoading(false)
    }
  }

  const resetAll = () => {
    if (warningTimeoutRef.current) {
      window.clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
    localStorage.removeItem(STORAGE_KEY)
    setVisitorForm({
      ...initialVisitorForm,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
    })
    phoneValidation.reset()
    setIsCameraReady(false)
    setFormError(null)
    setStep('welcome')
    setVisitorType('Guests')
    setBadge(null)
    setShowTimeoutWarning(false)
  }

  const handleTimeoutWarning = () => {
    setShowTimeoutWarning(true)
    warningTimeoutRef.current = window.setTimeout(() => {
      resetAll()
    }, 10_000)
  }

  useInactivityTimer(handleTimeoutWarning, 90_000)

  const currentStepIndex = steps.findIndex((s) => s.key === step)
  const normalizedMobile = normalizeMobile(visitorForm.mobile, phoneCountryCode)
  const isDetailsValid = visitorForm.fullName.trim().length > 0 && normalizedMobile.length >= 10 && normalizedMobile.length <= 15 && isValidEmail(visitorForm.email)
  const isHostValid = visitorForm.hostName.trim().length > 0
  const canSubmit = isDetailsValid && isCameraReady && isHostValid
  const isCompactDevice = kioskDevice.type === 'phone' || (kioskDevice.orientation === 'portrait' && kioskDevice.height < 760)
  const isLowHeightDevice = kioskDevice.height < 680
  const isLandscapeHandheld = kioskDevice.isTouch && kioskDevice.orientation === 'landscape'

  return (
<div
      className={`self-registration-kiosk w-full min-h-[100dvh] h-[100dvh] flex justify-center items-center relative overflow-hidden font-["Comfortaa"] registration-border ${isLowHeightDevice ? 'py-0' : 'py-2 sm:py-4'}`}
      style={{
        borderImage: `url(${borderImage}) 10 10 10 10 repeat`,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Overlay - High opacity to ensure image visibility with clear contrast */}
      <div className="absolute inset-0 bg-[#1A3263]/15 backdrop-blur-[1px] z-0" />

      {/* MAIN CARD */}
        <div className={`self-registration-card w-full h-full max-w-[1600px] mx-auto rounded-2xl sm:rounded-[40px] shadow-3xl border border-white/40 relative bg-white/95 backdrop-blur-xl overflow-hidden flex flex-col z-10 ${isLandscapeHandheld ? 'shadow-none' : ''}`} style={{ borderImage: `url(${borderImage}) 10 10 10 10 repeat` }}>
        
        {/* NAVBAR INTEGRATION */}
        <Navbar hideLinks />

        {/* CONTENT AREA */}
        <div 
          className={`self-registration-content flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative custom-scrollbar ${isCompactDevice ? 'p-3 sm:p-4' : 'p-6 md:p-10'}`}
          style={{
            backgroundImage: `url(${cloudImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A3263]/5 rounded-bl-[200px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1A3263]/5 rounded-tr-[150px] pointer-events-none" />

          {showTopScanningBar && step !== 'confirmation' && (
            <div className={`w-full max-w-4xl mx-auto bg-white border border-gray-100 px-4 py-2 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 ${isLowHeightDevice ? 'mb-3' : 'mb-6 sm:mb-10'} rounded-2xl sm:rounded-[24px] shadow-xl hover:shadow-2xl transition-all group z-20 kiosk-top-bar`}>
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] sm:text-[12px] font-black text-[#1A3263] whitespace-nowrap tracking-[0.2em] uppercase">Security Scanning</span>
              </div>
              <div className="w-full flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A3263] transition-colors" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50/50 border-2 border-transparent rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#1A3263]/40 focus:bg-white transition-all font-bold text-[#1A3263] placeholder:text-gray-400"
                  placeholder="Scan National ID or Passport..."
                />
              </div>
              {step !== 'welcome' && (
                <button onClick={resetAll} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-2 sm:py-2.5 bg-white border border-gray-100 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <FaRedo size={10} className="text-gray-500" />
                  <span className="text-[10px] sm:text-[12px] font-bold text-gray-600">New Entry</span>
                </button>
              )}
            </div>
          )}

          {/* PROGRESS STEPPER */}
          <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 z-20">
            <div className="flex items-center justify-between relative px-2 sm:px-4">
              {/* Connector Line */}
              <div className={`absolute top-5 sm:top-6 left-6 sm:left-10 right-6 sm:right-10 h-[2px] sm:h-[3px] bg-gray-200/50 z-0 kiosk-stepper-connector`} />
              <div 
                className="absolute top-5 sm:top-6 left-6 sm:left-10 h-[2px] sm:h-[3px] bg-[#1A3263] z-0 transition-all duration-700 ease-in-out kiosk-stepper-progress"
                style={{ width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - ${isCompactDevice ? '12px' : '20px'})` }}
              />

              {steps.map((s, idx) => (
                <div key={s.key} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`kiosk-step-icon-wrap w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      idx < currentStepIndex 
                        ? 'bg-emerald-500 text-white shadow-lg rotate-[360deg]' 
                        : idx === currentStepIndex
                        ? 'bg-[#1A3263] text-white shadow-2xl scale-110 -rotate-3'
                        : 'bg-white text-gray-300 border-2 border-gray-100 shadow-sm'
                    }`}
                  >
                    {idx < currentStepIndex ? <FaCheck size={12} className="sm:text-[16px]" /> : <span className="text-sm sm:text-lg">{s.icon}</span>}
                  </div>
                  <div className="kiosk-step-label mt-2 sm:mt-3 text-center">
                    <p className={`text-[7px] sm:text-[10px] font-black uppercase tracking-widest ${
                      idx <= currentStepIndex ? 'text-[#1A3263]' : 'text-gray-400'
                    }`}>
                      Step {idx + 1}
                    </p>
                    <p className={`text-[9px] sm:text-[12px] font-bold ${
                      idx <= currentStepIndex ? 'text-gray-800' : 'text-gray-300'
                    }`}>
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

{/* STEP CONTENT CONTAINER */}
           <div className={`self-registration-step flex-1 min-h-0 flex flex-col items-center justify-center z-20 ${isLowHeightDevice ? 'py-1' : 'py-2 sm:py-4'}`}>
             <div className={`self-registration-panel w-full max-w-5xl bg-white/80 rounded-3xl sm:rounded-[48px] ${isCompactDevice ? 'p-4 sm:p-6' : 'p-6 sm:p-10 md:p-14'} border border-white/90 shadow-2xl backdrop-blur-sm min-h-[360px] sm:min-h-[500px] max-h-full flex flex-col animate-fade-up`}>
              
              {isFeatureEnabled === null ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-600 text-lg">Loading...</p>
                </div>
              ) : step === 'welcome' && (
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="relative mb-6 sm:mb-10 group">
                    <div className="absolute -inset-4 bg-[#1A3263]/10 rounded-[40px] blur-2xl group-hover:bg-[#1A3263]/20 transition-all" />
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[32px] bg-white shadow-2xl flex items-center justify-center p-4 sm:p-6 border border-gray-50">
                      <img src={evsLogo} alt="EVS Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A3263] mb-4 sm:mb-6 tracking-tight">
                    Professional Visitor <br /> <span className="text-gray-400">Management</span>
                  </h1>
                  
                  <p className="text-gray-800 text-lg sm:text-xl max-w-xl mb-8 sm:mb-12 leading-relaxed font-medium">
                    Secure your workspace with our modern, contactless electronic registration system.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10 sm:mb-16 w-full max-w-2xl">
                    <div className="flex-1 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-md flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1A3263]/5 flex items-center justify-center text-[#1A3263]">
                        <FaClock size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] sm:text-[10px] font-black text-[#1A3263] uppercase tracking-widest">Efficiency</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-700">~2 Min Process</p>
                      </div>
                    </div>
                    <div className="flex-1 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-md flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FaCheckCircle size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Security</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-700">Verified Identity</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep('details')}
                    className="bg-[#1A3263] text-white px-10 py-4 sm:px-16 sm:py-5 rounded-full text-lg sm:text-xl font-black shadow-[0_20px_40px_rgba(26,50,99,0.3)] flex items-center gap-4 hover:translate-y-[-4px] transition-all hover:shadow-[0_25px_50px_rgba(26,50,99,0.4)] active:scale-95"
                  >
                    Get Started <FaArrowRight />
                  </Button>
                </div>
              )}

              {step === 'details' && (
                <div className="h-full flex flex-col">
                  <div className="mb-6 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1A3263] mb-2">Personal Details</h2>
                    <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em]">Identity Information</p>
                  </div>

                  {/* Two sections (Left / Right) - keep everything visible for kiosk */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-auto">
                    <div className="min-h-0 flex flex-col">
                      <div className="bg-white/70 rounded-3xl sm:rounded-[40px] border border-white/80 shadow-sm h-full p-5 sm:p-7 overflow-hidden">
                        <div className="h-full flex flex-col">
                          <div className="space-y-5 sm:space-y-7 flex-1 min-h-0 overflow-hidden">
                            <div className="group">
                              <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60 group-focus-within:opacity-100 transition-opacity">Full Legal Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={visitorForm.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] focus:bg-white outline-none transition-all text-sm font-bold bg-white text-[#1A3263] placeholder:text-gray-400 shadow-sm"
                                placeholder="John Doe"
                              />
                            </div>

                            <div className="group">
                              <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60 group-focus-within:opacity-100 transition-opacity">Organization / Company</label>
                              <input
                                type="text"
                                value={visitorForm.visitorCompany}
                                onChange={(e) => handleInputChange('visitorCompany', e.target.value)}
                                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] focus:bg-white outline-none transition-all text-sm font-bold bg-white text-[#1A3263] placeholder:text-gray-400 shadow-sm"
                                placeholder="Acme Corp"
                              />
                            </div>

                            <div className="group">
                              <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60 group-focus-within:opacity-100 transition-opacity">Email Address</label>
                              <input
                                type="email"
                                value={visitorForm.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] focus:bg-white outline-none transition-all text-sm font-bold bg-white text-[#1A3263] placeholder:text-gray-400 shadow-sm"
                                placeholder="john@acme.com"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="group">
                                <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60">ID Proof Type</label>
                                <select
                                  value={visitorForm.idProofType}
                                  onChange={(e) => handleInputChange('idProofType', e.target.value)}
                                  className="w-full px-5 py-3.5 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-[24px] text-sm font-black text-[#1A3263] bg-white focus:border-[#1A3263] outline-none transition-all shadow-sm"
                                >
                                  <option value="NATIONAL_ID">National ID</option>
                                  <option value="Passport">Passport</option>
                                  <option value="Driving License">Driving License</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="group">
                                <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60">ID Number</label>
                                <input
                                  type="text"
                                  value={visitorForm.idNumber}
                                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                                  className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] focus:bg-white outline-none transition-all text-sm font-bold bg-white text-[#1A3263] placeholder:text-gray-400 shadow-sm"
                                  placeholder="Enter ID #"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="min-h-0 flex flex-col">
                      <div className="bg-white/70 rounded-3xl sm:rounded-[40px] border border-white/80 shadow-sm h-full p-5 sm:p-7 overflow-hidden">
                        <div className="h-full flex flex-col">
                          <div className="space-y-5 sm:space-y-7 flex-1 min-h-0 overflow-hidden">
                            <div className="group">
                              <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60 group-focus-within:opacity-100 transition-opacity">Contact Number <span className="text-red-500">*</span></label>
                              <div className="flex gap-2 sm:gap-4">
                                <select
                                  value={phoneCountryCode}
                                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                                  className="px-3 py-3.5 sm:px-5 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-black text-[#1A3263] bg-white focus:border-[#1A3263] outline-none transition-all cursor-pointer shadow-sm"
                                >
                                  {countryCodes.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                                </select>
                                <input
                                  type="tel"
                                  value={visitorForm.mobile}
                                  onChange={(e) => { handleInputChange('mobile', e.target.value); phoneValidation.validateDebounced(e.target.value) }}
                                  className="flex-1 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] focus:bg-white outline-none transition-all text-sm font-bold bg-white text-[#1A3263] placeholder:text-gray-400 shadow-sm"
                                  placeholder="7XX XXX XXX"
                                />
                              </div>
                              {phoneValidation.status !== 'idle' && (
                                <div className={`flex items-center gap-2 mt-2 font-black text-[9px] sm:text-[10px] uppercase tracking-widest ${phoneValidation.status === 'valid' ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {phoneValidation.status === 'valid' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                  {phoneValidation.message}
                                </div>
                              )}
                            </div>

                            <div className="group">
                              <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-3 sm:mb-4 uppercase tracking-widest opacity-60">Visitor Category</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                {(['Guests', 'Contractors', 'Interviews'] as VisitorType[]).map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setVisitorType(type)}
                                    className={`py-3.5 sm:py-4 rounded-xl sm:rounded-[20px] border-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                                      visitorType === type
                                        ? 'border-[#1A3263] bg-[#1A3263] text-white shadow-lg'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:text-[#1A3263] shadow-sm'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="group">
                              <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60">Department</label>
                              <div className="relative">
                                <select
                                  value={visitorForm.department}
                                  onChange={(e) => handleInputChange('department', e.target.value)}
                                  className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] outline-none transition-all text-sm font-black bg-white appearance-none text-[#1A3263] shadow-sm"
                                >
                                  <option>ICT</option>
                                  <option>HR</option>
                                  <option>Finance</option>
                                  <option>Operations</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                  <FaArrowRight className="rotate-90 text-[10px]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formError && <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl sm:rounded-[24px] bg-red-50 border border-red-100 text-red-600 text-[10px] sm:text-[12px] font-black uppercase tracking-widest flex items-center gap-3"><FaExclamationTriangle /> {formError}</div>}

                  <div className="flex justify-end mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-gray-100">
                    <Button
                      onClick={() => setStep('photo')}
                      disabled={!isDetailsValid}
                      className="w-full sm:w-auto bg-[#1A3263] text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full flex items-center justify-center gap-3 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Continue Registration <FaArrowRight />
                    </Button>
                  </div>
                </div>
              )}

              {step === 'photo' && (
                <div className="h-full flex flex-col">
                  <div className="mb-6 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1A3263] mb-2">Biometric Verification</h2>
                    <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em]">Identity Confirmation</p>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 flex-1">
                     <div className={`lg:w-7/12 relative group kiosk-video-frame ${isLandscapeHandheld ? 'lg:w-1/2' : ''}`}>
                       <div className="rounded-2xl sm:rounded-[40px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-4 sm:border-[8px] border-white relative aspect-video bg-gray-100 flex items-center justify-center">
                        <FaceCapture
                          autoCapture
                          onCapture={async (dataUrl) => {
                            setIsCameraReady(true)
                            try {
                              const url = await uploadToCloudinary(dataUrl)
                              setVisitorForm((prev) => ({ ...prev, profilePhoto: url }))
                            } catch { setVisitorForm((prev) => ({ ...prev, profilePhoto: dataUrl })) }
                          }}
                        />
                        {/* Camera focus overlay */}
                        <div className="absolute inset-6 sm:inset-10 border-2 border-white/20 rounded-2xl sm:rounded-[32px] pointer-events-none flex items-center justify-center">
                          <div className="w-32 h-32 sm:w-48 sm:h-48 border-2 border-emerald-400/50 rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-ping" /> Live
                      </div>
                    </div>

                    <div className="lg:w-5/12 flex flex-col">
                      <div className="bg-[#1A3263]/5 rounded-2xl sm:rounded-[32px] p-6 sm:p-8 border border-[#1A3263]/10 mb-6 sm:mb-10 flex-1">
                        <h4 className="text-[10px] sm:text-[11px] font-black text-[#1A3263] uppercase tracking-[0.25em] mb-4 sm:mb-6">Quality Guidelines</h4>
                        <ul className="space-y-4 sm:space-y-6">
                          <li className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 font-bold leading-relaxed">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg sm:rounded-xl bg-white text-[#1A3263] flex items-center justify-center text-[8px] sm:text-[10px] font-black shrink-0 shadow-sm">01</div>
                            Position your face within the digital circular guide.
                          </li>
                          <li className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 font-bold leading-relaxed">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg sm:rounded-xl bg-white text-[#1A3263] flex items-center justify-center text-[8px] sm:text-[10px] font-black shrink-0 shadow-sm">02</div>
                            Maintain a neutral expression in good lighting.
                          </li>
                          <li className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 font-bold leading-relaxed">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg sm:rounded-xl bg-white text-[#1A3263] flex items-center justify-center text-[8px] sm:text-[10px] font-black shrink-0 shadow-sm">03</div>
                            Ensure clear visibility (no sunglasses/headwear).
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4 sm:space-y-5">
                        <label className="w-full flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-white hover:bg-gray-50 text-[#1A3263] rounded-xl sm:rounded-[24px] border-2 border-gray-100 transition-all cursor-pointer font-black text-[10px] sm:text-[12px] uppercase tracking-widest shadow-sm hover:shadow-xl group">
                          <FaCamera className="group-hover:scale-125 transition-transform" /> 
                          Manual Capture / Upload
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCaptureFile(f) }} />
                        </label>
                        {visitorForm.profilePhoto && (
                          <div className="flex items-center gap-3 text-emerald-600 font-black justify-center text-[9px] sm:text-[11px] uppercase tracking-widest bg-emerald-50 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-emerald-100">
                            <FaCheckCircle /> Biometric Data Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-gray-100">
                    <button onClick={() => setStep('details')} className="flex items-center gap-2 sm:gap-3 text-gray-400 font-black uppercase tracking-widest text-[9px] sm:text-[11px] hover:text-[#1A3263] transition-colors"><FaArrowLeft /> Back</button>
                    <Button onClick={() => setStep('host')} disabled={!isCameraReady} className="bg-[#1A3263] text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full flex items-center gap-3 shadow-xl disabled:opacity-30">Confirm & Next <FaArrowRight /></Button>
                  </div>
                </div>
              )}

              {step === 'host' && (
                <div className="h-full flex flex-col">
                  <div className="mb-6 sm:mb-10 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1A3263] mb-2">Host Selection</h2>
                    <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em]">Meeting Appointment Details</p>
                  </div>

                  <div className="max-w-3xl mx-auto w-full space-y-6 sm:space-y-10 flex-1">
                    <div className="group">
                      <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-3 sm:mb-4 uppercase tracking-widest opacity-60">Search Professional <span className="text-red-500">*</span></label>
                      <div className="relative mb-4 sm:mb-6">
                        <FaSearch className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A3263] transition-colors" />
                        <input
                          type="text"
                          value={hostSearch}
                          onChange={(e) => setHostSearch(e.target.value)}
                          placeholder="Search by full name, department..."
                          className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 border-2 border-gray-50 rounded-2xl sm:rounded-[32px] focus:border-[#1A3263] focus:bg-white outline-none transition-all text-sm font-bold bg-white text-[#1A3263] shadow-sm"
                        />
                      </div>
                      
                      <div className="max-h-48 sm:max-h-64 overflow-y-auto rounded-2xl sm:rounded-[32px] border-2 border-gray-50 bg-white shadow-xl custom-scrollbar p-2">
{hostsFiltered.length > 0 ? (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                             {hostsFiltered.map((h) => (
                               <button
                                 key={h.id}
                                 onClick={() => handleHostSelect(h)}
                                 className={`px-4 py-3 sm:px-6 sm:py-5 rounded-xl sm:rounded-[24px] text-left flex items-center justify-between border-2 transition-all ${
                                   visitorForm.hostName === h.fullName 
                                     ? 'border-[#1A3263] bg-[#1A3263] text-white shadow-md' 
                                     : 'border-transparent bg-gray-50/50 hover:bg-gray-100 text-gray-700'
                                 }`}
                                >
                                <div className="flex flex-col">
                                  <span className="text-xs sm:text-sm font-black">{h.fullName}</span>
                                  <span className={`text-[8px] sm:text-[9px] uppercase tracking-widest font-black ${visitorForm.hostName === h.fullName ? 'text-white/70' : 'text-gray-400'}`}>
                                    {h.department || 'Staff'}
                                  </span>
                                </div>
                                {visitorForm.hostName === h.fullName && <FaCheckCircle className="text-white shrink-0" />}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 sm:p-10 text-center flex flex-col items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                              <FaUserTie size={24} className="sm:size-[32px]" />
                            </div>
                            <p className="text-gray-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">No matching profiles</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      <div className="group">
                        <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60">Purpose of Visit</label>
                        <input 
                          type="text" 
                          value={visitorForm.purpose} 
                          onChange={(e) => handleInputChange('purpose', e.target.value)} 
                          className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] border-2 border-gray-100 focus:border-[#1A3263] outline-none transition-all text-sm font-bold bg-white text-[#1A3263] shadow-sm" 
                          placeholder="e.g. Technical Consultation" 
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60">Date</label>
                          <input type="date" value={visitorForm.date} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-black bg-white text-[#1A3263] shadow-sm" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] sm:text-[11px] font-black text-[#1A3263] mb-2 sm:mb-3 uppercase tracking-widest opacity-60">Time</label>
                          <input type="time" value={visitorForm.time} onChange={(e) => handleInputChange('time', e.target.value)} className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-black bg-white text-[#1A3263] shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-gray-100">
                    <button onClick={() => setStep('photo')} className="flex items-center gap-2 sm:gap-3 text-gray-400 font-black uppercase tracking-widest text-[9px] sm:text-[11px] hover:text-[#1A3263] transition-colors"><FaArrowLeft /> Identity</button>
                    <Button onClick={() => setStep('confirmation')} disabled={!isHostValid} className="bg-[#1A3263] text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full flex items-center gap-3 shadow-xl disabled:opacity-30">Review Summary <FaArrowRight /></Button>
                  </div>
                </div>
              )}

              {step === 'confirmation' && (
                <div className="animate-fade-up h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black text-[#1A3263] mb-2 flex items-center gap-3 sm:gap-4">
                        {badge && <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><FaCheck size={14} className="sm:size-[16px]" /></div>}
                        {badge ? 'Entry Authorized' : 'Final Verification'}
                      </h2>
                      <p className="text-gray-700 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em]">{badge ? 'Welcome to our facility' : 'Review your registration'}</p>
                    </div>
                    {badge && (
                      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                        <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Pass Issued</p>
                        <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 sm:px-6 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black border border-emerald-100 shadow-sm">
                          {badge.badgeId}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 flex-1">
                    <div className="space-y-6 sm:space-y-10">
                      <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 shadow-3xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#1A3263]/5 rounded-bl-[80px] sm:rounded-bl-[100px] transition-all group-hover:scale-110" />
                        
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 sm:mb-10 text-center sm:text-left">
                          {visitorForm.profilePhoto ? (
                            <img src={visitorForm.profilePhoto} alt="Visitor" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[32px] object-cover border-[4px] sm:border-[6px] border-white shadow-2xl rotate-[-2deg]" />
                          ) : (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[32px] bg-gray-50 border-[4px] sm:border-[6px] border-white shadow-2xl flex items-center justify-center">
                              <FaUserTie className="text-gray-200 text-4xl sm:text-5xl" />
                            </div>
                          )}
                          <div>
                            <p className="text-[9px] sm:text-[10px] font-black text-[#1A3263] uppercase tracking-widest mb-1 sm:mb-2 opacity-50">Authorized Visitor</p>
                            <p className="text-xl sm:text-3xl font-black text-gray-900 leading-tight">{visitorForm.fullName}</p>
                            <p className="text-sm sm:text-md font-bold text-gray-500 mt-1">{visitorForm.visitorCompany || 'Direct Guest'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-8 gap-x-4 sm:gap-x-6">
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                            <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                            <p className="text-xs sm:text-sm font-black text-[#1A3263]">{visitorType}</p>
                          </div>
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                            <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                            <p className="text-xs sm:text-sm font-black text-[#1A3263]">{visitorForm.mobile}</p>
                          </div>
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                            <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Host</p>
                            <p className="text-xs sm:text-sm font-black text-[#1A3263]">{visitorForm.hostName}</p>
                          </div>
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                            <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dept</p>
                            <p className="text-xs sm:text-sm font-black text-[#1A3263]">{visitorForm.department}</p>
                          </div>
                        </div>
                      </div>

                      {!badge && (
                        <div className="p-6 sm:p-8 bg-emerald-50 rounded-2xl sm:rounded-[32px] border border-emerald-100 flex items-start gap-4 sm:gap-5 shadow-sm">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                            <FaInfoCircle size={20} className="sm:size-[24px]" />
                          </div>
                          <p className="text-xs sm:text-sm text-emerald-800 font-bold leading-relaxed">
                            Verification Complete. By confirming, you agree to our security protocols.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      {badge ? (
                        <div className="w-full max-w-sm space-y-8 sm:space-y-10 animate-fade-up">
                          <div className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-[6px] sm:border-[10px] border-[#1A3263]/5 relative flex flex-col items-center kiosk-qr-card">
                            <BadgeQr value={badge.badgeId} size={kioskDevice.width < 640 ? 180 : 250} caption={`ID: ${badge.badgeId}`} />
                            <div className="mt-6 sm:mt-10 text-center">
                              <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6" />
                              <p className="text-[9px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Authorized Digital ID</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                            <button
                              onClick={() => window.print()}
                              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 bg-white border-2 border-gray-100 text-gray-700 rounded-xl sm:rounded-[24px] font-black uppercase text-[10px] sm:text-[11px] tracking-widest hover:bg-gray-50 shadow-sm"
                            >
                              <FaPrint /> Print Pass
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(badge.badgeId)}`
                                link.download = `badge-${badge.badgeId}.png`
                                link.click()
                              }}
                              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 bg-[#1A3263]/10 text-[#1A3263] rounded-xl sm:rounded-[24px] font-black uppercase text-[10px] sm:text-[11px] tracking-widest hover:bg-[#1A3263]/20 shadow-sm"
                            >
                              <FaDownload /> Download
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-8 sm:p-12 space-y-6 sm:space-y-8 bg-white/60 rounded-3xl sm:rounded-[48px] border border-white/80 shadow-inner w-full max-w-sm">
                          <div className="relative">
                            <div className="absolute inset-0 bg-[#1A3263]/10 rounded-full blur-3xl animate-pulse" />
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center mx-auto border-[4px] sm:border-[6px] border-white shadow-2xl">
                              <FaCalendarCheck className="text-[#1A3263] text-4xl sm:text-5xl" />
                            </div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <p className="text-xl sm:text-2xl font-black text-[#1A3263]">Ready for Arrival?</p>
                            <p className="text-xs sm:text-sm text-gray-700 font-bold max-w-xs mx-auto leading-relaxed">
                              Double-check your information. Your digital entry pass will be generated immediately.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {formError && <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl sm:rounded-[24px] bg-red-50 border border-red-100 text-red-600 text-[10px] sm:text-[12px] font-black uppercase tracking-widest flex items-center gap-3"><FaExclamationTriangle /> {formError}</div>}

                  <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-gray-100 gap-4">
                    {!badge ? (
                      <>
                        <button 
                          onClick={() => { setBadge(null); setStep('host') }} 
                          disabled={formLoading}
                          className="flex items-center justify-center gap-3 text-gray-500 font-black uppercase tracking-widest text-[9px] sm:text-[11px] hover:text-[#1A3263] transition-colors disabled:opacity-30 order-2 sm:order-1"
                        >
                          <FaArrowLeft /> Edit Record
                        </button>
                        <Button 
                          onClick={handleSubmit} 
                          disabled={formLoading || !canSubmit} 
                          className="bg-emerald-500 text-white px-8 sm:px-16 py-4 sm:py-5 rounded-full flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-600 transition-all font-black text-sm sm:text-md order-1 sm:order-2"
                        >
                          {formLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaCheckCircle size={20} />}
                          {formLoading ? 'Verifying...' : 'Authorize Check-in'}
                        </Button>
                      </>
                    ) : (
                      <div className="w-full">
                        <Button 
                          onClick={resetAll} 
                          className="w-full bg-[#1A3263] text-white py-5 sm:py-6 rounded-full flex items-center justify-center gap-3 sm:gap-4 shadow-xl hover:scale-[1.01] transition-all font-black text-lg sm:text-xl"
                        >
                          <FaRedo /> Complete & New Registration
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REFINED TIMEOUT OVERLAY */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 bg-[#1A3263]/50 backdrop-blur-2xl flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[56px] p-8 sm:p-12 max-w-lg w-full shadow-[0_60px_120px_rgba(0,0,0,0.3)] animate-fade-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px]" />
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-8">
              <FaExclamationTriangle className="text-orange-500 text-4xl" />
            </div>
            <h3 className="text-3xl font-black text-[#1A3263] mb-4">Security Timeout</h3>
            <p className="text-gray-700 mb-10 text-lg leading-relaxed font-bold">
              For your privacy, this station will reset in <span className="text-orange-600 font-black tabular-nums">10 seconds</span>. Would you like to continue your session?
            </p>
            <div className="flex flex-col gap-5">
              <Button
                onClick={() => {
                  setShowTimeoutWarning(false)
                  if (warningTimeoutRef.current) {
                    window.clearTimeout(warningTimeoutRef.current)
                    warningTimeoutRef.current = null
                  }
                }}
                className="w-full bg-[#1A3263] text-white py-5 rounded-full font-black text-lg shadow-xl hover:translate-y-[-2px] transition-all"
              >
                Keep Registering
              </Button>
              <button
                onClick={resetAll}
                className="w-full py-5 bg-gray-50 text-gray-400 rounded-full font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-colors"
              >
                Reset Station Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
