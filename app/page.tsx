import Link from 'next/link';
import SiteHeader from './components/site-header';

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-16">
        <section className="ui-card mt-6 p-8 md:p-10">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-ui-muted">Точность • Надёжность • Технологичность</p>
          <h1 className="ui-title mb-4 text-4xl font-bold md:text-6xl">Хороший Сервис</h1>
          <p className="max-w-2xl text-ui-muted">Современный автосервис с чистыми процессами, прозрачной коммуникацией и аккуратной инженерной работой.</p>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <Link href="/prices" className="ui-card-subtle ui-hover-line p-4">Прайс и калькулятор</Link>
            <Link href="/book" className="ui-card-subtle ui-hover-line p-4">Записаться в сервис</Link>
            <Link href="/about" className="ui-card-subtle ui-hover-line p-4">О нас</Link>
          </div>
        </section>
      </main>
    </>
  );
}
