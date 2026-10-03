import React, { useState, useRef, useEffect } from 'react'
import { AMBIENT_SOUNDS } from '../utils/audio'

export default function AmbientSounds({ compact }) {
  const [active, setActive] = useState(null)
  const [volume, setVolume] = useState(0.3)
  const generatorRef = useRef(null)

  function toggle(sound) {
    if (active === sound.id) {
      generatorRef.current?.stop()
      generatorRef.current = null
      setActive(null)
    } else {
      generatorRef.current?.stop()
      const gen = new sound.Generator()
      gen.start(volume)
      generatorRef.current = gen
      setActive(sound.id)
    }
  }

  function handleVolume(e) {
    const v = parseFloat(e.target.value)
    setVolume(v)
    generatorRef.current?.setVolume(v)
  }

  useEffect(() => {
    return () => generatorRef.current?.stop()
  }, [])

  if (compact) {
    return (
      <div className="ambient-compact">
        <div className="ambient-compact-buttons">
          {AMBIENT_SOUNDS.map((s) => (
            <button
              key={s.id}
              className={`ambient-btn-compact ${active === s.id ? 'active' : ''}`}
              onClick={() => toggle(s)}
              title={s.label}
            >
              {s.icon}
            </button>
          ))}
        </div>
        {active && (
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolume} className="volume-slider-compact" />
        )}
      </div>
    )
  }

  return (
    <div className="ambient-sounds">
      <h2>Ambient Sounds</h2>
      <p className="ambient-subtitle">Background sounds to help you focus</p>
      <div className="sounds-grid">
        {AMBIENT_SOUNDS.map((s) => (
          <button
            key={s.id}
            className={`sound-card card ${active === s.id ? 'active' : ''}`}
            onClick={() => toggle(s)}
          >
            <span className="sound-icon">{s.icon}</span>
            <span className="sound-label">{s.label}</span>
            {active === s.id && <span className="sound-playing">Playing</span>}
          </button>
        ))}
      </div>
      <div className="volume-control card">
        <label>Volume</label>
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolume} className="volume-slider" />
        <span>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  )
}
