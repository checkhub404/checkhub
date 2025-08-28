import NowCard from '@/components/NowCard';

export default async function HomePage() {
  return (
    <div className="space-y-6">
      {/* هدر خوش‌آمد */}
      <section className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              خوش آمدید <span className="text-amber-500">👋</span>
            </h1>
            <p className="mt-2 text-gray-600">
              به کارتابل حسابداری دبستان امید خوش آمدید.
            </p>
          </div>
          {/* اگر روزی بخواهی دکمه‌ای اضافه کنی، اینجا قرار بده؛ الان عمداً حذف شده است. */}
        </div>
      </section>

      {/* گرید کارت‌ها؛ ساعت/تاریخ + کارت‌های نمونه داشبورد */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* کارت ساعت/تاریخ زنده */}
        <NowCard />

        {/* کارت هشدار سررسید (نمونه ساده؛ در صورت داشتن دیتا، این را با دادهٔ واقعی پر کن) */}
        <div className="rounded-2xl bg-white/80 shadow p-5 border border-white/50">
          <div className="text-sm text-gray-500 mb-1">هشدار سررسید</div>
          <div className="font-semibold">چک‌های نزدیک سررسید</div>
          <p className="text-gray-600 mt-2">
            چک‌های نزدیکِ تاریخ سررسید را زیر نظر داشته باشید.
          </p>
        </div>

        {/* کارت گزارش‌گیری (نمونه) */}
        <div className="rounded-2xl bg-white/80 shadow p-5 border border-white/50">
          <div className="text-sm text-gray-500 mb-1">گزارش‌گیری</div>
          <div className="font-semibold">SLA و نرخ برگشت</div>
          <p className="text-gray-600 mt-2">
            نرخ برگشت و خطاهای پرتکرار را رصد کنید.
          </p>
        </div>

        {/* کارت ارجاع سریع تیکت (نمونه) */}
        <div className="rounded-2xl bg-white/80 shadow p-5 border border-white/50 sm:col-span-2 lg:col-span-1">
          <div className="text-sm text-gray-500 mb-1">ارجاع سریع تیکت</div>
          <div className="font-semibold">ارجاع یا توضیح خطا</div>
          <p className="text-gray-600 mt-2">
            برای هر چک، یک تیکت با توضیح خطا بسازید و به شعبه مقصد ارجاع دهید.
          </p>
        </div>
      </section>
    </div>
  );
}
