import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import { images } from '@/lib/images';

interface Props {
  params: Promise<{ locale: string }>;
}

const PAGE_TITLE: Record<string, string> = {
  hr: 'Lokacija | Krcka kuća',
  de: 'Lage | Krcka kuća',
  en: 'Location | Krcka kuća',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: PAGE_TITLE[locale] ?? 'Lokacija | Krcka kuća' };
}

export default async function LocationPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const base = `/${locale}`;

  const distances = [
    { label: t(locale, 'location_d6'), val: t(locale, 'location_d6_val') },
    { label: t(locale, 'location_d7'), val: t(locale, 'location_d7_val') },
    { label: t(locale, 'location_d1'), val: t(locale, 'location_d1_val') },
    { label: t(locale, 'location_d3'), val: t(locale, 'location_d3_val') },
    { label: t(locale, 'location_d2'), val: t(locale, 'location_d2_val') },
    { label: t(locale, 'location_d4'), val: t(locale, 'location_d4_val') },
    { label: t(locale, 'location_d5'), val: t(locale, 'location_d5_val') },
  ];

  const activities = [
    {
      title: t(locale, 'location_hiking_title'),
      text: t(locale, 'location_hiking_text'),
      image: images.garden,
      reverse: false,
    },
    {
      title: t(locale, 'location_swimming_title'),
      text: t(locale, 'location_swimming_text'),
      image: images.terrace,
      reverse: true,
    },
    {
      title: t(locale, 'location_island_title'),
      text: t(locale, 'location_island_text'),
      image: images.parking,
      reverse: false,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
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
            background: 'linear-gradient(to top, rgba(28,28,26,0.6) 0%, rgba(28,28,26,0.1) 60%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 'clamp(3rem, 6vw, 6rem)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: 'var(--stone)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 500,
              marginBottom: '1rem',
            }}
          >
            {t(locale, 'location_title')}
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--stone)',
              opacity: 0.8,
              maxWidth: '50ch',
              lineHeight: 1.5,
            }}
          >
            {t(locale, 'location_subtitle')}
          </p>
        </div>
      </section>

      {/* Distances */}
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
          {t(locale, 'location_distances_title')}
        </h2>
        {/* Single-column list with visible spacing between rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {distances.map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '1.5rem 0',
                borderBottom: '1px solid var(--mist)',
              }}
            >
              <span style={{ fontSize: '1.0625rem', color: 'var(--ink)', opacity: 0.75 }}>
                {d.label}
              </span>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--blue-dark)',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                }}
              >
                {d.val}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Map — between distances and activities */}
      <section style={{ background: 'var(--stone)', padding: '0 4vw clamp(4rem, 6vw, 6rem)' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '16/7',
            overflow: 'hidden',
            borderRadius: '1rem',
            position: 'relative',
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d743.2324179834534!2d14.491183569634682!3d45.04973149819188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47636c1eb86f52ed%3A0x6575ea471fa29fdd!2zU2tycMSNacSHaSAyMCwgNTE1MDAsIFNrcmLEjWnEh2k!5e1!3m2!1sen!2shr!4v1780323859696!5m2!1sen!2shr"
            width="100%"
            height="100%"
            style={{ border: 0, position: 'absolute', inset: 0 }}
            allowFullScreen
            // loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t(locale, 'location_map_label')}
          />
          </div>
      </section>

      {/* Activities */}
      <section style={{ background: 'var(--mist)' }}>
        <div
          style={{
            padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1.5rem, 5vw, 5rem)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--blue-dark)',
              marginBottom: '4rem',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            {t(locale, 'location_activities_title')}
          </h2>
          {activities.map((act, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: act.reverse ? '1fr 1fr' : '1fr 1fr',
                gap: 'clamp(2rem, 5vw, 6rem)',
                alignItems: 'center',
                padding: 'clamp(3rem, 5vw, 6rem) 0',
                borderBottom: i < activities.length - 1 ? '1px solid var(--mist)' : 'none',
                direction: act.reverse ? 'rtl' : 'ltr',
              }}
            >
              <div style={{ direction: 'ltr', position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                <Image
                  src={act.image.src}
                  alt={act.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div style={{ direction: 'ltr' }}>
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    color: 'var(--ink)',
                    marginBottom: '1.5rem',
                  }}
                >
                  {act.title}
                </h3>
                <p
                  style={{
                    fontSize: '1.0625rem',
                    lineHeight: 1.75,
                    color: 'var(--ink)',
                    opacity: 0.75,
                    maxWidth: '45ch',
                  }}
                >
                  {act.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* End links */}
      <section
        style={{
          background: 'var(--stone)',
          padding: '0 5vw clamp(4rem, 8vw, 8rem)',
          display: 'flex',
          gap: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href={`${base}/kuca`}
          style={{
            fontSize: '1rem',
            color: 'var(--ink)',
            opacity: 0.7,
            letterSpacing: '0.02em',
          }}
        >
          {t(locale, 'location_see_house')}
        </Link>
        <Link
          href={`${base}/book-now`}
          style={{
            fontSize: '1rem',
            color: 'var(--blue-dark)',
            letterSpacing: '0.02em',
          }}
        >
          {t(locale, 'location_book_link')}
        </Link>
      </section>
    </>
  );
}
