import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build stamp shown in demo mode, to check which version a device is running.
function buildInfo() {
  const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
  let commit = process.env.GITHUB_SHA?.slice(0, 7)
  if (!commit) {
    try {
      commit = execSync('git rev-parse --short HEAD').toString().trim()
    } catch {
      commit = 'local'
    }
  }
  return { version, commit, time: new Date().toISOString() }
}

export default defineConfig({
  plugins: [react()],
  // Relative paths, so the build works at any address (GitHub Pages puts it
  // under /lfbab/, another host might serve it from the root).
  base: './',
  define: { __BUILD__: JSON.stringify(buildInfo()) },
  server: { host: true },
})
