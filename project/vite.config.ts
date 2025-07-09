import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
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
    },
    outDir: 'dist'
  } : undefined,
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  }
}));