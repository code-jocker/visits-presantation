import { useState, useEffect } from 'react'

type DeviceType = 'phone' | 'tablet' | 'desktop'
type Orientation = 'portrait' | 'landscape'

export interface KioskDeviceInfo {
  type: DeviceType
  orientation: Orientation
  width: number
  height: number
  isTouch: boolean
}

function getDeviceInfo(): KioskDeviceInfo {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  const height = typeof window !== 'undefined' ? window.innerHeight : 768

  let type: DeviceType = 'desktop'
  if (width < 640) {
    type = 'phone'
  } else if (width < 1024) {
    type = 'tablet'
  }

  const orientation: Orientation = height >= width ? 'portrait' : 'landscape'
  const isTouch = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0)

  return { type, orientation, width, height, isTouch }
}

function applyKioskDeviceVars(device: KioskDeviceInfo) {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  root.style.setProperty('--kiosk-vw', `${device.width}px`)
  root.style.setProperty('--kiosk-vh', `${device.height}px`)
  root.style.setProperty('--kiosk-safe-top', `${window.visualViewport?.offsetTop || 0}px`)
  root.style.setProperty('--kiosk-safe-bottom', `${window.visualViewport?.offsetTop || 0}px`)
  root.dataset.deviceType = device.type
  root.dataset.orientation = device.orientation
  root.dataset.inputMode = device.isTouch ? 'touch' : 'pointer'
}

export default function useKioskDevice(): KioskDeviceInfo {
  const [device, setDevice] = useState<KioskDeviceInfo>(() => getDeviceInfo())

  useEffect(() => {
    const handleResize = () => {
      const nextDevice = getDeviceInfo()
      applyKioskDeviceVars(nextDevice)
      setDevice(nextDevice)
    }

    applyKioskDeviceVars(getDeviceInfo())
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  return device
}
