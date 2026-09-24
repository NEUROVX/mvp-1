// Locked-token guard (Hallmark discipline 3 + DESIGN.md "YAML values are the exact tokens").
// Fails if any source file outside src/styles uses a raw colour, a default
// Tailwind palette class, an arbitrary colour value, an inline font-family, or italic headings.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src'
const SKIP = [join('src', 'styles')]
const rules = [
  { re: /#[0-9a-fA-F]{3,8}\b(?![^'"`]*\/)/g, msg: 'raw hex colour', test: (line) => !/href=|to=|#main|'#|"#|`#/.test(line) || /['"`]#[0-9a-fA-F]{3,8}['"`]/.test(line) },
  { re: /\b(rgba?|hsla?|oklch|oklab|lab|lch)\(/g, msg: 'raw colour function' },
  { re: /\b(?:text|bg|border|ring|fill|stroke|from|to|via|outline|decoration|divide|shadow|placeholder|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black)(?:-\d{2,3})?\b/g, msg: 'default Tailwind palette class (not a NeuroVX token)' },
  { re: /\b(?:text|bg|border|ring|fill|stroke|outline|decoration|shadow)-\[(?:#|rgb|hsl|oklch|color:)/g, msg: 'arbitrary colour value' },
  { re: /font-family\s*:|fontFamily\s*:/g, msg: 'inline font-family (use font-sans token)' },
  { re: /<h[1-6][^>]*\bitalic\b/g, msg: 'italic heading' },
]

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (SKIP.some((s) => p.startsWith(s))) continue
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(tsx?|css)$/.test(f)) out.push(p)
  }
  return out
}

let failures = 0
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes('tokens-ok')) return
    for (const r of rules) {
      r.re.lastIndex = 0
      if (r.re.test(line) && (!r.test || r.test(line))) {
        failures++
        console.log(`${file}:${i + 1}  ${r.msg}\n    ${line.trim().slice(0, 160)}`)
      }
    }
  })
}
if (failures) {
  console.log(`\n✗ ${failures} token violation(s). Use NeuroVX tokens from src/styles/index.css.`)
  process.exit(1)
}
console.log('✓ tokens: no raw colours, palette classes or inline fonts outside src/styles')
