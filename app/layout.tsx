// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'

// به‌جای '@/components/NavUser' از مسیر نسبی استفاده می‌کنیم:
const NavUser = dynamic(() => import('../components/NavUser'), { ssr: false })

export const metadata: Metadata = {
  title: 'کارتابل مدیریت چک',
  description: 'سامانه‌ی کارتابل مدیریت چک‌های شهریه مدارس',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <header className="border-b border-white/60 bg-white/60 backdrop-blur sticky top-0 z-40">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white grid place-items-center font-bold shadow-soft">چ</div>
              <span className="font-bold text-lg">کارتابل مدیریت چک</span>
            </div>
            <NavUser />
          </div>
        </header>

        <main className="container py-8">{children}</main>

        <footer className="container py-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CheckHub
        </footer>
      </body>
    </html>
  )
}
