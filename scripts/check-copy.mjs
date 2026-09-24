// Copy guard: phrases DESIGN.md / PATIENT.md forbid, fabricated trust signals,
// real brands the Stitch export used, and leaked screen IDs. Add `copy-ok` on a
// line only when the phrase appears in a clearly negated or explanatory sentence.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const banned = [
  [/diagnosis is ready/i, 'Say "Your report is available"'],
  [/alzheimer'?’?s detected/i, 'Never label a detection'],
  [/everything (looks|is) fine/i, 'Say "Awaiting clinician review" / not an all-clear'],
  [/ai neurologist|ai doctor/i, 'NeuroLearn is education, not a clinician'],
  [/neurorisk/i, 'NeuroRisk is out of MVP scope'],
  [/\bhipaa\b/i, 'Fabricated / wrong-jurisdiction compliance claim'],
  [/board[- ]certified/i, 'Fabricated credential'],
  [/\b(apollo|fortis|max healthcare|medanta|manipal|narayana|dr\.? lal|thyrocare|metropolis|srl diagnostics)\b/i, 'Real brand — use illustrative names'],
  [/\b911\b/, 'Wrong emergency number for India (112)'],
  [/\b(fda|cdsco)[- ](approved|cleared)\b/i, 'Regulatory claim'],
  [/\bnabl\b|\bcap[- ]accredited\b/i, 'Accreditation badge not verified'],
  [/best (neurologist|doctor|clinician|lab)/i, 'No "best" labels'],
  [/brain[- ]age|brain health score|risk score|risk percentage/i, 'No unsupported scores'],
  [/trusted by|testimonial|\d+\s?%\s?(faster|more|better|accurate)|\b\d{2,}[,\d]*\+\s(patients|clinicians|labs|users)/i, 'Invented social proof / metric'],
  [/scanning your brain|analy[sz]ing alzheimer/i, 'Misleading loading copy'],
  [/\b(mmse|moca|adas-cog|cdr)\b/i, 'Do not name or replicate licensed instruments'],
  [/\bP(0\d|1\d|2[0-2])\b(?![a-z])/, 'Screen ID leaked into UI'],
  [/\d+\s?[–-]\s?\d+\s?min(ute)?s?\b|estimated:? \d+\s?min/i, 'Invented duration'],
  [/\bconfetti\b|\bleaderboard\b|\bpoints earned\b/i, 'Gamification'],
  [/never sold|bank[- ]grade|military[- ]grade|100% secure|fully secure/i, 'Unverified security/privacy promise'],
  [/clinically (validated|proven)/i, 'Validation claim'],
]

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(f)) out.push(p)
  }
  return out
}

let n = 0
for (const file of walk('src')) {
  if (file.endsWith('check-copy.mjs')) continue
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('copy-ok')) return
    const code = line.trim()
    if (code.startsWith('//') || code.startsWith('*') || code.startsWith('/*')) return
    for (const [re, why] of banned) {
      if (re.test(line)) {
        n++
        console.log(`${file}:${i + 1}  ${why}\n    ${code.slice(0, 160)}`)
      }
    }
  })
}
if (n) {
  console.log(`\n✗ ${n} copy violation(s).`)
  process.exit(1)
}
console.log('✓ copy: no banned claims, brands, screen IDs, durations or gamification')
