import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import { images } from '@/lib/images';
import SlidePinning from '@/components/gsap/SlidePinning';
import Footer from '@/components/Footer';

interface Props {
  params: Promise<{ locale: string }>;
}

const PAGE_TITLE: Record<string, string> = {
  hr: 'Kuća | Krcka kuća',
  de: 'Haus | Krcka kuća',
  en: 'House | Krcka kuća',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: PAGE_TITLE[locale] ?? 'Kuća | Krcka kuća' };
}

export default async function HousePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const base = `/${locale}`;

  const panels = [
    {
      title: t(locale, 'house_p1_title'),
      text: t(locale, 'house_p1_text'),
      image: images.exterior,
    },
    {
      title: t(locale, 'house_p2_title'),
      text: t(locale, 'house_p2_text'),
      image: images.livingroomFireplace,
    },
    {
      title: t(locale, 'house_p3_title'),
      text: t(locale, 'house_p3_text'),
      image: images.garden,
    },
    {
      title: t(locale, 'house_p4_title'),
      text: t(locale, 'house_p4_text'),
      image: images.terrace,
      extra: (
        <>
          <section
            style={{
              background: 'var(--stone)',
              padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 10vw, 12rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2rem',
            }}
          >
            <p style={{ fontSize: '1rem', color: 'var(--ink)', opacity: 0.6 }}>
              {t(locale, 'house_price')}
            </p>
            <Link
              href={`${base}/book-now`}
              style={{
                display: 'inline-block',
                background: 'var(--blue-dark)',
                color: 'var(--stone)',
                padding: '1rem 2.5rem',
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {t(locale, 'house_book_btn')}
            </Link>
          </section>
          <Footer locale={locale} />
        </>
      ),
    },
  ];

  const specs = [
    { label: t(locale, 'house_guests'), val: t(locale, 'house_guests_val') },
    { label: t(locale, 'house_bedrooms'), val: t(locale, 'house_bedrooms_val') },
    { label: t(locale, 'house_beds'), val: t(locale, 'house_beds_val') },
    { label: t(locale, 'house_bathrooms'), val: t(locale, 'house_bathrooms_val') },
    { label: t(locale, 'house_checkin_spec'), val: t(locale, 'house_checkin_spec_val') },
    { label: t(locale, 'house_checkout_spec'), val: t(locale, 'house_checkout_spec_val') },
    { label: t(locale, 'house_terrace'), val: t(locale, 'house_terrace_val') },
    { label: t(locale, 'house_parking'), val: t(locale, 'house_parking_val') },
    { label: t(locale, 'house_wifi'), val: t(locale, 'house_wifi_val') },
    { label: t(locale, 'house_pets'), val: t(locale, 'house_pets_val') },
  ];

  const amenities = [
    t(locale, 'house_amenity_kitchen'),
    t(locale, 'house_amenity_terrace'),
    t(locale, 'house_amenity_garden'),
    t(locale, 'house_amenity_parking'),
    t(locale, 'house_amenity_fireplace'),
    t(locale, 'house_amenity_linen'),
    t(locale, 'house_amenity_bbq'),
    t(locale, 'house_amenity_fruits'),
    t(locale, 'house_amenity_outdoor'),
    t(locale, 'house_amenity_pets'),
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
        <Image
          src={images.exterior.src}
          alt={images.exterior.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(28,28,26,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              color: 'var(--stone)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 500,
              textAlign: 'center',
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
            }}
          >
            {t(locale, 'house_title')}
          </h1>
        </div>
      </section>

      {/* Combined Specs + Amenities Table */}
      <section style={{ background: 'var(--stone)', padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 10vw, 12rem)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                colSpan={2}
                style={{
                  fontSize: 'clamp(0.7rem, 0.85vw, 0.85rem)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--blue-dark)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  textAlign: 'left',
                  paddingBottom: '1.5rem',
                  paddingRight: '3rem',
                  borderBottom: '1px solid var(--mist)',
                }}
              >
                {t(locale, 'house_specs_title')}
              </th>
              <th
                style={{
                  fontSize: 'clamp(0.7rem, 0.85vw, 0.85rem)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--blue-dark)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  textAlign: 'left',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--mist)',
                }}
              >
                {t(locale, 'house_amenities_title')}
              </th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, i) => (
              <tr key={i}>
                <td
                  style={{
                    padding: '1.1rem 0',
                    paddingRight: '1.5rem',
                    borderBottom: '1px solid var(--mist)',
                    fontSize: '1rem',
                    color: 'var(--ink)',
                    opacity: 0.65,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {spec.label}
                </td>
                <td
                  style={{
                    padding: '1.1rem 0',
                    paddingRight: '3rem',
                    borderBottom: '1px solid var(--mist)',
                    fontSize: '0.9375rem',
                    color: 'var(--ink)',
                    fontWeight: 400,
                  }}
                >
                  {spec.val}
                </td>
                <td
                  style={{
                    padding: '1.1rem 0',
                    borderBottom: '1px solid var(--mist)',
                    fontSize: '0.9375rem',
                    color: 'var(--ink)',
                  }}
                >
                  <span style={{ color: 'var(--blue-dark)', marginRight: '0.75rem' }}>—</span>
                  {amenities[i]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* About title */}
      <section
        style={{
          background: 'var(--ink)',
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1.5rem, 10vw, 12rem)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 4.5rem)',
            color: 'var(--stone)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 500,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {t(locale, 'house_about_title')}
        </h2>
      </section>

      {/* Narrative scroll: CTA + Footer live inside slide 4 */}
      <SlidePinning panels={panels} />
    </>
  );
}
