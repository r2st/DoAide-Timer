import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('stores and retrieves a value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    act(() => { result.current[1]('new-value') })
    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(localStorage.getItem('test-key'))).toBe('new-value')
  })

  it('supports function updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))
    act(() => { result.current[1](prev => prev + 1) })
    expect(result.current[0]).toBe(1)
    act(() => { result.current[1](prev => prev + 5) })
    expect(result.current[0]).toBe(6)
  })

  it('handles object values', () => {
    const { result } = renderHook(() => useLocalStorage('obj', { a: 1 }))
    act(() => { result.current[1]({ a: 2, b: 3 }) })
    expect(result.current[0]).toEqual({ a: 2, b: 3 })
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('existing', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('existing', 'default'))
    expect(result.current[0]).toBe('stored-value')
  })
})
