import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import { images } from '@/lib/images';
import SlidePinning from '@/components/gsap/SlidePinning';

interface Props {
  params: Promise<{ locale: string }>;
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
    },
  ];

  const specs = [
    { label: t(locale, 'house_guests'), val: t(locale, 'house_guests_val') },
    { label: t(locale, 'house_bedrooms'), val: t(locale, 'house_bedrooms_val') },
    { label: t(locale, 'house_bathrooms'), val: t(locale, 'house_bathrooms_val') },
    { label: t(locale, 'house_terrace'), val: t(locale, 'house_terrace_val') },
    { label: t(locale, 'house_parking'), val: t(locale, 'house_parking_val') },
    { label: t(locale, 'house_wifi'), val: t(locale, 'house_wifi_val') },
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

      {/* Narrative scroll: SlidePinning */}
      <SlidePinning panels={panels} />

      {/* Specs */}
      <section style={{ background: 'var(--stone)', padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 10vw, 12rem)' }}>
        <h2
          style={{
            fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--blue-dark)',
            marginBottom: '3rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}
        >
          {t(locale, 'house_specs_title')}
        </h2>
        <dl>
          {specs.map((spec, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '1.25rem 0',
                borderBottom: '1px solid var(--mist)',
              }}
            >
              <dt style={{ fontSize: '1rem', color: 'var(--ink)', opacity: 0.65 }}>
                {spec.label}
              </dt>
              <dd
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                  fontWeight: 400,
                  maxWidth: '28ch',
                  textAlign: 'right',
                }}
              >
                {spec.val}
              </dd>
            </div>
          ))}
        </dl>
      </section>



      {/* Amenities */}
      <section style={{ background: 'var(--mist)', padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 10vw, 12rem)' }}>
        <h2
          style={{
            fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--blue-dark)',
            marginBottom: '3rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}
        >
          {t(locale, 'house_amenities_title')}
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0',
          }}
        >
          {([
            'house_amenity_kitchen',
            'house_amenity_terrace',
            'house_amenity_garden',
            'house_amenity_parking',
            'house_amenity_fireplace',
            'house_amenity_linen',
            'house_amenity_bbq',
            'house_amenity_fruits',
            'house_amenity_outdoor',
          ] as const).map((key) => (
            <li
              key={key}
              style={{
                padding: '1.1rem 0',
                borderBottom: '1px solid var(--mist)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9375rem',
                color: 'var(--ink)',
              }}
            >
              <span style={{ color: 'var(--blue-dark)', fontSize: '1rem', flexShrink: 0 }}>—</span>
              {t(locale, key)}
            </li>
          ))}
        </ul>
      </section>

      {/* Pricing + Book CTA */}
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

    </>
  );
}
