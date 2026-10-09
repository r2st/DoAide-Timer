import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('DoAide')).toBeInTheDocument()
  })

  it('displays navigation items', () => {
    render(<App />)
    expect(screen.getByText('Pomodoro')).toBeInTheDocument()
    expect(screen.getByText('Stopwatch')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.getByText('World Clock')).toBeInTheDocument()
    expect(screen.getByText('Alarm')).toBeInTheDocument()
    expect(screen.getByText('Stats')).toBeInTheDocument()
    expect(screen.getByText('Sounds')).toBeInTheDocument()
    const timerNavItems = screen.getAllByText('Timer')
    expect(timerNavItems.length).toBeGreaterThanOrEqual(1)
  })

  it('shows Pomodoro timer by default', () => {
    render(<App />)
    expect(screen.getByText('Short Break')).toBeInTheDocument()
    expect(screen.getByText('Long Break')).toBeInTheDocument()
  })
})
