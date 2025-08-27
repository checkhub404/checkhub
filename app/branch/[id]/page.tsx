'use client'
import useSWR from 'swr'
import { useParams } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const statusColor = (s: string) => ({
  OPEN: 'bg-orange-100 text-orange-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-green-100 text-green-700',
  RETURNED: 'bg-rose-100 text-rose-700'
} as any)[s] || 'bg-gray-100'

export default function BranchInbox() {
  const { id } = useParams<{ id: string }>() as any
  const { data, isLoading } = useSWR(`/api/tickets?branchCode=${id}`, fetcher)

  if (isLoading) return <div>در حال بارگذاری…</div>

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-bold">کارتابل شعبه: {id}</h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {(data || []).map((t: any) => (
          <article className="card p-5" key={t.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs text-gray-500 mt-1">دانش‌آموز: {t.cheque?.student?.fullName ?? '—'}</div>
              </div>
              <span className={`badge ${statusColor(t.status)}`}>{t.status}</span>
            </div>
            <p className="text-sm text-gray-700 mt-3 line-clamp-3">{t.description}</p>
            <div className="mt-4 text-xs text-gray-500">اولویت: {t.priority}</div>

            {/* لینک به صفحهٔ جزئیات */}
            <a className="btn btn-primary w-full mt-4" href={`/tickets/${t.id}`}>باز کردن</a>
          </article>
        ))}
        {!data?.length && <div className="text-sm text-gray-500">برای این شعبه تیکتی ثبت نشده.</div>}
      </div>
    </section>
  )
}
