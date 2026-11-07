import { useEffect, useMemo, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'


export type QrScanResult = {
  raw: string
  parsed: any | null
}

type ScanQrProps = {
  onResult: (result: QrScanResult) => void
  /** Optional: stop scanning after first result */
  stopOnFirst?: boolean
  className?: string
}

export default function ScanQr({ onResult, stopOnFirst = true, className }: ScanQrProps) {
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const reader = useMemo(() => new BrowserMultiFormatReader(), [])

  useEffect(() => {
    let disposed = false

    const start = async () => {
      setError(null)
      setIsScanning(true)

      try {
        // @zxing expects an element id
        const elId = 'qr-scan-video-container'

        await reader.decodeFromVideoDevice(undefined as any, elId, (res) => {
          if (disposed) return
          if (!res) return

          const raw = res.getText()
          let parsed: any | null = null
          try {
            parsed = JSON.parse(raw)
          } catch {
            parsed = null
          }

          onResult({ raw, parsed })

          if (stopOnFirst) {
            // Best-effort stop. Different zxing versions expose different stop APIs.
            try { (reader as any).reset?.() } catch {}
            try { (reader as any).stopContinuousDecode?.() } catch {}
            try { (reader as any).stop?.() } catch {}
            setIsScanning(false)
          }
        })
      } catch (e: any) {
        setError(e?.message || 'Failed to access camera / scan QR')
        setIsScanning(false)
      }
    }

    start()

    return () => {
      disposed = true
      try { (reader as any).reset?.() } catch {}
      try { (reader as any).stop?.() } catch {}
    }
  }, [onResult, reader, stopOnFirst])

  return (
    <div className={className}>
      <div id="qr-scan-video-container" className="w-full relative rounded-lg overflow-hidden bg-black">
        {/* zxing will inject the video element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-yellow-400 opacity-80 rounded-xl" />
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-600">
        {error ? <div className="text-red-700">{error}</div> : isScanning ? 'Scanning… align the QR inside the box' : 'Ready'}
      </div>
    </div>
  )
}

