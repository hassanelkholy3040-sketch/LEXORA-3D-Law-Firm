import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1' },
  build: {
    sourcemap: false,
    target: 'es2022',
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll(String.fromCharCode(92), '/');
          if (normalizedId.includes('/node_modules/three/')) return 'three-core';
          if (
            normalizedId.includes('/node_modules/@react-three/') ||
            normalizedId.includes('/node_modules/three-stdlib/') ||
            normalizedId.includes('/node_modules/maath/')
          ) return 'react-three';
          if (normalizedId.includes('/node_modules/gsap/')) return 'gsap';
        },
      },
    },
  },
});
