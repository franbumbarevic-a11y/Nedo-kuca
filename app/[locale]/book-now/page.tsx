import { notFound } from 'next/navigation';
import Image from 'next/image';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import { images } from '@/lib/images';
import { fetchBookedRanges } from '@/lib/ical';
import BookingForm from '@/components/BookingForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BookNowPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const bookedRanges = await fetchBookedRanges();

  return (
    <section
      className="book-layout"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--stone)',
      }}
    >
      {/* Left: house photo + info */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '60vh' }}>
        <Image
          src={images.exterior.src}
          alt={images.exterior.alt}
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(28,28,26,0.7) 0%, transparent 60%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(2rem, 5vw, 4rem)',
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--stone)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            Krcka kuća
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--stone)', opacity: 0.7 }}>
            {t(locale, 'book_location')}
          </p>
        </div>
      </div>

      {/* Right: booking form with integrated calendar */}
      <div
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 6vw, 6rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--ink)',
            marginBottom: '2.5rem',
          }}
        >
          {t(locale, 'book_title')}
        </h2>

        <BookingForm bookedRanges={bookedRanges} locale={locale} />
      </div>
    </section>
  );
}
