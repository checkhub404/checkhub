'use client'
import { useEffect, useState } from 'react'

export default function AccountPage(){
  const [me, setMe] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })

  useEffect(()=>{ fetch('/api/me').then(r=>r.json()).then(d=>setMe(d.user)) },[])

  async function changePass(e: React.FormEvent){
    e.preventDefault()
    setBusy(true); setMsg(null); setErr(null)
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'خطا در تغییر پسورد')
      setMsg('پسورد با موفقیت تغییر کرد.')
      setForm({ currentPassword:'', newPassword:'' })
    } catch(e:any){ setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <section className="grid gap-6 max-w-lg">
      <div className="card p-6">
        <h1 className="text-xl font-bold">حساب کاربری</h1>
        {me ? (
          <>
            <div className="text-sm mt-2">ایمیل: <b className="font-mono">{me.email}</b></div>
            <div className="text-sm">نقش: {me.role}</div>
            {me.branchCode && <div className="text-sm">شعبه: {me.branchCode}</div>}
          </>
        ) : <div className="text-sm text-gray-500">در حال بارگذاری…</div>}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-3">تغییر پسورد</h2>
        {msg && <div className="text-green-700 text-sm mb-2">{msg}</div>}
        {err && <div className="text-rose-600 text-sm mb-2">{err}</div>}
        <form onSubmit={changePass} className="grid gap-3">
          <input className="border rounded-xl px-3 py-2" type="password" placeholder="پسورد فعلی" value={form.currentPassword} onChange={e=>setForm(f=>({...f, currentPassword:e.target.value}))}/>
          <input className="border rounded-xl px-3 py-2" type="password" placeholder="پسورد جدید" value={form.newPassword} onChange={e=>setForm(f=>({...f, newPassword:e.target.value}))}/>
          <button className="btn btn-primary" disabled={busy}>{busy?'در حال ثبت…':'ثبت'}</button>
        </form>
      </div>
    </section>
  )
}
