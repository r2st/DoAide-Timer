import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer(initialSeconds, onComplete) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds)
  const [remaining, setRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const endTimeRef = useRef(null)

  const tick = useCallback(() => {
    const now = Date.now()
    const left = Math.max(0, Math.round((endTimeRef.current - now) / 1000))
    setRemaining(left)
    if (left <= 0) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setIsRunning(false)
      onComplete?.()
    }
  }, [onComplete])

  const start = useCallback(() => {
    if (intervalRef.current) return
    setRemaining((r) => {
      if (r <= 0) return r
      endTimeRef.current = Date.now() + r * 1000
      intervalRef.current = setInterval(tick, 200)
      setIsRunning(true)
      return r
    })
  }, [tick])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }, [])

  const reset = useCallback((newSeconds) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    const s = newSeconds ?? totalSeconds
    if (newSeconds !== undefined) setTotalSeconds(s)
    setRemaining(s)
    setIsRunning(false)
  }, [totalSeconds])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0

  return { remaining, totalSeconds, isRunning, progress, start, pause, reset, setTotalSeconds }
}
