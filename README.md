# کارتابل مدیریت چک – MVP

## راه‌اندازی سریع
1) پیش‌نیاز: Node 20+ ، Docker (اختیاری)، Git/Terminal  
2) نصب وابستگی‌ها:
```bash
npm install
```
3) ساخت فایل محیطی:
```bash
cp .env.example .env
```
4) دیتابیس Postgres با Docker:
```bash
docker compose up -d
```
5) ساخت جداول:
```bash
npx prisma migrate dev
```
6) اجرای توسعه:
```bash
npm run dev
```
سپس باز کنید: http://localhost:3000

## مسیرهای مهم
- داشبورد: `/dashboard`
- کارتابل شعبه نمونه: `/branch/BR-003` (بعد از درج داده)
- APIها: `/api/tickets`, `/api/cheques`

## ساختار
- `app/` صفحات Next.js (App Router)
- `app/api/*` سرویس‌های ساده (Route Handlers)
- `prisma/schema.prisma` دیتامدل
- `lib/prisma.ts` کلاینت Prisma
- Tailwind آماده با تم ملایم و شیشه‌ای (glassmorphism)

## مراحل بعدی
- افزودن Auth (OTP ایمیل/پیامک)
- صفحه ایجاد/ویرایش شعبه/دانش‌آموز/چک
- ایمپورت اکسل و اعتبارسنجی
- اعلان‌ها و گزارش‌های بیشتر
