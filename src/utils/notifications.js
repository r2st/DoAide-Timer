export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function sendNotification(title, body, icon) {
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: icon || '/favicon.svg', badge: '/favicon.svg' })
  } catch {}
}
