// lib/session.ts
import { SessionOptions } from 'iron-session';

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role: string;            // "ADMIN" | "BRANCH" | "VIEWER" | ...
  branchId?: string | null;
  branchCode?: string | null;
};

export const sessionOptions: SessionOptions = {
  cookieName: 'checkhub_session',
  password:
    process.env.SESSION_PASSWORD ??
    // فقط برای توسعه؛ در پروداکشن حتماً SESSION_PASSWORD ست شود (حداقل 32 کاراکتر)
    'DEV_ONLY___CHANGE_ME_WITH_A_LONG_RANDOM_SECRET_32CHARS_MIN',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

// ➜ ماژول آگمنتیشن: به IronSessionData فیلد user اضافه می‌کنیم تا TS بلد باشد.
declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionUser;
  }
}
