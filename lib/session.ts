// lib/session.ts
import type { SessionOptions } from 'iron-session'

export const sessionOptions: SessionOptions = {
  cookieName: 'checkhub_session',
  password: process.env.SESSION_PASSWORD || 'change-this-to-a-long-secret-32chars',
  cookieOptions: {
    // روی فری/تست معمولاً http بدون https است
    secure: false,
  },
}

export type SessionUser = {
  id: string
  email: string
  role: 'ADMIN' | 'BRANCH' | 'VIEWER'
  branchCode?: string | null
}
