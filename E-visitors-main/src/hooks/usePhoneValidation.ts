import { useState, useCallback, useRef } from 'react'
import { validatePhoneWithNumverify } from '../api/phoneVerification'

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'error'

export function usePhoneValidation(countryCode: string) {
  const [status, setStatus] = useState<ValidationStatus>('idle')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const debounceRef = useRef<number | undefined>(undefined)

  const validate = useCallback(async (phoneNumber: string) => {
    const digits = phoneNumber.replace(/[^\d]/g, '')
    if (!digits.trim() || digits.length < 6) {
      setStatus('idle')
      return
    }

    setStatus('validating')
    
    try {
      const res = await validatePhoneWithNumverify({
        phone: `${countryCode}${digits}`,
        countryCode,
      })
      
      if (res.isValid) {
        setStatus('valid')
        setMessage('Valid phone number')
        return res.normalizedPhone
      } else {
        setStatus('invalid')
        setMessage('Invalid phone number')
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e?.message || 'Validation failed')
    }
  }, [countryCode])

  const validateDebounced = useCallback((phoneNumber: string, delayMs = 400) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    
    const digits = phoneNumber.replace(/[^\d]/g, '')
    if (digits.length >= 6 && digits.length <= 15) {
      debounceRef.current = window.setTimeout(() => validate(phoneNumber), delayMs)
    }
  }, [validate])

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage(undefined)
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
  }, [])

  return { status, message, validate, validateDebounced, reset }
}
