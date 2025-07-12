import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
  }
});