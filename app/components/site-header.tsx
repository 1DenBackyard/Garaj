import Link from 'next/link';

const links = [
  { href: '/', label: 'Главная' },
  { href: '/prices', label: 'Прайс' },
  { href: '/book', label: 'Записаться' },
  { href: '/about', label: 'О нас' }
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ui-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <div>
          <p className="ui-title text-xl font-semibold">Хороший Сервис</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ui-muted">Автосервис</p>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-ui-text transition hover:bg-white/10 hover:text-ui-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="h-px bg-ui-line" />
    </header>
  );
}
