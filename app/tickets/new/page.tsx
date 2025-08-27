'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// تقویم شمسی
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

type FormState = {
  targetBranchCode: string
  studentCode: string
  fullName: string
  grade: string
  guardian: string
  phone: string
  sayadiId: string
  bank: string
  accountNo: string
  amount: string
  dueDate: Date | '' // در state به Date نگه می‌داریم
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function NewTicketPage() {
  const { data: branches } = useSWR('/api/branches', fetcher)
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    targetBranchCode: '',
    studentCode: '',
    fullName: '',
    grade: '',
    guardian: '',
    phone: '',
    sayadiId: '',
    bank: '',
    accountNo: '',
    amount: '',
    dueDate: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
  })
  const [busy, setBusy] = useState(false)

  function input<K extends keyof FormState>(k: K) {
    return {
      value: form[k] as any,
      onChange: (e: any) => setForm(prev => ({ ...prev, [k]: e.target.value })),
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/tickets/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount || 0),
          dueDate: form.dueDate ? (form.dueDate as Date).toISOString() : null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'ثبت تیکت ناموفق بود')
      router.push(`/branch/${form.targetBranchCode}`)
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="grid gap-6">
      <div className="card p-6">
        <h1 className="text-xl font-bold">ثبت تیکت جدید</h1>

        <form onSubmit={submit} className="mt-4 grid gap-4">
          {/* مقصد */}
          <div className="grid md:grid-cols-1 gap-4">
            <div>
              <label className="text-sm">شعبه مقصد</label>
              <select className="border rounded-xl px-3 py-2 w-full" {...input('targetBranchCode')}>
                <option value="">انتخاب کنید…</option>
                {(branches ?? []).map((b: any) => (
                  <option key={b.id} value={b.code}>
                    {b.code} — {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* دانش‌آموز */}
          <div className="card p-4 grid gap-3">
            <div className="font-semibold">اطلاعات دانش‌آموز</div>
            <div className="grid md:grid-cols-3 gap-3">
              <input className="border rounded-xl px-3 py-2" placeholder="کُد دانش‌آموز (الزامی)" {...input('studentCode')} />
              <input className="border rounded-xl px-3 py-2" placeholder="نام و نام خانوادگی (الزامی)" {...input('fullName')} />
              <input className="border rounded-xl px-3 py-2" placeholder="پایه/کلاس" {...input('grade')} />
              <input className="border rounded-xl px-3 py-2" placeholder="ولی" {...input('guardian')} />
              <input className="border rounded-xl px-3 py-2" placeholder="شماره تماس" {...input('phone')} />
            </div>
          </div>

          {/* چک */}
          <div className="card p-4 grid gap-3">
            <div className="font-semibold">اطلاعات چک</div>
            <div className="grid md:grid-cols-3 gap-3">
              <input className="border rounded-xl px-3 py-2" placeholder="شناسه صیادی" {...input('sayadiId')} />
              <input className="border rounded-xl px-3 py-2" placeholder="بانک" {...input('bank')} />
              <input className="border rounded-xl px-3 py-2" placeholder="شماره حساب" {...input('accountNo')} />

              {/* تاریخ سررسید (شمسی) */}
              <div className="relative z-[60]"> {/* z-index بالا تا پاپ‌آپ پشت کارت نره */}
                <label className="text-sm">تاریخ سررسید</label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={form.dueDate || undefined}
                  onChange={(date: any) => {
                    const jsDate: Date | '' = date?.toDate ? date.toDate() : ''
                    setForm(prev => ({ ...prev, dueDate: jsDate }))
                  }}
                  inputClass="border rounded-xl px-3 py-2 w-full"
                  calendarPosition="bottom-right"
                  editable        // اجازه تایپ
                  portal          // پاپ‌آپ روی body
                  style={{ width: '100%' }}
                  containerStyle={{ width: '100%' }}
                />
              </div>

              <input className="border rounded-xl px-3 py-2" placeholder="مبلغ (ریال)" {...input('amount')} />
            </div>
          </div>

          {/* جزئیات تیکت */}
          <div className="card p-4 grid gap-3">
            <div className="font-semibold">جزئیات تیکت</div>
            <input className="border rounded-xl px-3 py-2" placeholder="عنوان (الزامی)" {...input('title')} />
            <textarea className="border rounded-xl px-3 py-2" placeholder="توضیحات" {...input('description')} />
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm">اولویت</label>
                <select className="border rounded-xl px-3 py-2 w-full" {...input('priority')}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>
          </div>

          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? 'در حال ثبت…' : 'ثبت تیکت'}
          </button>
        </form>
      </div>
    </section>
  )
}
