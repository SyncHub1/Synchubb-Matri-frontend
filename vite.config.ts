import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 5175,
    strictPort: true,
    proxy: {
      // Proxy all /api requests to Matri backend
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('🔄 Proxying API request:', path, '→', 'http://localhost:3003' + path);
          return path;
        },
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📤 Proxy request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Proxy response:', req.url, '→ Status:', proxyRes.statusCode);
          });
        }
      },
      // Proxy health endpoint
      '/health': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false
      },
      // Proxy Socket.IO
      '/socket.io': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          utils: ['axios', 'react-router-dom', '@tanstack/react-query']
        }
      }
    }
  },
  
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));



