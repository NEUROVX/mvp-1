/**
 * Booking helpers shared by Find a clinician, clinician details, booking
 * review, the visit hub and Change visit. Pure functions over fixtures:
 * nothing here invents availability, ratings or rankings.
 */
import { DEMO_AREA } from '@/demo/fixtures'
import type { Clinician, EpisodeStage, Slot, VisitMode } from '@/demo/types'

export const MODE_LABEL: Record<VisitMode, string> = {
  'in-clinic': 'In clinic',
  video: 'Video',
}

export function modesText(modes: VisitMode[]) {
  return modes.map((m) => MODE_LABEL[m]).join(', ')
}

/** "Sector 18" from "Sector 18, Noida - sample search area". */
export function locality(c: Clinician) {
  return c.area.replace(DEMO_AREA, '').replace(/[,\s]+$/, '') || c.area
}

/** Where the visit happens, in words. */
export function placeText(c: Clinician, mode: VisitMode) {
  return mode === 'in-clinic'
    ? `In clinic at ${c.clinic}, ${locality(c)}`
    : 'Video visit. The clinic sends joining details after it confirms.'
}

/* ---------------- Clinician type (actual specialty, never relabelled) ---------------- */

export type ClinicianType = 'neurology' | 'geriatric' | 'primary-care'

export const TYPE_LABEL: Record<ClinicianType, string> = {
  neurology: 'Neurology',
  geriatric: 'Geriatric medicine',
  'primary-care': 'Primary care',
}

export function clinicianType(c: Clinician): ClinicianType {
  const s = c.specialty.toLowerCase()
  if (s.startsWith('neurology')) return 'neurology'
  if (s.startsWith('geriatric')) return 'geriatric'
  return 'primary-care'
}

/* ---------------- Dates and slots ---------------- */

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function dayParts(date: string) {
  const [d, mon, y] = date.split(' ')
  return { d: Number(d), m: MONTHS[mon] ?? 0, y: Number(y) }
}

/** Sortable timestamp for "06 Oct 2026" + "4:30 PM IST". */
export function slotTime(s: Pick<Slot, 'date' | 'time'>) {
  const { d, m, y } = dayParts(s.date)
  const t = /(\d{1,2}):(\d{2})\s*(AM|PM)/.exec(s.time)
  let h = t ? Number(t[1]) % 12 : 0
  if (t?.[3] === 'PM') h += 12
  return Date.UTC(y, m, d, h, t ? Number(t[2]) : 0)
}

/** "Tuesday" for "06 Oct 2026". */
export function weekday(date: string) {
  const { d, m, y } = dayParts(date)
  return WEEKDAYS[new Date(Date.UTC(y, m, d)).getUTCDay()]
}

/** "Tue" for "06 Oct 2026". */
export function weekdayShort(date: string) {
  return weekday(date).slice(0, 3)
}

/** "06 Oct 2026, 4:30 PM IST" */
export function slotLabel(s: Pick<Slot, 'date' | 'time'>) {
  return `${s.date}, ${s.time}`
}

export function sortSlots(slots: Slot[]) {
  return [...slots].sort((a, b) => slotTime(a) - slotTime(b))
}

export function groupByDate(slots: Slot[]) {
  const groups: Array<{ date: string; slots: Slot[] }> = []
  for (const s of sortSlots(slots)) {
    const g = groups.find((x) => x.date === s.date)
    if (g) g.slots.push(s)
    else groups.push({ date: s.date, slots: [s] })
  }
  return groups
}

export function nextSlot(c: Clinician, mode?: VisitMode) {
  return sortSlots(c.slots.filter((s) => (!mode || s.mode === mode) && !isSlotTaken(s.id)))[0]
}

export function feeAmount(c: Clinician) {
  return Number(c.fee.replace(/[^\d]/g, '')) || 0
}

export function distanceKm(c: Clinician) {
  return parseFloat(c.distance) || 0
}

/* ---------------- Follow-up slots ---------------- */

/**
 * Follow-up times for the episode clinician. The shared fixture only lists
 * first-visit slots (06-09 Oct), which are in the past once a follow-up is
 * due (12 Oct), so follow-up times live here. Prototype data only.
 */
/** Follow-up times live in the fixtures (`Clinician.followUpSlots`). */
export function followUpSlots(c: Clinician): Slot[] {
  return c.followUpSlots ?? []
}

export { findSlot } from '@/demo/fixtures'

/* ---------------- "This time is no longer available" demo exception ---------------- */

/**
 * PATIENT.md › "Clinician unavailable: This time is no longer available".
 * Requesting this slot shows the exception once; after that the slot stays
 * unavailable for this browser tab, so the story is consistent.
 */
export const DEMO_TAKEN_SLOT = 'kr-3'
const TAKEN_KEY = 'nvx-booking-taken-slots'
let takenFallback: string[] = []

function readTaken(): string[] {
  try {
    const raw = sessionStorage.getItem(TAKEN_KEY)
    return raw ? (JSON.parse(raw) as string[]) : takenFallback
  } catch {
    return takenFallback
  }
}

export function isSlotTaken(id: string) {
  return readTaken().includes(id)
}

export function markSlotTaken(id: string) {
  const next = Array.from(new Set([...readTaken(), id]))
  takenFallback = next
  try {
    sessionStorage.setItem(TAKEN_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable: kept in memory */
  }
}

/* ---------------- Episode helpers ---------------- */

/** A visit request or booking exists and the visit has not happened yet. */
export function hasActiveBooking(stage: EpisodeStage) {
  return stage === 'booking-requested' || stage === 'booking-confirmed' || stage === 'info-requested'
}

export function isConfirmedStage(stage: EpisodeStage) {
  return stage === 'booking-confirmed' || stage === 'info-requested'
}
