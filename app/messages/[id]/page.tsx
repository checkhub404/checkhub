import { notFound } from 'next/navigation'

async function getMessage(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const res = await fetch(`${base}/api/messages/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch message')
  return res.json()
}

async function markRead(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  await fetch(`${base}/api/messages/${id}/read`, { method: 'POST', cache: 'no-store' }).catch(() => {})
}

export default async function MessageDetail({ params }: { params: { id: string } }) {
  const msg = await getMessage(params.id)
  if (!msg) notFound()

  await markRead(params.id)

  const faDate = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(msg.createdAt))

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">{msg.title}</h1>
          <div className="text-xs text-gray-500">{faDate}</div>
        </div>
        <div className="mt-3 text-gray-700 leading-8 whitespace-pre-wrap">{msg.body}</div>
        <div className="mt-4 text-xs text-gray-500">
          {msg.isBroadcast ? 'پیام سراسری' : `مخاطب: ${msg.targetBranch?.name ?? '—'}`}
        </div>
      </div>
    </div>
  )
}
