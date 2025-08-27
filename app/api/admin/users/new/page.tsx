'use client'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function NewUserPage(){
  const { data: branches } = useSWR('/api/branches', fetcher)
  const [form, setForm] = useState({ email:'', name:'', role:'BRANCH', branchCode:'', password:'' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setBusy(true); setMsg(null); setErr(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'ثبت کاربر ناموفق بود')
      setMsg('کاربر با موفقیت ایجاد شد.')
      setForm({ email:'', name:'', role:'BRANCH', branchCode:'', password:'' })
    } catch(e:any){ setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <section className="grid gap-6 max-w-lg">
      <div className="card p-6">
        <h1 className="text-xl font-bold">ایجاد کاربر جدید</h1>
        {msg && <div className="text-green-700 text-sm mt-2">{msg}</div>}
        {err && <div className="text-rose-600 text-sm mt-2">{err}</div>}
        <form onSubmit={submit} className="grid gap-3 mt-4">
          <input className="border rounded-xl px-3 py-2" placeholder="ایمیل" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))}/>
          <input className="border rounded-xl px-3 py-2" placeholder="نام" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
          <div className="grid grid-cols-2 gap-3">
            <select className="border rounded-xl px-3 py-2" value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))}>
              <option value="ADMIN">ADMIN</option>
              <option value="BRANCH">BRANCH</option>
              <option value="VIEWER">VIEWER</option>
            </select>
            {form.role==='BRANCH' && (
              <select className="border rounded-xl px-3 py-2" value={form.branchCode} onChange={e=>setForm(f=>({...f, branchCode:e.target.value}))}>
                <option value="">کُد شعبه…</option>
                {(branches ?? []).map((b:any)=> <option key={b.id} value={b.code}>{b.code} — {b.name}</option>)}
              </select>
            )}
          </div>
          <input className="border rounded-xl px-3 py-2" type="password" placeholder="پسورد" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))}/>
          <button className="btn btn-primary" disabled={busy}>{busy?'در حال ایجاد…':'ایجاد کاربر'}</button>
        </form>
      </div>
    </section>
  )
}
