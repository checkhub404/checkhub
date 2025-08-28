import Link from 'next/link'

type Item = {
  id: string
  title: string
  createdAt: string
  isBroadcast: boolean
  targetBranch?: { name: string | null, code: string | null } | null
  reads: { id: string }[]
}

async function fetchMessages(): Promise<Item[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const res = await fetch(`${base}/api/messages`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function MessagesPage() {
  const items = await fetchMessages()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">صندوق پیام</h1>

      <div className="grid gap-3">
        {items.map((m) => {
          const date = new Date(m.createdAt)
          const faDate = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
          const unread = m.reads.length === 0

          return (
            <Link href={`/messages/${m.id}`} key={m.id} className="card p-4 hover:shadow transition">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {unread && <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />}
                  <div className="font-semibold">{m.title}</div>
                </div>
                <div className="text-xs text-gray-500">{faDate}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {m.isBroadcast ? 'پیام سراسری' : `برای شعبه: ${m.targetBranch?.name ?? ''}`}
              </div>
            </Link>
          )
        })}

        {items.length === 0 && <div className="text-gray-500">پیامی یافت نشد.</div>}
      </div>
    </div>
  )
}
