import type { Metadata } from 'next'
import './globals.css'
import MessagesNavLink from '@/components/MessagesNavLink'

export const metadata: Metadata = {
  title: 'کارتابل مدیریت چک',
  description: 'سامانه‌ی کارتابل مدیریت چک‌های شهریه مدارس',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh text-gray-800">
        {/* پس‌زمینه‌ی لطیف */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-50 to-indigo-50 bg-grid" />
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl" />
          <div className="absolute top-1/2 -right-20 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
        </div>

        <header className="border-b border-white/60 bg-white/70 backdrop-blur sticky top-0 z-40">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white grid place-items-center font-bold shadow-soft">
                چ
              </div>
              <span className="font-bold text-lg">کارتابل مدیریت چک</span>
            </div>

            <nav className="flex items-center gap-3 text-sm">
              <a className="btn" href="/">خانه</a>
              <a className="btn" href="/dashboard">داشبورد</a>
              <MessagesNavLink />
              <a className="btn" href="/admin/branches">مدیریت شعبه‌ها</a>
              <a className="btn btn-primary" href="/tickets/new">تیکت جدید</a>
              <a className="btn" href="/login">ورود</a>
            </nav>
          </div>
        </header>

        <main className="container py-8">{children}</main>

        <footer className="container py-10 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} CheckHub
        </footer>
      </body>
    </html>
  )
}
