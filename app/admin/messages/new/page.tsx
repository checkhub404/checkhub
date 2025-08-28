'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Branch = { id: string; name: string; code: string };

export default function NewMessagePage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [targetBranchId, setTargetBranchId] = useState<string>('');

  useEffect(() => {
    fetch('/api/branches', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => setBranches(data ?? []))
      .catch(() => setBranches([]));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title, body,
        isBroadcast,
        targetBranchId: isBroadcast ? null : targetBranchId || null,
      }),
    })
    if (res.ok) router.push('/admin/messages');
    else {
      const j = await res.json().catch(() => ({}));
      alert(j?.error || 'خطا در ثبت پیام');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">پیام جدید</h1>
      <form onSubmit={onSubmit} className="card p-5 space-y-4">
        <div>
          <label className="block text-sm mb-1">عنوان</label>
          <input className="w-full border rounded-xl p-2" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm mb-1">متن پیام</label>
          <textarea className="w-full border rounded-xl p-3 min-h-[160px]" value={body} onChange={e => setBody(e.target.value)} required />
        </div>

        <div className="flex items-center gap-3">
          <input id="broadcast" type="checkbox" checked={isBroadcast} onChange={e => setIsBroadcast(e.target.checked)} />
          <label htmlFor="broadcast">ارسال سراسری (به همه شعب)</label>
        </div>

        {!isBroadcast && (
          <div>
            <label className="block text-sm mb-1">انتخاب شعبه</label>
            <select className="w-full border rounded-xl p-2" value={targetBranchId} onChange={e => setTargetBranchId(e.target.value)} required>
              <option value="">— یک شعبه را انتخاب کنید —</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="btn btn-primary" type="submit">ارسال پیام</button>
          <a className="btn" href="/admin/messages">انصراف</a>
        </div>
      </form>
    </div>
  )
}
