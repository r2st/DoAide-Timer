import React, { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ALL_CITIES = [
  { name: 'New York', tz: 'America/New_York', flag: 'US' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles', flag: 'US' },
  { name: 'Chicago', tz: 'America/Chicago', flag: 'US' },
  { name: 'London', tz: 'Europe/London', flag: 'GB' },
  { name: 'Paris', tz: 'Europe/Paris', flag: 'FR' },
  { name: 'Berlin', tz: 'Europe/Berlin', flag: 'DE' },
  { name: 'Moscow', tz: 'Europe/Moscow', flag: 'RU' },
  { name: 'Dubai', tz: 'Asia/Dubai', flag: 'AE' },
  { name: 'Mumbai', tz: 'Asia/Kolkata', flag: 'IN' },
  { name: 'Singapore', tz: 'Asia/Singapore', flag: 'SG' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong', flag: 'HK' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', flag: 'JP' },
  { name: 'Seoul', tz: 'Asia/Seoul', flag: 'KR' },
  { name: 'Shanghai', tz: 'Asia/Shanghai', flag: 'CN' },
  { name: 'Sydney', tz: 'Australia/Sydney', flag: 'AU' },
  { name: 'Auckland', tz: 'Pacific/Auckland', flag: 'NZ' },
  { name: 'Sao Paulo', tz: 'America/Sao_Paulo', flag: 'BR' },
  { name: 'Cairo', tz: 'Africa/Cairo', flag: 'EG' },
  { name: 'Lagos', tz: 'Africa/Lagos', flag: 'NG' },
  { name: 'Johannesburg', tz: 'Africa/Johannesburg', flag: 'ZA' },
  { name: 'Istanbul', tz: 'Europe/Istanbul', flag: 'TR' },
  { name: 'Bangkok', tz: 'Asia/Bangkok', flag: 'TH' },
  { name: 'Toronto', tz: 'America/Toronto', flag: 'CA' },
  { name: 'Mexico City', tz: 'America/Mexico_City', flag: 'MX' },
]

const DEFAULT_CITIES = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Asia/Kolkata', 'Europe/Paris']

function getTimeForTz(tz) {
  const now = new Date()
  try {
    const time = now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    const date = now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' })
    const hour = parseInt(now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', hour12: false }))
    return { time, date, hour }
  } catch {
    return { time: '--:--', date: '', hour: 12 }
  }
}

function AnalogClock({ hour, minute, size = 80 }) {
  const center = size / 2
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90
  const minAngle = minute * 6 - 90
  const hourLen = size * 0.25
  const minLen = size * 0.35

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="analog-clock">
      <circle cx={center} cy={center} r={center - 2} fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" opacity="0.3" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const r1 = center - 6
        const r2 = center - 3
        return <line key={i} x1={center + r1 * Math.cos(angle)} y1={center + r1 * Math.sin(angle)} x2={center + r2 * Math.cos(angle)} y2={center + r2 * Math.sin(angle)} stroke="var(--text-secondary)" strokeWidth="1.5" opacity="0.5" />
      })}
      <line x1={center} y1={center} x2={center + hourLen * Math.cos(hourAngle * Math.PI / 180)} y2={center + hourLen * Math.sin(hourAngle * Math.PI / 180)} stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={center} y1={center} x2={center + minLen * Math.cos(minAngle * Math.PI / 180)} y2={center + minLen * Math.sin(minAngle * Math.PI / 180)} stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={center} cy={center} r="2.5" fill="var(--accent)" />
    </svg>
  )
}

export default function WorldClock() {
  const [selectedTzs, setSelectedTzs] = useLocalStorage('world-clock-cities', DEFAULT_CITIES)
  const [now, setNow] = useState(Date.now())
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const cities = ALL_CITIES.filter((c) => selectedTzs.includes(c.tz))
  const available = ALL_CITIES.filter((c) => !selectedTzs.includes(c.tz))

  function addCity(tz) {
    setSelectedTzs((prev) => [...prev, tz])
    setShowAdd(false)
  }

  function removeCity(tz) {
    setSelectedTzs((prev) => prev.filter((t) => t !== tz))
  }

  return (
    <div className="world-clock">
      <div className="world-clock-header">
        <h2>World Clock</h2>
        <button className="control-btn small" onClick={() => setShowAdd(!showAdd)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add City
        </button>
      </div>

      {showAdd && (
        <div className="city-picker card">
          {available.map((c) => (
            <button key={c.tz} className="city-pick-btn" onClick={() => addCity(c.tz)}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="clocks-grid">
        {cities.map((city) => {
          const { time, date, hour } = getTimeForTz(city.tz)
          const d = new Date()
          const minute = parseInt(d.toLocaleTimeString('en-US', { timeZone: city.tz, minute: 'numeric' }))
          const isDayTime = hour >= 6 && hour < 18
          return (
            <div key={city.tz} className={`clock-card card ${isDayTime ? 'daytime' : 'nighttime'}`}>
              <button className="remove-city" onClick={() => removeCity(city.tz)} title="Remove">x</button>
              <AnalogClock hour={hour} minute={minute} />
              <div className="clock-info">
                <div className="clock-city">{city.name}</div>
                <div className="clock-time">{time}</div>
                <div className="clock-date">{date}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
