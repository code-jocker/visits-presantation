const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

/** Resize + compress a base64 dataURL to a smaller JPEG blob */
function compressDataUrl(dataUrl: string, maxWidth = 640, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        quality,
      )
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export async function uploadToCloudinary(source: string | File): Promise<string> {
  const formData = new FormData()
  formData.append('upload_preset', UPLOAD_PRESET)

  if (source instanceof File) {
    formData.append('file', source)
  } else {
    // Convert base64 dataURL → compressed Blob before uploading
    const blob = await compressDataUrl(source)
    formData.append('file', blob, 'photo.jpg')
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    const msg = data?.error?.message || 'Cloudinary upload failed'
    console.error('[Cloudinary error]', msg, data)
    throw new Error(msg)
  }

  return data.secure_url as string
}
