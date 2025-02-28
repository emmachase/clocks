import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(({
    babel: {
      plugins: [
        ["babel-plugin-react-compiler", {}]
      ]
    }
  })), tailwindcss(), tsconfigPaths(), svgr()],
})
