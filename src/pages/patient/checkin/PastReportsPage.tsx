import { clsx } from 'clsx'
import { FileText, FileUp, ImageIcon, OctagonAlert } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Button, Callout, DemoTag, InlineStatus } from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { UploadedFile } from '@/demo/types'
import { ActionRow, PanelHeading, TaskLede, TaskTitle } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

const MAX_BYTES = 10 * 1024 * 1024

interface Rejected {
  id: string
  name: string
  reason: string
  recovery: string
}

function kindOf(f: File): UploadedFile['kind'] | null {
  if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) return 'pdf'
  if (['image/jpeg', 'image/png'].includes(f.type) || /\.(jpe?g|png)$/i.test(f.name)) return 'image'
  return null
}

function sizeLabel(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

let seq = 0
const newId = () => `up-${Date.now().toString(36)}-${(seq++).toString(36)}`

/**
 * Past reports (PATIENT-ONE-STEP § 5; PATIENT.md › Access, notifications and files).
 * One upload surface. Files stay in this browser tab: the page never claims an
 * upload, never reads or interprets a report or photo. `?type=order` is the
 * external test-order path (upload, then a check before booking).
 */
export default function PastReportsPage() {
  const [params] = useSearchParams()
  const isOrder = params.get('type') === 'order'
  usePageTitle(isOrder ? 'Upload your test order' : 'Past reports')
  const { state, set } = useDemo()
  const [rejected, setRejected] = useState<Rejected[]>([])
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const files = state.uploads
  const allDemo = files.length > 0 && files.every((f) => f.demo)
  const booked = hasReached(state.stage, 'booking-requested')
  const onward = booked ? '/app/care/visit' : '/app/care/find-clinician'

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return
    const ok: UploadedFile[] = []
    const bad: Rejected[] = []
    for (const f of Array.from(list)) {
      const kind = kindOf(f)
      if (!kind) {
        bad.push({
          id: newId(),
          name: f.name,
          reason: 'This file type is not supported.',
          recovery: 'Choose a PDF, JPG or PNG. Scans in other formats can be brought to the visit.',
        })
      } else if (f.size > MAX_BYTES) {
        bad.push({
          id: newId(),
          name: f.name,
          reason: `This file is ${sizeLabel(f.size)}, over the 10 MB limit.`,
          recovery: 'Try a smaller scan or a photo of each page, or bring the paper copy to the visit.',
        })
      } else {
        ok.push({ id: newId(), name: f.name, sizeLabel: sizeLabel(f.size), kind, status: 'ready', addedAt: EPISODE_DATES.today })
      }
    }
    if (ok.length) set((s) => ({ ...s, uploads: [...s.uploads, ...ok] }))
    if (bad.length) setRejected((r) => [...r, ...bad])
    const parts = [
      ok.length ? `${ok.length} ${ok.length === 1 ? 'file' : 'files'} added. Kept in this browser tab only.` : '',
      bad.length ? `${bad.length} could not be added.` : '',
    ]
    setStatus(parts.filter(Boolean).join(' '))
    if (inputRef.current) inputRef.current.value = ''
  }

  const remove = (f: UploadedFile) => {
    set((s) => ({ ...s, uploads: s.uploads.filter((u) => u.id !== f.id) }))
    setStatus(`${f.name} removed.`)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <TaskTitle>{isOrder ? 'Upload your test order' : 'Do you have any past reports?'}</TaskTitle>
        <TaskLede>
          {isOrder
            ? 'We’ll check the order, identity and service before booking.'
            : 'Add reports you already have. You can continue without them.'}
        </TaskLede>
      </div>

      <div className="space-y-3">
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={clsx(
            'flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 sm:py-12',
            'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary',
            dragging ? 'border-primary bg-accent-soft' : 'border-control bg-surface hover:border-primary hover:bg-accent-soft',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="application/pdf,image/*"
            className="sr-only"
            aria-describedby="upload-constraints"
            onChange={(e) => addFiles(e.target.files)}
          />
          <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-full bg-accent-soft text-primary">
            <FileUp className="size-6" strokeWidth={1.75} />
          </span>
          <span className="text-heading-sm text-primary underline decoration-1 underline-offset-[5px]">
            Choose files or take a photo
          </span>
          <span id="upload-constraints" className="text-body-md text-muted">
            <span className="hidden sm:inline">Or drag files here. </span>PDF, JPG or PNG · up to 10 MB each
          </span>
        </label>
        <InlineStatus>{status}</InlineStatus>
      </div>

      {rejected.length ? (
        <ul className="space-y-3" aria-label="Files that could not be added">
          {rejected.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 rounded-md border border-error bg-error-surface p-4 sm:flex-row sm:items-start">
              <OctagonAlert aria-hidden="true" className="size-5 shrink-0 text-error" />
              <div className="min-w-0 flex-1">
                <p className="text-label break-all text-ink">{r.name}</p>
                <p className="text-body-md font-medium text-error">Not added. {r.reason}</p>
                <p className="text-body-md text-ink">{r.recovery}</p>
              </div>
              <Button variant="quiet" onClick={() => setRejected((x) => x.filter((y) => y.id !== r.id))}>
                Dismiss<span className="sr-only"> message about {r.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {files.length ? (
        <section aria-labelledby="added-heading" className="space-y-3">
          {/* Demo data is labelled once for the list; per file only when mixed with files added here. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <PanelHeading id="added-heading">
              Added {files.length === 1 ? 'file' : 'files'} ({files.length})
            </PanelHeading>
            {allDemo ? <DemoTag>Demo files</DemoTag> : null}
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {files.map((f) => (
              <li key={f.id} className="flex items-start gap-4 p-4 sm:items-center sm:px-5">
                <span aria-hidden="true" className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-canvas text-muted sm:mt-0">
                  {f.kind === 'pdf' ? <FileText className="size-5" strokeWidth={1.75} /> : <ImageIcon className="size-5" strokeWidth={1.75} />}
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-label break-all text-ink">{f.name}</span>
                    {f.demo && !allDemo ? <DemoTag>Demo file</DemoTag> : null}
                  </p>
                  <p className="text-body-md text-muted">
                    {f.kind === 'pdf' ? 'PDF' : 'Image'} · {f.sizeLabel} · Ready - kept in this browser tab only
                  </p>
                </div>
                <Button variant="quiet" onClick={() => remove(f)} className="shrink-0">
                  Remove<span className="sr-only"> {f.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="max-w-reading text-body-md text-muted">
        NeuroVX does not read or interpret reports or photos. Your clinician reviews the originals.
      </p>

      {isOrder && files.length ? (
        <Callout tone="neutral" title="Concept - not available in this preview">
          <p>In a live service, a person checks the order, identity and service before a test can be booked.</p>
        </Callout>
      ) : null}

      <ActionRow className="border-t border-border pt-6">
        {isOrder ? (
          files.length ? (
            <>
              <Button size="lg" to="/app">
                Go to Home
              </Button>
              <Button variant="quiet" to="/app/care/find-clinician">
                Book a clinician instead
              </Button>
            </>
          ) : (
            <Button variant="quiet" to="/app/care/find-clinician">
              Book a clinician instead
            </Button>
          )
        ) : files.length ? (
          <Button size="lg" to={onward}>
            {booked ? 'Continue to your appointment' : 'Continue to booking'}
          </Button>
        ) : (
          <Button variant="quiet" to={onward}>
            I don’t have reports
          </Button>
        )}
      </ActionRow>
    </div>
  )
}
