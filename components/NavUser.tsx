'use client'
import useSWR from 'swr'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function NavUser() {
  const { data } = useSWR('/api/me', fetcher, { refreshInterval: 15000 })
  const user = data?.user

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    window.location.reload()
  }

  // لینک‌های عمومی
  const items: JSX.Element[] = [
    <a key="home" className="btn" href="/">خانه</a>,
    <a key="dashboard" className="btn" href="/dashboard">داشبورد</a>,
    <a key="new-ticket" className="btn btn-primary" href="/tickets/new">تیکت جدید</a>,
  ]

  // کاربر لاگین نشده
  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        {items}
        <a className="btn" href="/login">ورود</a>
      </div>
    )
  }

  // لینک‌های مشترک
  const common = [
    <a key="account" className="btn" href="/account">حساب کاربری</a>,
    <button key="logout" className="btn" onClick={logout}>خروج</button>,
  ]

  // ادمین
  if (user.role === 'ADMIN') {
    return (
      <div className="flex items-center gap-3 text-sm">
        {items}
        <a key="admin" className="btn" href="/admin">ادمین</a>
        {common}
      </div>
    )
  }

  // کاربر غیر ادمین
  return (
    <div className="flex items-center gap-3 text-sm">
      {items}
      {common}
    </div>
  )
}
