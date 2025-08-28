'use client';

import { useEffect, useState } from 'react';

export default function MessagesNavLink() {
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    let stop = false;

    async function fetchUnread() {
      try {
        const res = await fetch('/api/messages?unread=1', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!stop) setUnread(data?.count || 0);
      } catch {}
    }

    fetchUnread();
    const id = setInterval(fetchUnread, 15000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  return (
    <a href="/messages" className="btn relative">
      صندوق پیام
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-white text-xs px-1">
          {unread}
        </span>
      )}
    </a>
  );
}
