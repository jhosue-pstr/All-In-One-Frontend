import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    testTimeout: 15000,
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.*',
        'src/**/*.spec.*',
        'src/demo.test.ts',
        'src/vite-env.d.ts',
        'src/components/GrapesJS/Bloques/**',
        'src/components/GrapesJS/Paneles/*.ts',
        'src/services/index.ts',
        'src/models/**',
        'src/assets/**',
        'src/types/**',
        'src/constants/**',
      ],
    },
  },
})
