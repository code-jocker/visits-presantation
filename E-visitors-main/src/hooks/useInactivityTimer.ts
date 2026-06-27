import { useCallback, useEffect, useRef } from 'react'

export function useInactivityTimer(onTimeout: () => void, timeoutMs: number, enabled = true) {
  const timerRef = useRef<number | null>(null)
  const callbackRef = useRef(onTimeout)

  useEffect(() => {
    callbackRef.current = onTimeout
  }, [onTimeout])

  const resetTimer = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    if (enabled) {
      timerRef.current = window.setTimeout(() => callbackRef.current(), timeoutMs)
    }
  }, [timeoutMs, enabled])

  useEffect(() => {
    if (!enabled) return

    const events = ['mousemove', 'keydown', 'touchstart']
    events.forEach((evt) => window.addEventListener(evt, resetTimer))
    resetTimer()

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimer))
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [resetTimer, enabled])

  return resetTimer
}
