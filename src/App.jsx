import React, { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Header from './components/Header'
import PomodoroTimer from './components/PomodoroTimer'
import CustomTimer from './components/CustomTimer'
import Stopwatch from './components/Stopwatch'
import WorldClock from './components/WorldClock'
import Alarm from './components/Alarm'
import FocusStats from './components/FocusStats'
import AmbientSounds from './components/AmbientSounds'
import TodoList from './components/TodoList'
import ShareModal from './components/ShareModal'

const NAV_ITEMS = [
  { id: 'pomodoro', label: 'Pomodoro', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><line x1="6" y1="19" x2="4" y2="21" /><line x1="18" y1="19" x2="20" y2="21" /></svg> },
  { id: 'timer', label: 'Timer', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg> },
  { id: 'stopwatch', label: 'Stopwatch', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="8" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="9" y1="1" x2="15" y2="1" /><line x1="12" y1="1" x2="12" y2="5" /></svg> },
  { id: 'worldclock', label: 'World Clock', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { id: 'alarm', label: 'Alarm', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
  { id: 'stats', label: 'Stats', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
  { id: 'sounds', label: 'Sounds', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg> },
]

export default function App() {
  const [theme, setTheme] = useLocalStorage('doaide-theme', 'dark')
  const [activePage, setActivePage] = useState('pomodoro')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey) toggleFullscreen()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [toggleFullscreen])

  function renderPage() {
    switch (activePage) {
      case 'pomodoro': return <PomodoroTimer />
      case 'timer': return <CustomTimer />
      case 'stopwatch': return <Stopwatch />
      case 'worldclock': return <WorldClock />
      case 'alarm': return <Alarm />
      case 'stats': return <FocusStats />
      case 'sounds': return <AmbientSounds />
      default: return <PomodoroTimer />
    }
  }

  const showTodo = activePage === 'pomodoro'
  const showAmbient = activePage === 'pomodoro'

  return (
    <div className="app">
      <Header theme={theme} setTheme={setTheme} isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />

      <div className="app-body">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>

        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="nav-items">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <button className="nav-item share-nav" onClick={() => setShowShare(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              <span className="nav-label">Share</span>
            </button>
          </div>
        </nav>

        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        <main className="main-content">
          <div className="page-content">
            {renderPage()}
          </div>
          {showTodo && (
            <aside className="right-panel">
              {showAmbient && <AmbientSounds compact />}
              <TodoList compact />
            </aside>
          )}
        </main>
      </div>

      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  )
}
