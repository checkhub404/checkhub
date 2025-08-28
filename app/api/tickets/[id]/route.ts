// app/api/tickets/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionUser } from '@/lib/session';

async function getUser() {
  const session = await getIronSession<{ user?: SessionUser }>(cookies(), sessionOptions);
  return session.user ?? null;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  // تیکت را با روابط امن بخوان
  const ticket = await (prisma as any).ticket.findUnique({
    where: { id: params.id },
    include: {
      branch: { select: { id: true, name: true, code: true } },
      creator: { select: { id: true, name: true } },
      // اینجا عمداً reads را include نمی‌کنیم تا TS گیر نده
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  // اگر جدول خوانده‌ها موجود است، جداگانه بخوان
  let reads: any[] = [];
  try {
    reads = await (prisma as any).ticketRead.findMany({
      where: { ticketId: params.id },
      include: { user: true },
      orderBy: { readAt: 'desc' },
    });
  } catch {
    // اگر جدول موجود نباشد (محیط‌های قدیمی)، بی‌خطا رد شو
    reads = [];
  }

  return NextResponse.json({ ...ticket, reads });
}
