import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@modules': resolve(__dirname, './src/modules'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types')
    }
  },
  server: {
    host: true,
    port: 5173
  },
  build: mode === 'library' ? {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SacredShifter',
      fileName: (format) => `sacred-shifter.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  } : {}
}));