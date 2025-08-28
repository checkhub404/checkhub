'use client';

import { useEffect, useMemo, useState } from 'react';

export default function NowCard() {
  const [now, setNow] = useState<Date>(() => new Date());

  // هر ثانیه بروزرسانی
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // قالب‌بندی تاریخ/ساعت به فارسی
  const dateStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(now);
    } catch {
      return now.toLocaleDateString('fa-IR');
    }
  }, [now]);

  const timeStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
    } catch {
      return now.toLocaleTimeString('fa-IR');
    }
  }, [now]);

  return (
    <div className="rounded-2xl bg-white/80 shadow-soft p-5 border border-white/50">
      <div className="text-sm text-gray-500 mb-1">زمان سامانه</div>
      <div className="text-2xl font-bold">{timeStr}</div>
      <div className="text-gray-600 mt-1">{dateStr}</div>
    </div>
  );
}
