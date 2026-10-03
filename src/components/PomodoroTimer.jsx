import React, { useState, useCallback, useEffect, useRef } from 'react'
import CircularTimer from './CircularTimer'
import { useTimer } from '../hooks/useTimer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { playCompletionSound } from '../utils/audio'
import { sendNotification, requestNotificationPermission } from '../utils/notifications'
import { recordSession } from '../utils/stats'

const MODES = {
  focus: { label: 'Focus', defaultMin: 25 },
  shortBreak: { label: 'Short Break', defaultMin: 5 },
  longBreak: { label: 'Long Break', defaultMin: 15 },
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function PomodoroTimer() {
  const [settings, setSettings] = useLocalStorage('pomodoro-settings', {
    focus: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4, autoStart: false,
  })
  const [mode, setMode] = useState('focus')
  const [sessionCount, setSessionCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const autoStartRef = useRef(settings.autoStart)
  autoStartRef.current = settings.autoStart

  const handleComplete = useCallback(() => {
    playCompletionSound()
    if (mode === 'focus') {
      const durationMin = settings.focus
      recordSession(durationMin)
      sendNotification('Focus session complete!', `Great work! You focused for ${durationMin} minutes.`)
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      if (newCount % settings.longBreakInterval === 0) {
        switchMode('longBreak', newCount)
      } else {
        switchMode('shortBreak', newCount)
      }
    } else {
      sendNotification('Break is over!', 'Time to focus again.')
      switchMode('focus')
    }
  }, [mode, sessionCount, settings])

  const timer = useTimer(settings[mode] * 60, handleComplete)

  function switchMode(newMode, count) {
    setMode(newMode)
    const seconds = settings[newMode] * 60
    timer.reset(seconds)
    if (autoStartRef.current) {
      setTimeout(() => timer.start(), 100)
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    if (timer.isRunning) {
      document.title = `${formatTime(timer.remaining)} - ${MODES[mode].label} | DoAide Timer`
    } else {
      document.title = 'DoAide Timer — Free Pomodoro & Productivity Timer'
    }
  }, [timer.remaining, timer.isRunning, mode])

  const modeColors = {
    focus: 'var(--accent)',
    shortBreak: '#4ade80',
    longBreak: '#60a5fa',
  }

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-modes">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button
            key={key}
            className={`mode-btn ${mode === key ? 'active' : ''}`}
            style={mode === key ? { background: modeColors[key], color: '#fff' } : {}}
            onClick={() => { setMode(key); timer.reset(settings[key] * 60) }}
          >
            {label}
          </button>
        ))}
      </div>

      <CircularTimer
        progress={timer.progress}
        timeDisplay={formatTime(timer.remaining)}
        label={MODES[mode].label}
        isRunning={timer.isRunning}
        accentColor={modeColors[mode]}
      />

      <div className="timer-controls">
        {!timer.isRunning ? (
          <button className="control-btn primary" onClick={timer.start}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            Start
          </button>
        ) : (
          <button className="control-btn primary" onClick={timer.pause}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            Pause
          </button>
        )}
        <button className="control-btn" onClick={() => timer.reset()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1,4 1,10 7,10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
          Reset
        </button>
        <button className="control-btn" onClick={() => handleComplete()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,4 15,12 5,20" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
          Skip
        </button>
      </div>

      <div className="session-dots">
        {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
          <span
            key={i}
            className={`session-dot ${i < (sessionCount % settings.longBreakInterval) ? 'filled' : ''}`}
            style={i < (sessionCount % settings.longBreakInterval) ? { background: 'var(--accent)' } : {}}
          />
        ))}
        <span className="session-count">{sessionCount} sessions</span>
      </div>

      <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        Settings
      </button>

      {showSettings && (
        <div className="pomodoro-settings card">
          <h3>Timer Settings</h3>
          <div className="setting-row">
            <label>Focus (min)</label>
            <input type="number" min="1" max="120" value={settings.focus}
              onChange={(e) => { const v = +e.target.value; setSettings(s => ({ ...s, focus: v })); if (mode === 'focus') timer.reset(v * 60) }} />
          </div>
          <div className="setting-row">
            <label>Short Break (min)</label>
            <input type="number" min="1" max="30" value={settings.shortBreak}
              onChange={(e) => { const v = +e.target.value; setSettings(s => ({ ...s, shortBreak: v })); if (mode === 'shortBreak') timer.reset(v * 60) }} />
          </div>
          <div className="setting-row">
            <label>Long Break (min)</label>
            <input type="number" min="1" max="60" value={settings.longBreak}
              onChange={(e) => { const v = +e.target.value; setSettings(s => ({ ...s, longBreak: v })); if (mode === 'longBreak') timer.reset(v * 60) }} />
          </div>
          <div className="setting-row">
            <label>Long Break Interval</label>
            <input type="number" min="2" max="10" value={settings.longBreakInterval}
              onChange={(e) => setSettings(s => ({ ...s, longBreakInterval: +e.target.value }))} />
          </div>
          <div className="setting-row">
            <label>Auto-start next</label>
            <button
              className={`toggle-btn ${settings.autoStart ? 'on' : ''}`}
              onClick={() => setSettings(s => ({ ...s, autoStart: !s.autoStart }))}
            >{settings.autoStart ? 'ON' : 'OFF'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
