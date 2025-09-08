import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // server:{
  //   // allowedHosts: [".ngrok-free.app"],
  // },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'lucide-react'],
  },
});
