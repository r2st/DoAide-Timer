/**
 * SEO metadata for every indexable route. Shared by the useSEO hook (App)
 * and scripts/prerender-routes.mjs (static HTML, sitemap, serve.json), so keep
 * it plain JS with no JSX or browser-only imports.
 *
 * `page` is the App view a path opens. Stats and Sounds are personal panels
 * with no URL of their own. Blog posts are static HTML in public/blog/, so
 * they are `prerender: false`: listed in the sitemap, served as they are.
 */

export const SITE = {
  name: 'DoAide Timer',
  baseUrl: 'https://timer.doaide.com',
  ogImage: 'https://timer.doaide.com/og-timer.png',
}

const tool = (path, page, h1, title, description) => ({ path, page, h1, title: `${title} | DoAide Timer`, description })

export const routes = [
  {
    path: '/',
    page: 'pomodoro',
    h1: 'Pomodoro Timer',
    title: 'DoAide Timer — Free Online Pomodoro Timer with Focus Stats',
    description:
      'Free online Pomodoro timer with focus stats, a to-do list and ambient sounds, plus stopwatch, countdown, meeting timer and world clock. No login.',
  },
  tool('/timer', 'timer', 'Custom Timer', 'Online Countdown Timer — Set Any Duration',
    'Set a countdown for any number of hours, minutes and seconds and get an alert when time is up. Free online countdown timer.'),
  tool('/stopwatch', 'stopwatch', 'Stopwatch', 'Online Stopwatch with Lap Times',
    'A free online stopwatch with lap times that runs in your browser. Start, pause, record laps and reset with one click.'),
  tool('/meeting-timer', 'meeting', 'Meeting Timer', 'Meeting Timer — Keep Meetings on Schedule',
    'Pick a meeting length and get alerts 1, 5, 10 or 15 minutes before the end or at halfway. Free online meeting timer.'),
  tool('/world-clock', 'worldclock', 'World Clock', 'World Clock — Current Time in Cities Worldwide',
    'See the current time in cities around the world side by side, ideal for scheduling across time zones. Free online world clock.'),
  tool('/alarm-clock', 'alarm', 'Alarms', 'Online Alarm Clock — Set Alarms in Your Browser',
    'Set one or more alarms that ring in your browser tab. Free online alarm clock, no app or login needed.'),
  ...[
    'pomodoro-technique-guide',
    'time-management-remote-work',
    'meeting-timer-effective-meetings',
    'pomodoro-technique-2026',
    'best-time-management-techniques-remote-workers',
    'track-billable-hours-freelancers',
  ].map((slug) => ({ path: `/blog/${slug}`, prerender: false })),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path && r.prerender !== false)

export const pathForPage = (page) => routes.find((r) => r.page === page)?.path

export function jsonLdFor(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: route.path === '/' ? SITE.name : route.h1,
    url: canonicalFor(route.path),
    description: route.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
  }
}
