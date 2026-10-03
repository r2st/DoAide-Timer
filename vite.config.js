import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '172.18.0.1',
    port: 3058,
  },
  preview: {
    host: '172.18.0.1',
    port: 3058,
  },
})
