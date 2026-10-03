const STATS_KEY = 'doaide-focus-stats'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || {}
  } catch {
    return {}
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {}
}

export function recordSession(durationMinutes) {
  const stats = loadStats()
  const today = getToday()
  if (!stats[today]) stats[today] = { minutes: 0, sessions: 0 }
  stats[today].minutes += durationMinutes
  stats[today].sessions += 1
  saveStats(stats)
  return stats
}

export function getTodayStats() {
  const stats = loadStats()
  return stats[getToday()] || { minutes: 0, sessions: 0 }
}

export function getStreak() {
  const stats = loadStats()
  const dates = Object.keys(stats).sort().reverse()
  if (dates.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (stats[key] && stats[key].sessions > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export function getWeekData() {
  const stats = loadStats()
  const result = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const dayStats = stats[key] || { minutes: 0, sessions: 0 }
    result.push({ day: days[d.getDay()], date: key, ...dayStats })
  }
  return result
}

export function getTotalStats() {
  const stats = loadStats()
  let totalMinutes = 0
  let totalSessions = 0
  Object.values(stats).forEach((day) => {
    totalMinutes += day.minutes || 0
    totalSessions += day.sessions || 0
  })
  return { totalMinutes, totalSessions, days: Object.keys(stats).length }
}
