import SiteHeader from '../components/site-header';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="m-card p-7">
          <h1 className="m-title mb-3 text-3xl font-bold">О нас</h1>
          <p className="text-slate-300">Мы делаем сервис в эстетике BMW M: дисциплина, инженерия, скорость реакции и прозрачные процессы.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-400">
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Диагностика и ремонт с фото-фиксацией.</p>
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Сильный фокус на подвеске, тормозах и трансмиссии.</p>
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Коммуникация в Telegram и быстрая запись.</p>
          </div>
        </section>
      </main>
    </>
  );
}
