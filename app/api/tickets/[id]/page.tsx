'use client'
import useSWR from 'swr'
import { useParams, useRouter } from 'next/navigation'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function TicketDetailPage(){
  const { id } = useParams<{id:string}>() as any
  const { data: t, isLoading } = useSWR(`/api/tickets/${id}`, fetcher)
  const router = useRouter()

  if (isLoading) return <div>در حال بارگذاری…</div>
  if (!t) return <div>تیکت پیدا نشد.</div>

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t.title}</h1>
        <button className="btn" onClick={()=>router.back()}>برگشت</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-4">
          <div className="card p-5">
            <div className="text-sm text-gray-600 mb-2">وضعیت: <b>{t.status}</b> | اولویت: <b>{t.priority}</b></div>
            <p className="text-gray-800 whitespace-pre-wrap">{t.description || '—'}</p>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-3">فعالیت‌ها</div>
            {!t.activities?.length && <div className="text-sm text-gray-500">فعلاً فعالیتی ثبت نشده.</div>}
            <ul className="grid gap-2">
              {t.activities?.map((a:any)=>(
                <li key={a.id} className="text-sm">
                  <span className="font-mono text-xs text-gray-500">{new Date(a.createdAt).toLocaleString('fa-IR')}</span>
                  {' — '}<b>{a.type}</b>{a.note? `: ${a.note}`:''}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="card p-5">
            <div className="font-semibold mb-3">دانش‌آموز</div>
            <div className="text-sm">نام: {t.cheque?.student?.fullName || '—'}</div>
            <div className="text-sm">کُد: {t.cheque?.student?.code || '—'}</div>
            <div className="text-sm">شعبه دانش‌آموز: {t.cheque?.branch?.code} — {t.cheque?.branch?.name}</div>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-3">چک</div>
            <div className="text-sm">بانک: {t.cheque?.bank || '—'}</div>
            <div className="text-sm">مبلغ: {t.cheque?.amount?.toLocaleString('fa-IR') || '—'} ریال</div>
            <div className="text-sm">سررسید: {t.cheque?.dueDate ? new Date(t.cheque.dueDate).toLocaleDateString('fa-IR') : '—'}</div>
            <div className="text-sm">وضعیت: {t.cheque?.status}</div>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-3">ارجاع</div>
            <div className="text-sm">از: {t.sourceBranch?.code} — {t.sourceBranch?.name}</div>
            <div className="text-sm">به: {t.targetBranch?.code} — {t.targetBranch?.name}</div>
            <div className="text-sm">ایجادکننده: {t.createdBy?.email}</div>
          </div>
        </aside>
      </div>
    </section>
  )
}
