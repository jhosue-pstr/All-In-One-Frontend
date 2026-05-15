import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
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
