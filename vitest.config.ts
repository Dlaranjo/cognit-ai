/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    env: {
      VITE_API_BASE_URL: 'http://localhost:3001',
      VITE_USE_MOCK_SERVER: 'true',
      VITE_MAX_FILE_SIZE: '10485760',
      VITE_GOOGLE_CLIENT_ID: 'test-client-id',
    },
  },
})
