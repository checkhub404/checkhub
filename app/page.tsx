// app/page.tsx
export default function Home() {
  return (
    <main className="space-y-6">
      {/* کارت خوش‌آمد */}
      <section className="rounded-2xl bg-white/80 shadow-soft ring-1 ring-black/5 p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👋 خوش آمدید</span>
        </div>

        <p className="mt-4 text-gray-700 leading-8">
          به کارتابل حسابداری دبستان امید خوش آمدید.
        </p>

        {/* فقط دکمه ورود به داشبورد؛ دکمه «استقرار (اختیاری)» حذف شد */}
        <div className="mt-6 flex items-center gap-3">
          <a href="/dashboard" className="btn btn-primary">
            ورود به داشبورد
          </a>
        </div>
      </section>

      {/* کارت‌های پایین صفحه—بدون تغییر محتوایی */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 shadow-soft ring-1 ring-black/5 p-5">
          <h3 className="font-bold mb-2">ارجاع سریع تیکت</h3>
          <p className="text-sm text-gray-600">
            برای هر چک، یک تیکت با توضیح خطا بسازید و به شعبه مقصد فوروارد کنید.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 shadow-soft ring-1 ring-black/5 p-5">
          <h3 className="font-bold mb-2">هشدار سررسید</h3>
          <p className="text-sm text-gray-600">
            چک‌های نزدیک سررسید را زیر نظر داشته باشید.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 shadow-soft ring-1 ring-black/5 p-5">
          <h3 className="font-bold mb-2">گزارش‌گیری</h3>
          <p className="text-sm text-gray-600">
            SLA تیکت‌ها، نرخ برگشت و خطاهای پرتکرار را رصد کنید.
          </p>
        </div>
      </section>
    </main>
  );
}
