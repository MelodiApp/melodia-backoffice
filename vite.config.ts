import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          admin: ['react-admin'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    },
    chunkSizeWarningLimit: 1600
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
});
