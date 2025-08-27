'use client'
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Dashboard() {
  const { data: tickets } = useSWR('/api/tickets', fetcher)
  const { data: cheques } = useSWR('/api/cheques?status=PENDING', fetcher)

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm text-gray-500">تیکت‌های باز</div>
          <div className="text-3xl font-bold mt-2">{tickets?.length ?? 0}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500">چک‌های در انتظار</div>
          <div className="text-3xl font-bold mt-2">{cheques?.length ?? 0}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500">میانگین سررسید آینده</div>
          <div className="text-3xl font-bold mt-2">—</div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">کارتابل شعبه (نمونه)</h2>
          <a href="/branch/demo" className="btn btn-primary">مشاهده کارتابل نمونه</a>
        </div>
        <p className="text-sm text-gray-600 mt-2">برای شروع، یک شعبه و تیکت نمونه بسازید یا از Seed بعداً استفاده کنید.</p>
      </div>
    </div>
  )
}
