import { IronSessionOptions } from 'iron-session'

export const sessionOptions: IronSessionOptions = {
  cookieName: 'checkhub_session',
  password: process.env.SESSION_PASSWORD || 'change-this-to-a-long-secret-32chars',
  cookieOptions: {
    secure: false, // در محیط تولید true
  },
}

// چه چیزهایی را توی سشن نگه داریم
export type SessionUser = {
  id: string
  email: string
  role: 'ADMIN' | 'BRANCH' | 'VIEWER'
  branchCode?: string | null
}
