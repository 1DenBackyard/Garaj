import Link from 'next/link';
import SiteHeader from './components/site-header';

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-16">
        <section className="m-card mt-6 p-8 md:p-10">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-garage-amber">Инженерная точность • Night drive aesthetic</p>
          <h1 className="m-title mb-4 text-4xl font-extrabold md:text-6xl">Хороший Сервис</h1>
          <p className="max-w-2xl text-slate-300">Премиальный автосервис в эстетике современных BMW-шоурумов и технологичных гаражей.</p>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <Link href="/prices" className="m-card m-card-hover p-4">Прайс и калькулятор</Link>
            <Link href="/book" className="m-card m-card-hover p-4">Записаться в сервис</Link>
            <Link href="/about" className="m-card m-card-hover p-4">О нас</Link>
          </div>
        </section>
      </main>
    </>
  );
}
