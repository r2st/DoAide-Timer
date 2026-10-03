import React, { useState, useRef, useCallback, useEffect } from 'react'

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const cs = Math.floor((ms % 1000) / 10)
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

function formatLapDiff(ms) {
  const s = Math.floor(ms / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m > 0) return `${m}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  return `${sec}.${String(cs).padStart(2, '0')}`
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startRef = useRef(0)
  const baseRef = useRef(0)
  const rafRef = useRef(null)

  const tick = useCallback(() => {
    setElapsed(baseRef.current + (Date.now() - startRef.current))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  function start() {
    startRef.current = Date.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }

  function pause() {
    baseRef.current = baseRef.current + (Date.now() - startRef.current)
    setIsRunning(false)
    cancelAnimationFrame(rafRef.current)
  }

  function reset() {
    cancelAnimationFrame(rafRef.current)
    baseRef.current = 0
    startRef.current = 0
    setElapsed(0)
    setIsRunning(false)
    setLaps([])
  }

  function lap() {
    const currentElapsed = baseRef.current + (Date.now() - startRef.current)
    const prevTotal = laps.length > 0 ? laps[0].total : 0
    setLaps((prev) => [{ total: currentElapsed, diff: currentElapsed - prevTotal }, ...prev])
  }

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const bestLap = laps.length > 1 ? Math.min(...laps.map((l) => l.diff)) : null
  const worstLap = laps.length > 1 ? Math.max(...laps.map((l) => l.diff)) : null

  return (
    <div className="stopwatch">
      <h2>Stopwatch</h2>
      <div className="stopwatch-display">{formatTime(elapsed)}</div>
      <div className="timer-controls">
        {!isRunning ? (
          <button className="control-btn primary" onClick={start}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            {elapsed > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <>
            <button className="control-btn primary" onClick={pause}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              Pause
            </button>
            <button className="control-btn" onClick={lap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
              Lap
            </button>
          </>
        )}
        {elapsed > 0 && !isRunning && (
          <button className="control-btn" onClick={reset}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1,4 1,10 7,10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            Reset
          </button>
        )}
      </div>

      {laps.length > 0 && (
        <div className="laps-list card">
          <div className="lap-header">
            <span>Lap</span>
            <span>Split</span>
            <span>Total</span>
          </div>
          {laps.map((l, i) => (
            <div
              key={i}
              className={`lap-row ${l.diff === bestLap ? 'best' : ''} ${l.diff === worstLap ? 'worst' : ''}`}
            >
              <span>#{laps.length - i}</span>
              <span>{formatLapDiff(l.diff)}</span>
              <span>{formatTime(l.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
