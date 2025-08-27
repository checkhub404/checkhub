export default function Home() {
  return (
    <section className="grid gap-6">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-2">خوش آمدید 👋</h1>
        <p className="text-gray-600">اینجا می‌توانید چک‌های شهریه را ثبت و مشکلات را به کارتابل هر شعبه ارجاع دهید.</p>
        <div className="mt-6 flex gap-3">
          <a href="/dashboard" className="btn btn-primary">ورود به داشبورد</a>
          <a href="https://vercel.com/new" className="btn">استقرار (اختیاری)</a>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold">ارجاع سریع تیکت</h3>
          <p className="text-sm text-gray-600 mt-2">برای هر چک، یک تیکت با توضیح خطا بسازید و به شعبه مقصد بفرستید.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">هشدار سررسید</h3>
          <p className="text-sm text-gray-600 mt-2">چک‌های نزدیک سررسید ۷/۱۴/۳۰ روز آینده را زیر نظر داشته باشید.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">گزارش‌گیری</h3>
          <p className="text-sm text-gray-600 mt-2">SLA تیکت‌ها، نرخ برگشتی و خطاهای پرتکرار را رصد کنید.</p>
        </div>
      </div>
    </section>
  )
}
