import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@modules': '/src/modules',
      '@services': '/src/services',
      '@types': '/src/types'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: mode === 'library' ? {
    lib: {
      entry: '/src/index.ts',
      name: 'SacredShifter',
      fileName: (format) => `sacred-shifter.${format}.js`,
      formats: ['es', 'umd']
    }
  } : {}
}));