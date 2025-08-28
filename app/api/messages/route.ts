// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionUser } from '@/lib/session';

async function getUser() {
  // نکته مهم: حتماً generic را { user?: SessionUser } بزنیم
  const session = await getIronSession<{ user?: SessionUser }>(cookies(), sessionOptions);
  return session.user ?? null;
}

// GET: پیام‌های قابل مشاهده برای یوزر فعلی. ?unread=1 فقط تعداد نخوانده‌ها
export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const unreadOnly = req.nextUrl.searchParams.get('unread') === '1';

  const where: any = {
    OR: [
      { isBroadcast: true },
      ...(user.branchCode ? [{ targetBranch: { code: user.branchCode } }] : []),
    ],
  };

  if (unreadOnly) {
    const count = await prisma.message.count({
      where: { ...where, reads: { none: { userId: user.id } } },
    });
    return NextResponse.json({ count });
  }

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      isBroadcast: true,
      targetBranch: { select: { name: true, code: true } },
      reads: { where: { userId: user.id }, select: { id: true } },
    },
  });

  return NextResponse.json(messages);
}

// POST: فقط ادمین می‌تواند پیام بسازد
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const { title, body, isBroadcast, targetBranchId } = await req.json();

  if (!title || !body) {
    return NextResponse.json({ error: 'عنوان و متن الزامی است' }, { status: 400 });
  }
  if (!isBroadcast && !targetBranchId) {
    return NextResponse.json({ error: 'برای پیام غیرسراسری، انتخاب شعبه لازم است' }, { status: 400 });
  }

  const msg = await prisma.message.create({
    data: {
      title,
      body,
      isBroadcast: !!isBroadcast,
      targetBranchId: isBroadcast ? null : targetBranchId,
      createdById: user.id,
    },
  });

  return NextResponse.json({ id: msg.id }, { status: 201 });
}
