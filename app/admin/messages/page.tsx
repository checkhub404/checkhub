import Link from 'next/link'

type Row = {
  id: string
  title: string
  createdAt: string
  isBroadcast: boolean
  targetBranch?: { name: string | null, code: string | null } | null
}

async function fetchAdminMessages(): Promise<Row[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const res = await fetch(`${base}/api/messages`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function AdminMessagesPage() {
  const rows = await fetchAdminMessages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">پیام‌ها (ادمین)</h1>
        <a href="/admin/messages/new" className="btn btn-primary">پیام جدید</a>
      </div>

      <div className="grid gap-3">
        {rows.map((m) => {
          const faDate = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(m.createdAt))
          return (
            <Link key={m.id} href={`/messages/${m.id}`} className="card p-4 hover:shadow transition">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{m.title}</div>
                <div className="text-xs text-gray-500">{faDate}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {m.isBroadcast ? 'سراسری' : `برای شعبه: ${m.targetBranch?.name ?? ''}`}
              </div>
            </Link>
          )
        })}

        {rows.length === 0 && <div className="text-gray-500">پیامی وجود ندارد.</div>}
      </div>
    </div>
  )
}
