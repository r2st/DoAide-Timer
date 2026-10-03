import React, { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { playCompletionSound } from '../utils/audio'
import { sendNotification, requestNotificationPermission } from '../utils/notifications'

export default function Alarm() {
  const [alarms, setAlarms] = useLocalStorage('doaide-alarms', [])
  const [newTime, setNewTime] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const checkRef = useRef(null)

  useEffect(() => {
    requestNotificationPermission()
    checkRef.current = setInterval(() => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      setAlarms((prev) => {
        let changed = false
        const next = prev.map((a) => {
          if (a.enabled && a.time === currentTime && !a.firedAt) {
            playCompletionSound()
            sendNotification('Alarm!', a.label || `Alarm at ${a.time}`)
            changed = true
            return { ...a, firedAt: currentTime }
          }
          if (a.firedAt && a.time !== currentTime) {
            changed = true
            return { ...a, firedAt: null }
          }
          return a
        })
        return changed ? next : prev
      })
    }, 5000)
    return () => clearInterval(checkRef.current)
  }, [setAlarms])

  function addAlarm() {
    if (!newTime) return
    setAlarms((prev) => [...prev, { id: Date.now(), time: newTime, label: newLabel, enabled: true, firedAt: null }])
    setNewTime('')
    setNewLabel('')
  }

  function toggleAlarm(id) {
    setAlarms((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled, firedAt: null } : a))
  }

  function deleteAlarm(id) {
    setAlarms((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="alarm-page">
      <h2>Alarms</h2>
      <div className="alarm-form card">
        <div className="alarm-inputs">
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="alarm-time-input" />
          <input type="text" placeholder="Label (optional)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="alarm-label-input" />
        </div>
        <button className="control-btn primary small" onClick={addAlarm} disabled={!newTime}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Alarm
        </button>
      </div>

      <div className="alarms-list">
        {alarms.length === 0 && <div className="empty-state">No alarms set. Add one above.</div>}
        {alarms.map((alarm) => (
          <div key={alarm.id} className={`alarm-item card ${!alarm.enabled ? 'disabled' : ''}`}>
            <div className="alarm-info">
              <div className="alarm-time">{alarm.time}</div>
              {alarm.label && <div className="alarm-label">{alarm.label}</div>}
            </div>
            <div className="alarm-actions">
              <button className={`toggle-btn ${alarm.enabled ? 'on' : ''}`} onClick={() => toggleAlarm(alarm.id)}>
                {alarm.enabled ? 'ON' : 'OFF'}
              </button>
              <button className="delete-btn" onClick={() => deleteAlarm(alarm.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="alarm-note">Alarms use browser notifications. Keep this tab open for alarms to work.</p>
    </div>
  )
}
