import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with correct state', () => {
    const { result } = renderHook(() => useTimer(300))
    expect(result.current.remaining).toBe(300)
    expect(result.current.totalSeconds).toBe(300)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.progress).toBe(0)
  })

  it('starts and updates isRunning', () => {
    const { result } = renderHook(() => useTimer(60))
    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(true)
  })

  it('pauses the timer', () => {
    const { result } = renderHook(() => useTimer(60))
    act(() => { result.current.start() })
    act(() => { result.current.pause() })
    expect(result.current.isRunning).toBe(false)
  })

  it('resets to initial seconds', () => {
    const { result } = renderHook(() => useTimer(120))
    act(() => { result.current.start() })
    act(() => { result.current.reset() })
    expect(result.current.remaining).toBe(120)
    expect(result.current.isRunning).toBe(false)
  })

  it('resets to new seconds when provided', () => {
    const { result } = renderHook(() => useTimer(60))
    act(() => { result.current.reset(300) })
    expect(result.current.remaining).toBe(300)
    expect(result.current.totalSeconds).toBe(300)
  })

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useTimer(100))
    expect(result.current.progress).toBe(0)
  })

  it('does not start when remaining is 0', () => {
    const { result } = renderHook(() => useTimer(0))
    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(false)
  })
})
