import { defineConfig } from 'vite'
import {react,tailwindcss} from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
