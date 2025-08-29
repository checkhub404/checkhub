// app/api/messages/[id]/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionUser } from "@/lib/session"

async function getUser() {
  const session = await getIronSession<SessionUser>(cookies(), sessionOptions)
  return session.user ?? null
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const me = await getUser()
  if (!me) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const msg = await prisma.message.findFirst({
    where: me.role === "ADMIN"
      ? { id: params.id }
      : {
          id: params.id,
          OR: [
            { toAll: true },
            { branchId: me.branchId ?? undefined }
          ]
        },
    include: { reads: { where: { userId: me.id }, select: { id: true } } }
  })

  if (!msg) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  // اگر نخوانده، ثبت خواندن
  if (msg.reads.length === 0) {
    await prisma.messageRead.create({ data: { messageId: msg.id, userId: me.id } })
  }

  return NextResponse.json({
    id: msg.id,
    title: msg.title,
    body: msg.body,
    createdAt: msg.createdAt
  })
}
