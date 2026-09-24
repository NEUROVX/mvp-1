/**
 * The visit packet: what can travel with a booking request, each item with
 * its source (DESIGN.md › keep "Patient reported", "Care partner reported"
 * and system records distinct). Derived from the shared demo store.
 */
import { CONCERN_LABELS, ONSET_LABELS } from '@/demo/fixtures'
import type { BookingState, DemoState, SourceKind } from '@/demo/types'

export type ShareKey = Exclude<keyof BookingState['share'], 'excludedUploadIds'>

const UPLOAD_PREFIX = 'upload-'
/** The upload id behind a packet item id. */
export const uploadIdOf = (itemId: string) => itemId.slice(UPLOAD_PREFIX.length)

/** Whether one packet item is shared, including single unticked reports. */
export function isShared(share: BookingState['share'], item: PacketItem) {
  if (item.shareKey !== 'uploads') return share[item.shareKey]
  return share.uploads && !share.excludedUploadIds?.includes(uploadIdOf(item.id))
}

export interface PacketItem {
  id: string
  shareKey: ShareKey
  title: string
  detail: string
  source: SourceKind
  sourceName?: string
}

export function packetItems(state: DemoState): PacketItem[] {
  const items: PacketItem[] = []
  const helperName = `${state.helper.firstName} ${state.helper.lastName}`

  if (state.checkIn.status === 'saved') {
    const concerns = state.checkIn.concerns.map((c) => CONCERN_LABELS[c]).filter(Boolean)
    const onset = state.checkIn.onset ? ONSET_LABELS[state.checkIn.onset] : undefined
    items.push({
      id: 'check-in',
      shareKey: 'checkIn',
      title: 'Check-in summary',
      detail: [concerns.length ? `Concerns: ${concerns.join(', ')}` : 'Concerns and timing', onset ? `First noticed: ${onset.toLowerCase()}` : null]
        .filter(Boolean)
        .join('. '),
      source: 'patient',
      sourceName: state.checkIn.savedAt ? `Saved ${state.checkIn.savedAt}` : undefined,
    })
  }

  if (state.observations.status === 'saved') {
    items.push({
      id: 'observations',
      shareKey: 'observations',
      title: 'Family observations',
      detail: 'Day-to-day changes noticed at home, kept separate from the patient’s own answers.',
      source: 'care-partner',
      sourceName: helperName,
    })
  }

  if (state.assessment.status === 'completed') {
    items.push({
      id: 'assessment',
      shareKey: 'assessment',
      title: 'Memory and thinking assessment - preview summary',
      detail: 'Demo completion, no score. Not yet reviewed by a clinician.',
      source: 'system',
      sourceName: state.assessment.completedAt,
    })
  } else if (state.assessment.status === 'interrupted') {
    items.push({
      id: 'assessment',
      shareKey: 'assessment',
      title: 'Assessment preview - not completed',
      detail: 'It could not be completed as planned. There is no score. A clinician can arrange an assisted assessment.',
      source: 'system',
      sourceName: 'Assessment preview',
    })
  }

  for (const u of state.uploads) {
    items.push({
      id: `${UPLOAD_PREFIX}${u.id}`,
      shareKey: 'uploads',
      title: u.name,
      detail: `Previous report · ${u.kind === 'pdf' ? 'PDF' : 'Image'}, ${u.sizeLabel}${u.status === 'unreadable' ? ' · some pages may be hard to read' : ''}`,
      source: 'patient',
      sourceName: `Added ${u.addedAt}`,
    })
  }

  return items
}
