import { FileText } from 'lucide-react'
import { useState } from 'react'
import { Button, Dialog } from '@/components/ui'
import { orderById } from '@/demo/fixtures'
import { usePeople } from '@/demo/store'
import type { Report } from '@/demo/types'

export function originalFileName(report: Report) {
  return `${report.title.replace(/\s+/g, '-')}-${report.releasedOn.split(',')[0].replace(/\s+/g, '-')}.pdf`
}

/**
 * "Open original report" (PATIENT.md › P16). A plain document-like
 * placeholder: issuer, specimen and dates. It never shows values, units,
 * ranges or flags; those stay in the original laboratory file.
 */
export function OriginalReportButton({ report, variant = 'secondary' }: { report: Report; variant?: 'primary' | 'secondary' }) {
  const [open, setOpen] = useState(false)
  const { fullName } = usePeople()
  const order = orderById(report.orderId)
  const file = originalFileName(report)
  const current = report.versions[report.versions.length - 1]

  return (
    <>
      <Button
        variant={variant}
        size="lg"
        iconLeft={<FileText className="size-5" strokeWidth={1.75} />}
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        Open original report
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={file}
        description="Original laboratory document. Demo placeholder - not a real report."
        footer={<Button onClick={() => setOpen(false)}>Close</Button>}
      >
        <div className="rounded-md border border-control bg-surface p-4 sm:p-8">
          <div className="flex flex-col gap-1 border-b-2 border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-heading-sm text-ink">{report.issuerLabel}</p>
              <p className="text-body-md text-muted">Laboratory report</p>
            </div>
            <p className="text-body-md text-muted tabular sm:shrink-0 sm:text-right">
              Version {current.version} · {current.issuedOn}
            </p>
          </div>

          <dl className="grid gap-x-8 gap-y-3 border-b border-border py-4 text-body-md sm:grid-cols-2">
            {[
              ['Patient', fullName],
              ['Order', order ? `${order.orderRef} · ${order.orderedBy}` : 'Named on the original report'],
              ['Specimen', report.specimen],
              ['Assay', report.assay],
              ['Collected', report.collectedOn],
              ['Released', report.releasedOn],
            ].map(([t, d]) => (
              <div key={t} className="min-w-0">
                <dt className="text-muted">{t}</dt>
                <dd className="font-medium text-ink tabular">{d}</dd>
              </div>
            ))}
          </dl>

          <div className="py-4">
            <p className="text-label text-ink">{report.title.replace(/ report$/, '')}</p>
            <div className="mt-3 rounded-md border border-dashed border-control bg-canvas p-4 text-body-md text-ink">
              Values, units and reference ranges appear in the original file. This prototype does not reproduce them.
            </div>
          </div>

          <div className="border-t border-border pt-4 text-body-md">
            <p className="text-muted">Laboratory interpretation</p>
            <p className="text-ink">{report.labInterpretation}</p>
          </div>
        </div>
      </Dialog>
    </>
  )
}
