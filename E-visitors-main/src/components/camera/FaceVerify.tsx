import { useEffect, useMemo, useState } from 'react'
import FaceCapture from './FaceCapture'
import { visitorApi } from '../../api/visitor'

type FaceVerifyState =
  | { status: 'idle' }
  | { status: 'loading'; message?: string }
  | { status: 'matched'; entityType?: string; fullName?: string; department?: string; profilePhoto?: string }
  | { status: 'not_matched'; message?: string }
  | { status: 'error'; message?: string }

type FaceVerifyProps = {
  apiKey?: string
  department?: string
  autoCapture?: boolean
  detectionIntervalMs?: number
  onVerified?: (payload: { fullName?: string; department?: string; entityType?: string }) => void
  onCapturedCheckIn?: () => Promise<void> | void
  resetKey?: number
}

export default function FaceVerify({
  apiKey,
  department,
  autoCapture,
  detectionIntervalMs,
  onVerified,
  onCapturedCheckIn,
  resetKey,
}: FaceVerifyProps) {

  const [state, setState] = useState<FaceVerifyState>({ status: 'idle' })

  useEffect(() => {
    if (resetKey !== undefined) {
      setState({ status: 'idle' })
    }
  }, [resetKey])

  const effectiveApiKey = useMemo(() => apiKey || import.meta.env.VITE_FACE_API_KEY || '', [apiKey])

  const handleCapture = async (dataUrl: string) => {
    if (!dataUrl) return

    // Prevent repeated parallel submissions if FaceCapture triggers multiple times.
    setState({ status: 'loading', message: 'Verifying face…' })

    try {
      const res = await visitorApi.faceVerify({
        apiKey: effectiveApiKey,
        faceImageBase64: dataUrl,
        department,
      })

      // API returns ServiceResponse; existing FE usage patterns expect .result.
      const result = res?.result

      if (result?.matched) {
        const entityType = result.entityType
        setState({
          status: 'matched',
          entityType,
          fullName: result.fullName,
          department: result.department,
          profilePhoto: result.profilePhoto,
        })

        onVerified?.({ fullName: result.fullName, department: result.department, entityType })

        await onCapturedCheckIn?.()
      } else {
        setState({ status: 'not_matched', message: 'No match found. Try again.' })
      }
    } catch (e) {
      let message = 'Face verification failed'
      if (e instanceof Error) {
        const errWithResponse = e as Error & { response?: { data?: { message?: string } } }
        message = errWithResponse.response?.data?.message || e.message
      }
      setState({ status: 'error', message })
    }
  }

  return (
    <div className="w-full">
      <FaceCapture
        onCapture={handleCapture}
        autoCapture={autoCapture ?? true}
        detectionIntervalMs={detectionIntervalMs ?? 300}
      />

      <div className="mt-2 text-sm">
        {state.status === 'idle' && <div className="text-gray-600">Align the face in the box to verify.</div>}
        {state.status === 'loading' && <div className="text-blue-700">{state.message || 'Verifying…'}</div>}
        {state.status === 'matched' && (
          <div className="text-green-700 font-medium">
            ✓ Face matched
            <div className="text-xs text-green-800 font-normal mt-1">
              {state.fullName ? `Name: ${state.fullName}` : null}
              {state.department ? ` • Dept: ${state.department}` : null}
            </div>
          </div>
        )}
        {state.status === 'not_matched' && <div className="text-red-700">{state.message || 'No match.'}</div>}
        {state.status === 'error' && <div className="text-red-700">{state.message || 'Error.'}</div>}
      </div>
    </div>
  )
}