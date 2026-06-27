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
  /** Whether to show action buttons inside the component */
  showActions?: boolean
}

export default function BadgeQr({ value, size = 256, caption, showActions = false }: BadgeQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const payload = useMemo(() => {
    return typeof value === 'string' ? value : safeStringify(value)
  }, [value])

  useEffect(() => {
    let mounted = true

    QRCode.toDataURL(payload, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H',
      // Some qrcode package versions don't type `color` in options.
      // Keep the runtime behavior but relax typing.
      color: {
        dark: '#1A3263',
        light: '#FFFFFF',
      },
    } as any)
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
    const captionText = caption || 'Security Pass'

    win.document.write(`
      <html>
        <head>
          <title>Security Pass - ${captionText}</title>
          <style>
            body { 
              font-family: 'Comfortaa', 'Inter', sans-serif; 
              padding: 40px; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              gap: 20px; 
              background: #fff;
            }
            .badge-container {
              border: 4px solid #1A3263;
              border-radius: 40px;
              padding: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: 0 30px 60px rgba(0,0,0,0.1);
            }
            img { width: 300px; height: 300px; margin-bottom: 20px; }
            .cap { 
              font-size: 20px; 
              font-weight: 900; 
              color: #1A3263; 
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 3px;
            }
            .footer {
              font-size: 11px;
              color: #999;
              margin-top: 20px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            @media print { 
              body { padding: 0; } 
              .badge-container { border: 2px solid #eee; box-shadow: none; } 
            }
          </style>
        </head>
        <body>
          <div class="badge-container">
            <img src="${imgSrc}" alt="QR" />
            <div class="cap">${captionText}</div>
            <div class="footer">Verified by EVS Digital Visitor System</div>
          </div>
          <script>window.onload = () => { window.focus(); window.print(); };</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="rounded-[40px] bg-white flex items-center justify-center p-6 shadow-xl border border-gray-50"
        style={{ width: size + 60, height: size + 60 }}
      >
        {dataUrl ? (
          <img 
            src={dataUrl} 
            alt="Badge QR" 
            width={size} 
            height={size} 
            className="rounded-2xl transition-all duration-700 hover:scale-110"
          />
        ) : (
          <div className="text-[10px] font-black text-gray-300 animate-pulse uppercase tracking-[0.3em]">Generating Pass…</div>
        )}
      </div>
      
      {caption && (
        <div className="text-[11px] font-black text-[#1A3263] text-center uppercase tracking-[0.25em] opacity-60">
          {caption}
        </div>
      )}

      {showActions && (
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            disabled={!dataUrl}
            onClick={handlePrint}
            className="px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            Print Pass
          </button>
          <a
            href={dataUrl || undefined}
            download={`badge-qr.png`}
            className="px-8 py-3 bg-[#1A3263] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:translate-y-[-2px] active:scale-95"
            style={{ textDecoration: 'none', opacity: dataUrl ? 1 : 0.5, pointerEvents: dataUrl ? 'auto' : 'none' }}
          >
            Download ID
          </a>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
