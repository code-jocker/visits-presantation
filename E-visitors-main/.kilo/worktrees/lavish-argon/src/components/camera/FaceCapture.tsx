import { useEffect, useRef, useState } from 'react'

type FaceCaptureProps = {
  /** Called with a captured frame as dataURL */
  onCapture: (dataUrl: string) => void
  /** Whether to auto-capture using face detection */
  autoCapture?: boolean
  /** Interval for detection to reduce CPU */
  detectionIntervalMs?: number
}

export default function FaceCapture({
  onCapture,
  autoCapture = true,
  detectionIntervalMs = 250,
}: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [streamActive, setStreamActive] = useState(false)
  const [faceDetectorSupported, setFaceDetectorSupported] = useState(false)
  const [capturing, setCapturing] = useState(false)

  const [manualCaptured, setManualCaptured] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false

    const start = async () => {
      try {
        const hasDetector = typeof (window as any).FaceDetector !== 'undefined'
        setFaceDetectorSupported(hasDetector)

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setStreamActive(true)
        }
      } catch {
        setStreamActive(false)
      }
    }

    start()

    return () => {
      cancelled = true
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const captureFrame = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)

    onCapture(dataUrl)
  }

  useEffect(() => {
    if (!autoCapture) return
    if (!faceDetectorSupported) return
    if (!streamActive) return

    const detector = new (window as any).FaceDetector({
      fastMode: true,
      maxDetectedFaces: 1,
    })

    let alive = true

    const detectLoop = async () => {
      if (!alive) return
      if (!videoRef.current) return

      const video = videoRef.current
      const w = video.videoWidth
      const h = video.videoHeight
      if (!w || !h) return

      try {
        const faces = await detector.detect(video)
        if (!faces || !faces.length) {
          setManualCaptured(false)
          return
        }

        const face = faces[0]
        const box = getAcceptBox(video)

        const intersects =
          face.boundingBox.x + face.boundingBox.width >= box.x &&
          face.boundingBox.x <= box.x + box.width &&
          face.boundingBox.y + face.boundingBox.height >= box.y &&
          face.boundingBox.y <= box.y + box.height

        const enoughSize = face.boundingBox.width >= box.width * 0.35

        if (intersects && enoughSize && !capturing) {
          setCapturing(true)
          setManualCaptured(true)
          captureFrame()
          setTimeout(() => setCapturing(false), 1000)
        }
      } catch {
        // ignore
      }
    }

    const id = window.setInterval(detectLoop, detectionIntervalMs)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [autoCapture, capturing, detectionIntervalMs, faceDetectorSupported, streamActive])

  const getAcceptBox = (video: HTMLVideoElement) => {
    // Define a centered accept box in video coordinates.
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480

    const boxWidth = w * 0.5
    const boxHeight = h * 0.45

    return {
      x: (w - boxWidth) / 2,
      y: h * 0.25,
      width: boxWidth,
      height: boxHeight,
    }
  }

  return (
    <div className="w-full">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video ref={videoRef} className="w-full h-72 object-cover" playsInline muted />

        {/* Accept box overlay in DOM coordinates */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 border-4 border-yellow-400 opacity-80 rounded-xl" style={{ transform: 'translateY(-12px)' }} />
        </div>

        {!faceDetectorSupported && (
          <div className="absolute left-0 right-0 bottom-0 bg-black/60 text-white text-xs p-2">
            Auto capture needs browser FaceDetector support. You can still capture manually.
          </div>
        )}

        {capturing && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-semibold">
            Capturing…
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-xs text-gray-600">
          {autoCapture && faceDetectorSupported ? 'Auto capture when face fits the box' : 'Manual capture mode'}
        </div>
        <button
          type="button"
          disabled={!streamActive || capturing}
          onClick={() => {
            setCapturing(true)
            captureFrame()
            setTimeout(() => setCapturing(false), 800)
          }}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Capture
        </button>
      </div>

      {manualCaptured && autoCapture && faceDetectorSupported && (
        <div className="mt-2 text-xs text-green-700">Captured!</div>
      )}
    </div>
  )
}

