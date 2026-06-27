import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'


function safeStringify(obj: any) {
  try {
    return JSON.stringify(obj)
  } catch {
    return String(obj)
  }
}

type BadgeQrProps = {
  /** Content that will be encoded in the QR */
  value: any
  size?: number
  /** Optional caption */
  caption?: string
}


export default function BadgeQr({ value, size = 256, caption }: BadgeQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const payload = useMemo(() => {
    // Make QR stable for decoding and human debugging
    return typeof value === 'string' ? value : safeStringify(value)
  }, [value])

  useEffect(() => {
    let mounted = true

    QRCode.toDataURL(payload, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
      .then((url: string) => {
        if (!mounted) return
        setDataUrl(url)
      })
      .catch(() => {
        if (!mounted) return
        setDataUrl(null)
      })

    return () => {
      mounted = false
    }
  }, [payload, size])

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=520,height=720')
    if (!win) return

    const imgSrc = dataUrl || ''
    const captionText = caption || 'QR Code'

    win.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body{font-family:Arial, sans-serif; padding:24px; display:flex; flex-direction:column; align-items:center; gap:12px;}
            img{width:260px; height:260px;}
            .cap{font-size:14px; font-weight:600; color:#111; text-align:center;}
            @media print{ body{padding:0;} img{width:220px; height:220px;} }
          </style>
        </head>
        <body>
          <img src="${imgSrc}" alt="QR" />
          <div class="cap">${captionText}</div>
          <script>window.onload = () => { window.focus(); window.print(); };</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-72 h-72 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm">
        {dataUrl ? (
          <img src={dataUrl} alt="Badge QR" width={size} height={size} />
        ) : (
          <div className="text-sm text-gray-500">Generating QR…</div>
        )}
      </div>
      {caption && <div className="text-sm font-semibold text-gray-700 text-center">{caption}</div>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!dataUrl}
          onClick={handlePrint}
          className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Print
        </button>
        <a
          href={dataUrl || undefined}
          download={`evs-qr.png`}
          className="px-4 py-2 bg-[#1A3263] hover:bg-blue-800 text-white text-sm rounded disabled:opacity-50"
          style={{ textDecoration: 'none', opacity: dataUrl ? 1 : 0.5, pointerEvents: dataUrl ? 'auto' : 'none' }}
        >
          Download PNG
        </a>
      </div>
      {/* For future use */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

