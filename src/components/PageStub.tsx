import { PageHeader } from '@/components/ui'
import { usePageTitle } from '@/lib/hooks'

/** Temporary placeholder used while a page is being built. */
export function PageStub({ title, owner }: { title: string; owner: string }) {
  usePageTitle(title)
  return (
    <div className="page-gutter mx-auto max-w-page py-16">
      <PageHeader title={title} lede={`Page stub — owner: ${owner}`} />
    </div>
  )
}
