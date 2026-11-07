import { useEffect, useRef, useState, useCallback } from 'react'
import * as faceDetection from '@tensorflow-models/face-detection'
import '@tensorflow/tfjs-backend-webgl'
import { FaCamera, FaExclamationTriangle, FaCheckCircle, FaLock } from 'react-icons/fa'

type CameraError = 'not-allowed' | 'not-available' | 'not-supported' | 'insecure-context' | 'hardware-error' | null

type FaceCaptureProps = {
  onCapture: (dataUrl: string) => void
  autoCapture?: boolean
  detectionIntervalMs?: number
  steadyThreshold?: number
}

export default function FaceCapture({
  onCapture,
  autoCapture = true,
  detectionIntervalMs = 300,
  steadyThreshold = 3,
}: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [streamActive, setStreamActive] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [cameraError, setCameraError] = useState<CameraError>(null)
  const [steadyCount, setSteadyCount] = useState(0)
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null)

  useEffect(() => {
    let cancelled = false
    faceDetection
      .createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector, {
        runtime: 'tfjs',
        maxFaces: 1,
      })
      .then((detector) => {
        if (!cancelled) {
          detectorRef.current = detector
          setModelReady(true)
        }
      })
      .catch(() => setModelReady(false))
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false

    // Check for secure context (Camera requires HTTPS or localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setCameraError('insecure-context')
      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('not-supported')
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return }
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play().then(() => setStreamActive(true)).catch(() => {})
        }
      })
      .catch((err: any) => {
        console.error('Camera Access Error:', err)
        if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          setCameraError('not-allowed')
        } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          setCameraError('not-available')
        } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
          setCameraError('hardware-error')
        } else {
          setCameraError('not-supported')
        }
        setStreamActive(false)
      })

    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    onCapture(canvas.toDataURL('image/jpeg', 0.85))
  }, [onCapture])

const getGuideBox = useCallback((vw: number, vh: number) => ({
    x: vw * 0.25,
    y: vh * 0.25,
    w: vw * 0.5,
    h: vh * 0.45,
  }), [])

  // Auto-detect loop
  useEffect(() => {
    if (!autoCapture || !modelReady || !streamActive || capturing) return

    let alive = true
    let consecutiveSteady = 0

    const detectLoop = async () => {
      if (!alive || !videoRef.current || !detectorRef.current) return
      const video = videoRef.current
      if (!video.videoWidth || !video.videoHeight) return

      try {
        const faces = await detectorRef.current.estimateFaces(video)
        const box = getGuideBox(video.videoWidth, video.videoHeight)

        if (!faces.length) {
          setSteadyCount(0)
          setCaptured(false)
          return
        }

        const { xMin, yMin, width, height } = faces[0].box

        const centered =
          xMin + width >= box.x && xMin <= box.x + box.w &&
          yMin + height >= box.y && yMin <= box.y + box.h

        const enoughSize = width >= box.w * 0.35

        if (centered && enoughSize) {
          consecutiveSteady++
          setSteadyCount(consecutiveSteady)
          if (consecutiveSteady >= steadyThreshold && !captured) {
            setCapturing(true)
            setCaptured(true)
            captureFrame()
            setTimeout(() => {
              setCapturing(false)
              setCaptured(false)
              consecutiveSteady = 0
              setSteadyCount(0)
            }, 1500)
          }
        } else {
          consecutiveSteady = 0
          setSteadyCount(0)
        }
      } catch { /* ignore */ }
    }

    const id = window.setInterval(detectLoop, detectionIntervalMs)
    return () => { alive = false; window.clearInterval(id) }
  }, [autoCapture, modelReady, streamActive, capturing, detectionIntervalMs, captureFrame, captured, steadyThreshold, getGuideBox])

  return (
    <div className="w-full">
      {cameraError ? (
        <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 h-80 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6 text-red-500">
              {cameraError === 'insecure-context' ? <FaLock size={32} /> : <FaExclamationTriangle size={32} />}
            </div>
            <p className="text-[#1A3263] text-lg font-black uppercase tracking-widest mb-2">
              {cameraError === 'not-allowed' ? 'Access Denied' : 
               cameraError === 'not-available' ? 'No Camera Found' :
               cameraError === 'insecure-context' ? 'HTTPS Required' :
               cameraError === 'hardware-error' ? 'Camera Busy' :
               'System Error'}
            </p>
            <p className="text-gray-400 text-sm font-bold max-w-xs mx-auto leading-relaxed">
              {cameraError === 'not-allowed' ? 'Please grant camera permissions in your browser to proceed.' :
               cameraError === 'not-available' ? 'We could not detect a camera. Please check your hardware connection.' :
               cameraError === 'insecure-context' ? 'Biometric features require a secure connection (HTTPS) or localhost. Please use a secure URL.' :
               cameraError === 'hardware-error' ? 'The camera is being used by another application. Please close other apps and retry.' :
               'Your current browser or device does not support the required biometric verification features.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl sm:rounded-[40px] overflow-hidden bg-black shadow-2xl border-4 border-white group">
          <video ref={videoRef} className="w-full h-80 object-cover" playsInline muted />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`border-2 border-emerald-400/50 rounded-full transition-all duration-500 ${captured ? 'scale-110 border-emerald-500 bg-emerald-500/10' : steadyCount >= steadyThreshold ? 'border-emerald-500 bg-emerald-500/10' : 'scale-100 animate-pulse'}`}
              style={{ width: '200px', height: '200px' }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
            </div>
          </div>

          {!modelReady && !cameraError && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#1A3263]/80 backdrop-blur-md text-white text-[10px] font-black p-3 text-center uppercase tracking-widest">
              Initializing Secure Verification System…
            </div>
          )}

          {capturing && (
            <div className="absolute inset-0 bg-[#1A3263]/60 backdrop-blur-sm flex flex-col items-center justify-center text-white font-black text-2xl uppercase tracking-[0.2em] animate-fade-up">
              <FaCheckCircle className="mb-4 text-emerald-400" size={48} />
              Identity Verified
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${cameraError ? 'bg-red-500' : modelReady ? steadyCount > 0 ? 'bg-emerald-500' : 'bg-gray-300' : 'bg-gray-300'}`} />
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {cameraError
              ? 'Security: Manual Mode'
              : modelReady
                ? steadyCount >= steadyThreshold
                  ? 'Face Ready - Capturing…'
                  : steadyCount > 0
                    ? `Aligning… (${steadyCount}/${steadyThreshold})`
                    : 'Biometric Auto-Capture Active'
                : 'System: Calibrating…'}
          </div>
        </div>
        {!cameraError && (
          <button
            type="button"
            disabled={!streamActive || capturing}
            onClick={() => {
              setCapturing(true)
              captureFrame()
              setTimeout(() => setCapturing(false), 1200)
            }}
            className="px-6 py-2.5 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A3263] hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <FaCamera /> Capture Manually
          </button>
        )}
      </div>

      {captured && autoCapture && !cameraError && (
        <div className="mt-3 text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2 justify-center">
          <FaCheckCircle /> Biometric Signature Recorded
        </div>
      )}
    </div>
  )
}
