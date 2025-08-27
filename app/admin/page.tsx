// app/admin/page.tsx
export default function AdminHome() {
  return (
    <section className="grid gap-6 max-w-2xl">
      <h1 className="text-xl font-bold">بخش ادمین</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <a href="/admin/users/new" className="card p-5 hover:shadow">
          <div className="font-semibold mb-1">ایجاد کاربر جدید</div>
          <div className="text-sm text-gray-600">تعریف کاربر برای شعبه‌ها یا ادمین</div>
        </a>

        <a href="/admin/branches" className="card p-5 hover:shadow">
          <div className="font-semibold mb-1">مدیریت شعبه‌ها</div>
          <div className="text-sm text-gray-600">افزودن/ویرایش شعب</div>
        </a>

        <a href="/account" className="card p-5 hover:shadow">
          <div className="font-semibold mb-1">تغییر پسورد</div>
          <div className="text-sm text-gray-600">تغییر رمز اکانت فعلی</div>
        </a>
      </div>
    </section>
  )
}
