// components/NavUser.tsx
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Me = {
  username: string
  role: "ADMIN" | "USER"
}

export default function NavUser() {
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setMe(data))
      .catch(() => setMe(null))
  }, [])

  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link className="btn" href="/">خانه</Link>
      <Link className="btn" href="/dashboard">داشبورد</Link>

      {/* صندوق پیام برای همه‌ی کاربران */}
      <Link className="btn" href="/messages">صندوق پیام</Link>

      {/* مدیریت شعبه‌ها فقط برای ادمین */}
      {me?.role === "ADMIN" && (
        <>
          <Link className="btn" href="/admin">ادمین</Link>
          <Link className="btn" href="/admin/branches">مدیریت شعبه‌ها</Link>
        </>
      )}

      <Link className="btn btn-primary" href="/tickets/new">تیکت جدید</Link>
      <Link className="btn" href="/login">ورود</Link>
    </nav>
  )
}
