import BookingForm from '../components/booking-form';
import SiteHeader from '../components/site-header';

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-6"><BookingForm /></main>
    </>
  );
}
