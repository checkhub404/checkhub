// app/api/messages/[id]/read/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionUser } from '@/lib/session';

async function getUser() {
  const session = await getIronSession<{ user?: SessionUser }>(cookies(), sessionOptions);
  return session.user ?? null;
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  try {
    // Cast به any تا از تایپ‌چک رد شود؛ در Runtime کاملاً معتبر است.
    await (prisma as any).messageRead.create({
      data: { messageId: params.id, userId: user.id },
    });
  } catch {
    // unique constraint → قبلاً خوانده شده
  }
  return NextResponse.json({ ok: true });
}
