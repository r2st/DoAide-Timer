import { describe, it, expect, beforeEach } from 'vitest'
import { recordSession, getTodayStats, getWeekData, getTotalStats, getStreak } from '../utils/stats'

describe('stats', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('records a session and retrieves today stats', () => {
    recordSession(25)
    const today = getTodayStats()
    expect(today.minutes).toBe(25)
    expect(today.sessions).toBe(1)
  })

  it('accumulates multiple sessions', () => {
    recordSession(25)
    recordSession(25)
    recordSession(15)
    const today = getTodayStats()
    expect(today.minutes).toBe(65)
    expect(today.sessions).toBe(3)
  })

  it('returns zero stats when no data', () => {
    const today = getTodayStats()
    expect(today.minutes).toBe(0)
    expect(today.sessions).toBe(0)
  })

  it('getWeekData returns 7 days', () => {
    const week = getWeekData()
    expect(week).toHaveLength(7)
    week.forEach(day => {
      expect(day).toHaveProperty('day')
      expect(day).toHaveProperty('date')
      expect(day).toHaveProperty('minutes')
      expect(day).toHaveProperty('sessions')
    })
  })

  it('getTotalStats aggregates all sessions', () => {
    recordSession(25)
    recordSession(30)
    const totals = getTotalStats()
    expect(totals.totalMinutes).toBe(55)
    expect(totals.totalSessions).toBe(2)
    expect(totals.days).toBe(1)
  })

  it('getStreak returns 0 when no data', () => {
    expect(getStreak()).toBe(0)
  })

  it('getStreak returns 1 after recording today', () => {
    recordSession(25)
    expect(getStreak()).toBe(1)
  })
})
