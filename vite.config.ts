import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // ← allow access via IP (e.g., 192.168.1.70)
    port: 5173,           // ← optional, defaults to 5173
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
