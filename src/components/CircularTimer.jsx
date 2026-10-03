import React from 'react'

const RADIUS = 120
const STROKE = 6
const SIZE = (RADIUS + STROKE) * 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CircularTimer({ progress, timeDisplay, label, isRunning, accentColor }) {
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="circular-timer">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={accentColor || 'var(--accent)'}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className={isRunning ? 'timer-ring-active' : ''}
        />
      </svg>
      <div className="circular-timer-content">
        {label && <div className="timer-label">{label}</div>}
        <div className="timer-display">{timeDisplay}</div>
      </div>
    </div>
  )
}
