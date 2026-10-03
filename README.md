# DoAide Timer

Free Pomodoro timer and productivity tool at [timer.doaide.com](https://timer.doaide.com).

## Features

- **Pomodoro Timer** — Classic 25/5/15 pattern, customizable durations, auto-start, session counter
- **Custom Timer** — Any duration countdown with presets
- **Stopwatch** — Lap tracking with best/worst highlighting
- **World Clock** — 24+ major cities with analog clocks
- **Alarm** — Browser notification alarms
- **Focus Stats** — Daily minutes, sessions, streaks, weekly chart
- **Ambient Sounds** — Rain, ocean, forest, coffee shop, fireplace, white noise
- **To-Do List** — Task management integrated with Pomodoro sessions
- **Themes** — Dark, Light, Forest, Ocean, Sunset
- **PWA** — Installable, works offline
- **Sharing** — Share focus stats to Twitter/X and WhatsApp

## Tech Stack

- React 18 + Vite
- Web Audio API for sounds
- localStorage for persistence
- Service worker for offline/PWA
- No backend required

## Development

```bash
npm install
npm run dev
```

Runs on `http://172.18.0.1:3058`.

## Build & Deploy

```bash
npm run build
npm run preview
```

### systemd Service

```bash
cp doaide-timer.service /etc/systemd/system/
systemctl enable doaide-timer
systemctl start doaide-timer
```

## Server

- Host: 89.167.8.178
- Port: 3058 (bound to 172.18.0.1)
- Subdomain: timer.doaide.com
