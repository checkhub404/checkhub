'use client'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function TicketDetailPage(){
  const { id } = useParams<{id:string}>() as any
  const { data: t, isLoading, mutate } = useSWR(`/api/tickets/${id}`, fetcher)
  const router = useRouter()

  // وقتی صفحه باز می‌شود، تیکت را «خوانده شد» علامت بزن
  useEffect(() => {
    if (!id) return
    fetch(`/api/tickets/${id}/read`, { method: 'POST' }).then(()=>mutate())
  }, [id, mutate])

  if (isLoading) return <div className="text-center py-10">در حال بارگذاری…</div>
  if (!t || t.error) return <div className="text-center py-10">تیکت پیدا نشد.</div>

  // این فیلد را از سشن سریع می‌خوانیم تا بدانیم ادمین است یا نه
  // (می‌توانی این را به یک هوک مشترک تبدیل کنی؛ فعلاً ساده:)
  const isAdmin = typeof document !== 'undefined'
    ? document.cookie.includes('checkhub_session') && (t._sessionRole === undefined) // fallback
    : false

  async function remove() {
    if (!confirm('حذف این تیکت قطعی است. ادامه می‌دهید؟')) return
    const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' })
    const j = await res.json()
    if (!res.ok) return alert(j?.error || 'حذف ناموفق بود')
    alert('تیکت حذف شد')
    router.push('/') // یا برگرد به لیست
  }

  const readBy = (t.reads || []).map((r:any)=> r.user?.email).filter(Boolean)

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{t.title}</h1>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={()=>router.back()}>بازگشت</button>
          {/* دکمهٔ حذف فقط برای ادمین (کنترل اصلی سمت API است) */}
          <button className="btn btn-primary" onClick={remove}>حذف تیکت</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-4">
          <div className="card p-5">
            <div className="text-sm text-gray-600 mb-2">
              وضعیت: <b>{t.status}</b> | اولویت: <b>{t.priority}</b>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{t.description || '—'}</p>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-3">فعالیت‌ها</div>
            {!t.activities?.length && <div className="text-sm text-gray-500">فعلاً فعالیتی ثبت نشده.</div>}
            <ul className="grid gap-2">
              {t.activities?.map((a:any)=>(
                <li key={a.id} className="text-sm">
                  <span className="font-mono text-xs text-gray-500">
                    {new Date(a.createdAt).toLocaleString('fa-IR')}
                  </span>
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

          <div className="card p-5">
            <div className="font-semibold mb-3">وضعیت مطالعه</div>
            {readBy.length
              ? <div className="text-sm">خوانده‌شده توسط: {readBy.join(' ، ')}</div>
              : <div className="text-sm text-gray-500">هنوز کسی این تیکت را نخوانده است.</div>}
          </div>
        </aside>
      </div>
    </section>
  )
}
