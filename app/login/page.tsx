'use client'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [me, setMe] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/me').then(r=>r.json()).then(d=>setMe(d.user))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'ورود ناموفق بود')
      // هدایت: ادمین → داشبورد | شعبه → کارتابل شعبه خودش
      const me = await fetch('/api/me').then(r=>r.json())
      if (me?.user?.role === 'BRANCH' && me?.user?.branchCode) {
        window.location.href = `/branch/${me.user.branchCode}`
      } else {
        window.location.href = '/dashboard'
      }
    } catch (e:any) {
      setError(e.message)
    } finally { setBusy(false) }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <section className="grid gap-6 max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="text-xl font-bold mb-4">{me ? 'حساب کاربری' : 'ورود'}</h1>
        {me ? (
          <div className="grid gap-3">
            <div className="text-sm">وارد شده‌اید: <b className="font-mono">{me.email}</b> ({me.role})</div>
            {me.branchCode && <div className="text-sm">شعبه: <b className="font-mono">{me.branchCode}</b></div>}
            <div className="grid grid-cols-2 gap-2">
              <a className="btn" href="/dashboard">داشبورد</a>
              {me.branchCode && <a className="btn" href={`/branch/${me.branchCode}`}>کارتابل شعبه</a>}
            </div>
            <button className="btn btn-primary w-full" onClick={logout}>خروج</button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-3">
            {error && <div className="text-sm text-rose-600">{error}</div>}
            <input className="border rounded-xl px-3 py-2" placeholder="ایمیل" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="border rounded-xl px-3 py-2" type="password" placeholder="پسورد" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="btn btn-primary" disabled={busy}>{busy?'در حال ورود…':'ورود'}</button>
          </form>
        )}
      </div>
    </section>
  )
}
