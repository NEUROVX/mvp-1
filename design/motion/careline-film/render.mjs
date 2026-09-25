// Renders film.html frame by frame with Chromium and encodes it with ffmpeg.
//   node render.mjs --stills 1,3.5,7          → PNG stills in out/
//   node render.mjs --events                  → out/events.json (cue times for sound.py)
//   node render.mjs                           → out/video-only.mp4 (60fps, motion blur)
// Needs an ffmpeg binary: FFMPEG=/path/to/ffmpeg (e.g. from `pip install imageio-ffmpeg`).
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, 'out')
mkdirSync(out, { recursive: true })
const args = process.argv.slice(2)
const arg = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args[i + 1] }
const FPS = Number(arg('--fps', 60)), SUB = Number(arg('--sub', 4)) // subframes per frame for motion blur
const exe = existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined

const browser = await chromium.launch({ executablePath: exe }).catch(() => chromium.launch())
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
page.on('console', m => m.type() === 'error' && console.error('page:', m.text()))
page.on('pageerror', e => { console.error('pageerror:', e.message); process.exit(1) })
await page.goto(pathToFileURL(path.join(here, 'film.html')).href)
await page.waitForFunction(() => window.READY === true)
const duration = await page.evaluate(() => window.DURATION)

if (args.includes('--events')) {
  const { writeFileSync } = await import('node:fs')
  writeFileSync(path.join(out, 'events.json'), JSON.stringify(await page.evaluate(() => window.EVENTS_FOR_AUDIO)))
  await browser.close(); process.exit(0)
}

if (args.includes('--stills')) {
  for (const t of arg('--stills').split(',').map(Number)) {
    await page.evaluate(t => window.render(t), t)
    await page.screenshot({ path: path.join(out, `still-${t.toFixed(2)}.png`) })
  }
  await browser.close(); process.exit(0)
}

const ffmpeg = process.env.FFMPEG || 'ffmpeg'
const total = Math.round(duration * FPS) * SUB
// Motion blur: render SUB subframes per output frame, average them (a 270° shutter), keep one per frame.
const blur = SUB > 1 ? `tmix=frames=${SUB},select='not(mod(n+1\\,${SUB}))',setpts=N/${FPS}/TB,` : ''
const enc = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-',
  '-vf', `${blur}format=yuv420p`, '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '14',
  '-tune', 'animation', '-movflags', '+faststart', path.join(out, 'video-only.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] })
const shutter = 0.75 // fraction of the frame interval the subframes span
for (let f = 0; f < total; f++) {
  const frame = Math.floor(f / SUB), k = f % SUB
  const t = (frame + (SUB > 1 ? (k / (SUB - 1) - 1) * shutter : 0)) / FPS
  await page.evaluate(t => window.render(t), Math.max(0, t))
  const buf = await page.screenshot({ type: 'jpeg', quality: 96 })
  if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r))
  if (f % (FPS * SUB) === 0) console.log(`t=${(frame / FPS).toFixed(1)}s`)
}
enc.stdin.end()
await new Promise(r => enc.on('close', r))
await browser.close()
console.log('wrote', path.join(out, 'video-only.mp4'))
