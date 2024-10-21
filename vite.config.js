import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.PNG'], // 로고 이미지 추가
  plugins: [react()],
  resolve: {
    alias:{
      '@': path.resolve(__dirname, 'src'),
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
      }
    }
  }
)
