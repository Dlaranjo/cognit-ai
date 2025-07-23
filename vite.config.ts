import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isMockMode = process.env.VITE_USE_MOCK === 'true';
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true, // Fail if port is already in use
    },
    optimizeDeps: {
      include: ['lucide-react'],
    },
    define: {
      // Garante que variáveis de ambiente sejam disponibilizadas
      'import.meta.env.VITE_USE_MOCK': JSON.stringify(process.env.VITE_USE_MOCK),
    },
    build: {
      // Remove console.logs em produção EXCETO quando em modo mock
      minify: 'terser',
      terserOptions: {
        compress: {
          // Preserva console.logs se estiver em modo mock
          drop_console: mode === 'production' && !isMockMode,
          drop_debugger: mode === 'production' && !isMockMode,
        },
      },
    },
  };
});
