import PriceCatalog from '../components/price-catalog';
import SiteHeader from '../components/site-header';

export default function PricesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6"><PriceCatalog /></main>
    </>
  );
}
