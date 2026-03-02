import Link from 'next/link';

const links = [
  { href: '/', label: 'Главная' },
  { href: '/prices', label: 'Прайс' },
  { href: '/book', label: 'Записаться' },
  { href: '/about', label: 'О нас' }
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-garage-black/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <div>
          <p className="m-title text-xl font-extrabold">Хороший Сервис</p>
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">BMW M Performance Style</p>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-slate-200 transition-all hover:bg-white/10 hover:text-garage-mblue">
              {item.label}
            </Link>
          ))}
          <Link href="/admin/dashboard" className="rounded-lg border border-garage-mblue/30 bg-garage-mblue/10 px-3 py-2 text-garage-mblue transition hover:border-garage-mblue/60 hover:bg-garage-mblue/20">
            Админка
          </Link>
        </nav>
      </div>
      <div className="h-px bg-m-gradient opacity-70" />
    </header>
  );
}
