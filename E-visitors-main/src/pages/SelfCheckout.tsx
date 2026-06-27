import { useEffect, useState, useRef, useCallback } from 'react'
import {
  FaQrcode,
  FaCheckCircle,
  FaArrowLeft,
  FaRedo,
  FaExclamationTriangle,
} from 'react-icons/fa'
import ScanQr, { type QrScanResult } from '../components/qr/ScanQr'
import BadgeQr from '../components/qr/BadgeQr'
import { visitorApi } from '../api/visitor'
import { useInactivityTimer } from '../hooks/useInactivityTimer'
import evsLogo from '../assets/logos/evs.png'
import bgImage from '../assets/images/nh.jpg'
import borderImage from '../assets/images/design.png'
import Button from '../components/ui/Button'
import Navbar from '../components/ui/navbar'

type CheckoutStep = 'welcome' | 'scan' | 'success'

export default function SelfCheckout() {
  const [step, setStep] = useState<CheckoutStep>('welcome')
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState<{
    badgeId: string
    fullName: string
    exitTime: string
  } | null>(null)
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const warningTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    visitorApi.getSystemFeatures().then((res) => {
      if (res.success && res.result) {
        setIsFeatureEnabled(res.result.selfCheckoutEnabled)
      } else {
        setIsFeatureEnabled(true)
      }
    }).catch(() => {
      setIsFeatureEnabled(true)
    })
  }, [])

  const resetAll = useCallback(() => {
    if (warningTimeoutRef.current) {
      window.clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
    setStep('welcome')
    setCheckoutError(null)
    setCheckoutSuccess(null)
    setShowTimeoutWarning(false)
  }, [])

  useInactivityTimer(() => {
    setShowTimeoutWarning(true)
    warningTimeoutRef.current = window.setTimeout(() => {
      resetAll()
    }, 10_000)
  }, 90_000)

  const handleQrResult = useCallback(async (result: QrScanResult) => {
    setCheckoutError(null)

    if (!result.raw) {
      setCheckoutError('Invalid QR code - no data found')
      return
    }

    try {
      const badgeId = result.raw.trim()
      const res = await visitorApi.publicCheckOut({ badgeId })

      if (res.success && res.result) {
        setCheckoutSuccess({
          badgeId: res.result.badgeId || badgeId,
          fullName: res.result.fullName || '',
          exitTime: new Date().toLocaleString()
        })
        setStep('success')
      } else {
        setCheckoutError(res.message || 'Check-out failed')
      }
    } catch (e) {
      const err = e as Error & { response?: { data?: { message?: string } } }
      const msg = err?.response?.data?.message || err?.message || 'Check-out failed'
      setCheckoutError(msg)
    }
  }, [setCheckoutError, setCheckoutSuccess, setStep])

  const proceedToScan = () => setStep('scan')

  return (
    <div
      className="w-full min-h-screen bg-gray-100 font-['Comfortaa']"
      style={{
        borderImage: `url(${borderImage}) 10 10 10 10 repeat`,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-[#1A3263]/15 backdrop-blur-[1px] z-0" />

      {/* MAIN CARD */}
      <div className="w-full sm:w-11/12 md:w-10/12 lg:w-8/12 h-auto min-h-[85vh] mx-2 sm:mx-4 rounded-2xl sm:rounded-[40px] shadow-3xl border border-white/40 relative bg-white/95 backdrop-blur-xl overflow-hidden flex flex-col z-10 my-4 sm:my-8">
        <Navbar hideLinks />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col relative custom-scrollbar">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A3263]/5 rounded-bl-[200px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1A3263]/5 rounded-tr-[150px] pointer-events-none" />

          {/* Top Scanning Bar */}
          {step !== 'success' && (
            <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 px-4 py-2 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mb-6 sm:mb-10 rounded-2xl sm:rounded-[24px] shadow-xl z-20">
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] sm:text-[12px] font-black text-[#1A3263] whitespace-nowrap tracking-[0.2em] uppercase">Self Checkout</span>
              </div>
            </div>
          )}

{/* STEP CONTENT */}
           <div className="flex-1 flex flex-col items-center justify-center z-20">
             <div className="w-full max-w-5xl bg-white/80 rounded-3xl sm:rounded-[48px] p-6 sm:p-10 md:p-14 border border-white/90 shadow-2xl backdrop-blur-sm min-h-[400px] sm:min-h-[500px] flex flex-col">
              
              {isFeatureEnabled === null ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-600 text-lg">Loading...</p>
                </div>
              ) : step === 'welcome' && (
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="relative mb-6 sm:mb-10 group">
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[32px] bg-white shadow-2xl flex items-center justify-center p-4 sm:p-6 border border-gray-50">
                      <img src={evsLogo} alt="EVS Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A3263] mb-4 sm:mb-6 tracking-tight">
                    Self Service <br /> <span className="text-gray-400">Check-out</span>
                  </h1>

                  <p className="text-gray-800 text-lg sm:text-xl max-w-xl mb-8 sm:mb-12 leading-relaxed font-medium">
                    Scan your QR code to check out securely. Your visit will be recorded upon departure.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10 sm:mb-16 w-full max-w-2xl">
                    <div className="flex-1 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-md flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FaQrcode size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Contactless</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-700">QR Code Scan</p>
                      </div>
                    </div>
                    <div className="flex-1 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-md flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FaCheckCircle size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Instant</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-700">Verification</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={proceedToScan}
                    className="bg-emerald-500 text-white px-10 py-4 sm:px-16 sm:py-5 rounded-full text-lg sm:text-xl font-black shadow-[0_20px_40px_rgba(26,50,99,0.3)] flex items-center gap-4 hover:translate-y-[-4px] transition-all hover:shadow-[0_25px_50px_rgba(26,50,99,0.4)] active:scale-95"
                  >
                    Scan QR Code <FaQrcode />
                  </Button>
                </div>
              )}

              {step === 'scan' && (
                <div className="h-full flex flex-col">
                  <div className="mb-6 sm:mb-10 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1A3263] mb-2">Scan Your QR Code</h2>
                    <p className="text-gray-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em]">For Check-out</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative mb-8">
                      <ScanQr
                        onResult={handleQrResult}
                        stopOnFirst={false}
                        className="w-full max-w-md"
                      />
                    </div>

                    {checkoutError && (
                      <div className="mt-6 p-4 sm:p-5 rounded-2xl sm:rounded-[24px] bg-red-50 border border-red-100 text-red-600 text-[10px] sm:text-[12px] font-black uppercase tracking-widest flex items-center gap-3">
                        <FaExclamationTriangle /> {checkoutError}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-gray-100">
                    <button
                      onClick={() => setStep('welcome')}
                      className="flex items-center gap-2 sm:gap-3 text-gray-400 font-black uppercase tracking-widest text-[9px] sm:text-[11px] hover:text-[#1A3263] transition-colors"
                    >
                      <FaArrowLeft /> Back
                    </button>
                  </div>
                </div>
              )}

              {step === 'success' && checkoutSuccess && (
                <div className="animate-fade-up h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black text-[#1A3263] mb-2 flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <FaCheckCircle size={14} className="sm:size-[16px]" />
                        </div>
                        Check-out Complete
                      </h2>
                      <p className="text-gray-700 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em]">Thank you for visiting</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center space-y-8 sm:space-y-10">
                    <div className="w-full max-w-sm space-y-8 sm:space-y-10 animate-fade-up">
                      <div className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-[6px] sm:border-[10px] border-emerald-500/5 relative flex flex-col items-center">
                        <BadgeQr value={checkoutSuccess.badgeId} size={window.innerWidth < 640 ? 180 : 250} caption={`Checked Out: ${checkoutSuccess.badgeId}`} />
                        <div className="mt-6 sm:mt-10 text-center">
                          <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6" />
                          <p className="text-[9px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Exit Recorded</p>
                        </div>
                      </div>

                      <div className="bg-emerald-50 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 border border-emerald-100">
                        <p className="text-center text-xs sm:text-sm text-emerald-800 font-bold">
                          Have a safe journey! Your departure at {checkoutSuccess.exitTime} has been recorded.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-gray-100 gap-4">
                    <div className="w-full">
                      <Button
                        onClick={resetAll}
                        className="w-full bg-emerald-500 text-white py-5 sm:py-6 rounded-full flex items-center justify-center gap-3 sm:gap-4 shadow-xl hover:scale-[1.01] transition-all font-black text-lg sm:text-xl"
                      >
                        <FaRedo /> New Check-out
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TIMEOUT OVERLAY */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 bg-[#1A3263]/50 backdrop-blur-2xl flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[56px] p-12 max-w-lg w-full shadow-[0_60px_120px_rgba(0,0,0,0.3)] animate-fade-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px]" />
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-8">
              <FaExclamationTriangle className="text-orange-500 text-4xl" />
            </div>
            <h3 className="text-3xl font-black text-[#1A3263] mb-4">Session Timeout</h3>
            <p className="text-gray-700 mb-10 text-lg leading-relaxed font-bold">
              This station will reset in <span className="text-orange-600 font-black tabular-nums">10 seconds</span> for security. Continue your session?
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
                Continue
              </Button>
              <button
                onClick={resetAll}
                className="w-full py-5 bg-gray-50 text-gray-400 rounded-full font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-colors"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}