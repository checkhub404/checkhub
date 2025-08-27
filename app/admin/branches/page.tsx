'use client'
import useSWR from 'swr'
import { useState } from 'react'

type Branch = { id: string; code: string; name: string; isActive: boolean }
const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function AdminBranchesPage() {
  const { data, mutate, isLoading } = useSWR<Branch[]>('/api/branches', fetcher)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)

  async function createBranch(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), name: name.trim() }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'ثبت شعبه ناموفق بود')
      setMsg({ ok: 'شعبه با موفقیت ایجاد شد.' })
      setCode(''); setName('')
      mutate()
    } catch (e: any) {
      setMsg({ err: e.message })
    } finally {
      setBusy(false)
    }
  }

  async function deleteBranch(id: string) {
    setMsg(null)
    if (!confirm('حذف این شعبه انجام شود؟')) return

    // تلاش حذف عادی
    let res = await fetch(`/api/branches/${id}`, { method: 'DELETE' })
    let j = await res.json().catch(() => ({}))

    // اگر نیاز به حذف اجباری بود:
    if (!res.ok && j?.requireForce) {
      const ok = confirm('این شعبه وابستگی دارد. حذف اجباری انجام شود؟ این کار غیرقابل بازگشت است.')
      if (!ok) return
      res = await fetch(`/api/branches/${id}?force=1`, { method: 'DELETE' })
      j = await res.json().catch(() => ({}))
    }

    if (!res.ok) {
      setMsg({ err: j?.error || 'حذف شعبه ناموفق بود' })
      return
    }

    setMsg({ ok: 'شعبه حذف شد.' })
    mutate()
  }

  return (
    <section className="grid gap-6">
      <h1 className="text-xl font-bold">مدیریت شعبه‌ها</h1>

      <form onSubmit={createBranch} className="card p-4 grid sm:grid-cols-3 gap-3">
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'در حال ایجاد…' : 'ایجاد شعبه'}
        </button>
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="نام شعبه"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="کُد شعبه (مثل BR-005)"
          value={code}
          onChange={e=>setCode(e.target.value)}
        />

        {msg?.err && <div className="text-rose-600 text-sm col-span-full">{msg.err}</div>}
        {msg?.ok && <div className="text-green-700 text-sm col-span-full">{msg.ok}</div>}
      </form>

      <div className="card p-4">
        <div className="font-semibold mb-3">لیست شعبه‌ها</div>
        {isLoading && <div className="text-sm text-gray-500">در حال بارگذاری…</div>}
        <div className="grid gap-2">
          {(data ?? []).map(b => (
            <div key={b.id} className="flex items-center justify-between border rounded-xl px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="badge">{b.code}</span>
                <span>{b.name}</span>
                {!b.isActive && <span className="text-xs text-gray-500">(غیرفعال)</span>}
              </div>
              <div className="flex items-center gap-2">
                <a className="btn" href={`/branch/${b.code}`}>کارتابل</a>
                <button className="btn" onClick={() => deleteBranch(b.id)}>حذف</button>
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && !isLoading && (
            <div className="text-sm text-gray-500">هنوز شعبه‌ای ثبت نشده است.</div>
          )}
        </div>
      </div>
    </section>
  )
}
