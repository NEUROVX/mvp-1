// Screenshot + accessibility sweep.
// Usage: node scripts/qa-screens.mjs --base http://localhost:5173 --routes "/,/patients" \
//          [--widths 1440,390] [--out qa/shots] [--axe] [--full]
// A route may carry demo state: "/app?demo=booking-confirmed&as=patient".
import { mkdirSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true])
    return acc
  }, []),
)
const base = args.base || 'http://localhost:5173'
const routes = String(args.routes || '/').split(',').map((r) => r.trim()).filter(Boolean)
const widths = String(args.widths || '1440,390').split(',').map(Number)
const out = args.out || 'qa/shots'
const full = args.full !== 'false'
mkdirSync(out, { recursive: true })

let AxeBuilder
if (args.axe) AxeBuilder = (await import('@axe-core/playwright')).default

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const report = []
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 1 })
  for (const route of routes) {
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    const name = `${route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}@${width}.png`
    await page.screenshot({ path: `${out}/${name}`, fullPage: full })
    const entry = { route, width, file: `${out}/${name}`, horizontalOverflowPx: overflow, consoleErrors: errors }
    if (AxeBuilder) {
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      entry.axe = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }))
    }
    report.push(entry)
    const flags = [overflow > 0 ? `OVERFLOW ${overflow}px` : '', errors.length ? `${errors.length} console error(s)` : '', entry.axe?.length ? `${entry.axe.length} axe issue(s)` : ''].filter(Boolean).join(' · ')
    console.log(`${flags ? '✗' : '✓'} ${width}px ${route} ${flags}`)
    await page.close()
  }
  await ctx.close()
}
await browser.close()
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2))
console.log(`\nScreenshots and report.json in ${out}/`)
