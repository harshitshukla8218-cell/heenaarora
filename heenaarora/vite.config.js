import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import chat from './api/chat.js'
import tryOn from './api/try-on.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const name of ['GEMINI_API_KEY', 'GEMINI_MODEL', 'GEMINI_IMAGE_MODEL']) {
    if (!process.env[name] && env[name]) {
      process.env[name] = env[name]
    }
  }

  return {
    plugins: [
      react(),
      {
        name: 'local-api-routes',
        configureServer(server) {
          server.middlewares.use('/api/chat', chat)
          server.middlewares.use('/api/try-on', tryOn)
        },
      },
    ],
  }
})
