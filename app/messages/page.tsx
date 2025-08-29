// app/messages/page.tsx
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionUser } from "@/lib/session"
import prisma from "@/lib/prisma"
import Link from "next/link"

async function getUser() {
  const session = await getIronSession<SessionUser>(cookies(), sessionOptions)
  return session.user ?? null
}

export default async function MessagesPage() {
  const me = await getUser()
  if (!me) {
    return (
      <div className="container">
        <div className="card p-8 mt-6 text-center">
          <p>برای مشاهده صندوق پیام وارد شوید.</p>
          <Link className="btn btn-primary mt-4" href="/login">ورود</Link>
        </div>
      </div>
    )
  }

  // اگر جدول هنوز ساخته نشده باشد، اینجا خطا می‌داد؛ با try/catch هندل می‌کنیم
  let messages: {id:string; title:string; createdAt: Date}[] = []
  try {
    messages = await prisma.message.findMany({
      where: me.role === "ADMIN"
        ? {} // ادمین همه پیام‌ها را می‌بیند
        : {
            OR: [
              { toAll: true },
              { branchId: me.branchId ?? undefined }
            ]
          },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    })
  } catch {
    // اگر جدول نبود، پیام راهنما
    return (
      <div className="container">
        <div className="card p-8 mt-6 text-center">
          <p>در حال آماده‌سازی صندوق پیام...</p>
          <p className="text-gray-500 mt-2">اگر اولین‌بار است دیپلوی می‌کنید، چند لحظه بعد صفحه را رفرش کنید.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-xl font-bold mb-4">صندوق پیام</h1>

      {messages.length === 0 ? (
        <div className="card p-8 text-center">
          <p>فعلاً پیامی ندارید.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {messages.map(m => (
            <Link key={m.id} href={`/messages/${m.id}`} className="card p-5 hover:shadow">
              <div className="flex items-center justify-between">
                <span className="font-medium">{m.title}</span>
                <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString("fa-IR")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
