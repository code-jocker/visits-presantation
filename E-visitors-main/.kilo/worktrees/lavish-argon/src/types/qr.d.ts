declare module 'qrcode' {
  const QRCode: {
    toDataURL: (
      text: string,
      options?: {
        width?: number
        margin?: number
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
      }
    ) => Promise<string>
  }

  export default QRCode
}

// Ensure this file is treated as a module for TS global augmentation
export {}


