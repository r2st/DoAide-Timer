import React from 'react'

const THEMES = [
  { id: 'dark', label: 'Dark', color: '#0a0a1a' },
  { id: 'light', label: 'Light', color: '#f0f0f5' },
  { id: 'forest', label: 'Forest', color: '#0d1f0d' },
  { id: 'ocean', label: 'Ocean', color: '#0a1628' },
  { id: 'sunset', label: 'Sunset', color: '#1a0f08' },
]

export default function Header({ theme, setTheme, isFullscreen, toggleFullscreen }) {
  return (
    <header className="app-header">
      <div className="logo">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#F0B429" strokeWidth="2.5" />
          <line x1="16" y1="8" x2="16" y2="16" stroke="#F0B429" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="16" x2="22" y2="20" stroke="#F0B429" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2" fill="#F0B429" />
        </svg>
        <span className="logo-text">DoAide <em>Timer</em></span>
      </div>
      <div className="header-actions">
        <div className="theme-switcher">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-dot ${theme === t.id ? 'active' : ''}`}
              style={{ background: t.color, border: theme === t.id ? '2px solid var(--accent)' : '2px solid transparent' }}
              onClick={() => setTheme(t.id)}
              title={t.label}
            />
          ))}
        </div>
        <button className="icon-btn" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          {isFullscreen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
          )}
        </button>
      </div>
    </header>
  )
}
