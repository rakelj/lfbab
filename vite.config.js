import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
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

// Content Security Policy for the built app. Only in the build: the dev
// server needs inline scripts. frame-ancestors only works as a real header,
// see public/_headers.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

// Offline support: writes dist/sw.js with every built file in its list, and
// a cache name per build so a new version replaces the old one by itself.
function serviceWorker(build) {
  let outDir
  return {
    name: 'lfb-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    transformIndexHtml(html) {
      return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`)
    },
    writeBundle() {
      const files = []
      const walk = (dir) =>
        readdirSync(dir, { withFileTypes: true }).forEach((e) => {
          const path = join(dir, e.name)
          if (e.isDirectory()) walk(path)
          else files.push(relative(outDir, path).split('\\').join('/'))
        })
      walk(outDir)
      const keep = files.filter((f) => !['sw.js', '_headers'].includes(f) && !f.startsWith('docs/'))
      const template = readFileSync(new URL('./src/sw-template.js', import.meta.url), 'utf8')
      const sw = template
        .replace('__CACHE__', JSON.stringify(`lfb-${build.version}-${build.commit}-${build.time}`))
        .replace('__FILES__', JSON.stringify(['./', ...keep.map((f) => `./${f}`)]))
      writeFileSync(join(outDir, 'sw.js'), sw)
    },
  }
}

const build = buildInfo()

export default defineConfig({
  plugins: [react(), serviceWorker(build)],
  // Relative paths, so the build works at any address (GitHub Pages puts it
  // under /lfbab/, another host might serve it from the root).
  base: './',
  define: { __BUILD__: JSON.stringify(build) },
  server: { host: true },
})
