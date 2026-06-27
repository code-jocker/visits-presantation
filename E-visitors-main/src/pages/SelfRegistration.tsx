import { useEffect, useState } from 'react'
import SelfRegistrationCard from '../components/SelfRegistrationCard'

export default function SelfRegistration() {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    import('../api/visitor').then(({ visitorApi }) => {
      visitorApi.getSystemFeatures().then((res) => {
        if (res.success && res.result) {
          setIsFeatureEnabled(res.result.selfRegistrationEnabled)
        } else {
          setIsFeatureEnabled(true)
        }
      }).catch(() => {
        setIsFeatureEnabled(true)
      })
    })
  }, [])

  if (isFeatureEnabled === null) {
    return (
<div className="self-registration-kiosk w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
<div className="self-registration-kiosk w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-gray-100">
      <SelfRegistrationCard showTopScanningBar />
    </div>
  )
}



