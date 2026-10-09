import React, { useState, useRef, useCallback, useEffect } from 'react'
import { playCompletionSound, playTickSound } from '../utils/audio'
import { sendNotification, requestNotificationPermission } from '../utils/notifications'

const PRESETS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
]

const ALERT_OPTIONS = [
  { label: '1 min before', offset: 1 },
  { label: '5 min before', offset: 5 },
  { label: '10 min before', offset: 10 },
  { label: '15 min before', offset: 15 },
  { label: 'Halfway', offset: 'half' },
]

function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatCountdown(seconds) {
  if (seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function MeetingTimer() {
  const [duration, setDuration] = useState(30)
  const [customMin, setCustomMin] = useState(30)
  const [alerts, setAlerts] = useState([1, 5])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [firedAlerts, setFiredAlerts] = useState(new Set())
  const [overtime, setOvertime] = useState(false)
  const [showSetup, setShowSetup] = useState(true)

  const startRef = useRef(0)
  const baseRef = useRef(0)
  const rafRef = useRef(null)
  const durationMs = duration * 60 * 1000

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const tick = useCallback(() => {
    const now = Date.now()
    const currentElapsed = baseRef.current + (now - startRef.current)
    setElapsed(currentElapsed)

    const remainingSec = Math.max(0, Math.ceil((durationMs - currentElapsed) / 1000))
    const elapsedMin = currentElapsed / 60000

    setFiredAlerts(prev => {
      const next = new Set(prev)
      let changed = false

      alerts.forEach(offset => {
        const alertKey = `alert-${offset}`
        if (!next.has(alertKey)) {
          const alertAtMin = duration - offset
          if (alertAtMin > 0 && elapsedMin >= alertAtMin) {
            playTickSound()
            sendNotification(`${offset} minute${offset === 1 ? '' : 's'} remaining`, `Meeting ends in ${offset} minute${offset === 1 ? '' : 's'}`)
            next.add(alertKey)
            changed = true
          }
        }
      })

      if (!next.has('half')) {
        if (alerts.includes('half') && elapsedMin >= duration / 2) {
          playTickSound()
          sendNotification('Halfway through meeting', `${Math.round(duration / 2)} minutes remaining`)
          next.add('half')
          changed = true
        }
      }

      if (!next.has('end') && currentElapsed >= durationMs) {
        playCompletionSound()
        sendNotification('Meeting time is up!', `${duration} minute meeting has ended.`)
        next.add('end')
        changed = true
        setOvertime(true)
      }

      return changed ? next : prev
    })

    rafRef.current = requestAnimationFrame(tick)
  }, [durationMs, duration, alerts])

  function startMeeting() {
    setShowSetup(false)
    setIsRunning(true)
    setIsPaused(false)
    setElapsed(0)
    setFiredAlerts(new Set())
    setOvertime(false)
    baseRef.current = 0
    startRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  function pauseMeeting() {
    baseRef.current = baseRef.current + (Date.now() - startRef.current)
    cancelAnimationFrame(rafRef.current)
    setIsPaused(true)
  }

  function resumeMeeting() {
    startRef.current = Date.now()
    setIsPaused(false)
    rafRef.current = requestAnimationFrame(tick)
  }

  function endMeeting() {
    cancelAnimationFrame(rafRef.current)
    setIsRunning(false)
    setIsPaused(false)
    setShowSetup(true)
  }

  function toggleAlert(offset) {
    setAlerts(prev =>
      prev.includes(offset) ? prev.filter(a => a !== offset) : [...prev, offset]
    )
  }

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (isRunning && !isPaused) {
      const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000))
      if (overtime) {
        const ot = Math.floor((elapsed - durationMs) / 1000)
        document.title = `+${formatElapsed(ot * 1000)} OVERTIME | Meeting Timer`
      } else {
        document.title = `${formatCountdown(remaining)} | Meeting Timer`
      }
    } else {
      document.title = 'DoAide Timer — Free Pomodoro & Productivity Timer'
    }
  }, [elapsed, isRunning, isPaused, durationMs, overtime])

  if (showSetup) {
    return (
      <div className="meeting-timer">
        <h2>Meeting Timer</h2>
        <p className="meeting-subtitle">Set your meeting duration and get alerts before time runs out</p>

        <div className="meeting-presets">
          {PRESETS.map(p => (
            <button
              key={p.minutes}
              className={`preset-btn ${duration === p.minutes ? 'active' : ''}`}
              style={duration === p.minutes ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
              onClick={() => { setDuration(p.minutes); setCustomMin(p.minutes) }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="meeting-custom">
          <label>Custom duration (minutes):</label>
          <input
            type="number"
            min="1"
            max="480"
            value={customMin}
            onChange={e => {
              const v = Math.max(1, Math.min(480, +e.target.value))
              setCustomMin(v)
              setDuration(v)
            }}
            className="meeting-custom-input"
          />
        </div>

        <div className="meeting-alerts card">
          <h3>Alert me</h3>
          <div className="alert-options">
            {ALERT_OPTIONS.map(opt => (
              <button
                key={opt.offset}
                className={`alert-chip ${alerts.includes(opt.offset) ? 'active' : ''}`}
                onClick={() => toggleAlert(opt.offset)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button className="control-btn primary" onClick={startMeeting}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          Start Meeting ({duration} min)
        </button>
      </div>
    )
  }

  const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000))
  const progress = Math.min(1, elapsed / durationMs)
  const overtimeMs = overtime ? elapsed - durationMs : 0

  return (
    <div className="meeting-timer">
      <h2>Meeting Timer</h2>

      <div className="meeting-display">
        <div className={`meeting-remaining ${overtime ? 'overtime' : ''}`}>
          {overtime ? (
            <>
              <span className="meeting-overtime-label">OVERTIME</span>
              <span className="meeting-time-big">+{formatElapsed(overtimeMs)}</span>
            </>
          ) : (
            <>
              <span className="meeting-time-label">REMAINING</span>
              <span className="meeting-time-big">{formatCountdown(remaining)}</span>
            </>
          )}
        </div>

        <div className="meeting-progress-bar">
          <div
            className={`meeting-progress-fill ${overtime ? 'overtime' : ''}`}
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>

        <div className="meeting-elapsed">
          Elapsed: {formatElapsed(elapsed)} / {duration} min
        </div>

        <div className="meeting-alert-indicators">
          {alerts.map(offset => {
            const key = offset === 'half' ? 'half' : `alert-${offset}`
            const fired = firedAlerts.has(key)
            const label = offset === 'half' ? 'Halfway' : `${offset}m warning`
            return (
              <span key={key} className={`alert-indicator ${fired ? 'fired' : ''}`}>
                {fired ? '✓' : '○'} {label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="timer-controls">
        {isPaused ? (
          <button className="control-btn primary" onClick={resumeMeeting}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            Resume
          </button>
        ) : (
          <button className="control-btn primary" onClick={pauseMeeting}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            Pause
          </button>
        )}
        <button className="control-btn" onClick={endMeeting}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
          End Meeting
        </button>
      </div>
    </div>
  )
}
