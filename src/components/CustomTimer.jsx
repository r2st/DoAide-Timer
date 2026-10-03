import React, { useState, useCallback } from 'react'
import CircularTimer from './CircularTimer'
import { useTimer } from '../hooks/useTimer'
import { playCompletionSound } from '../utils/audio'
import { sendNotification } from '../utils/notifications'

function formatTime(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
  { label: '45 min', seconds: 2700 },
  { label: '1 hour', seconds: 3600 },
  { label: '2 hours', seconds: 7200 },
]

export default function CustomTimer() {
  const [inputH, setInputH] = useState(0)
  const [inputM, setInputM] = useState(5)
  const [inputS, setInputS] = useState(0)
  const [started, setStarted] = useState(false)

  const handleComplete = useCallback(() => {
    playCompletionSound()
    sendNotification('Timer complete!', 'Your countdown has finished.')
    setStarted(false)
  }, [])

  const timer = useTimer(inputM * 60, handleComplete)

  function handleStart() {
    const total = inputH * 3600 + inputM * 60 + inputS
    if (total <= 0) return
    timer.reset(total)
    setStarted(true)
    setTimeout(() => timer.start(), 50)
  }

  function handleReset() {
    timer.reset(0)
    setStarted(false)
  }

  function handlePreset(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    setInputH(h)
    setInputM(m)
    setInputS(s)
    timer.reset(seconds)
    setStarted(true)
    setTimeout(() => timer.start(), 50)
  }

  if (!started) {
    return (
      <div className="custom-timer">
        <h2>Custom Timer</h2>
        <div className="time-input-group">
          <div className="time-input-col">
            <input type="number" min="0" max="23" value={inputH} onChange={(e) => setInputH(Math.max(0, +e.target.value))} />
            <span>Hours</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-input-col">
            <input type="number" min="0" max="59" value={inputM} onChange={(e) => setInputM(Math.max(0, Math.min(59, +e.target.value)))} />
            <span>Minutes</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-input-col">
            <input type="number" min="0" max="59" value={inputS} onChange={(e) => setInputS(Math.max(0, Math.min(59, +e.target.value)))} />
            <span>Seconds</span>
          </div>
        </div>
        <button className="control-btn primary" onClick={handleStart}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          Start Timer
        </button>
        <div className="presets-grid">
          {PRESETS.map((p) => (
            <button key={p.seconds} className="preset-btn" onClick={() => handlePreset(p.seconds)}>{p.label}</button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="custom-timer">
      <h2>Custom Timer</h2>
      <CircularTimer
        progress={timer.progress}
        timeDisplay={formatTime(timer.remaining)}
        isRunning={timer.isRunning}
      />
      <div className="timer-controls">
        {!timer.isRunning ? (
          <button className="control-btn primary" onClick={timer.remaining > 0 ? timer.start : handleStart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            {timer.remaining > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button className="control-btn primary" onClick={timer.pause}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            Pause
          </button>
        )}
        <button className="control-btn" onClick={handleReset}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          Cancel
        </button>
      </div>
    </div>
  )
}
