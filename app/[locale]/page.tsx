import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import { heroImages, images } from '@/lib/images';
import BentoHero from '@/components/gsap/BentoHero';
import RollingText from '@/components/gsap/RollingText';

interface Props {
  params: Promise<{ locale: string }>;
}

const PAGE_TITLE: Record<string, string> = {
  hr: 'Krčka kuća — Skrbčići, otok Krk',
  de: 'Krčka kuća — Skrbčići, Insel Krk',
  en: 'Krčka kuća — Skrbčići, island of Krk',
};

const PAGE_DESCRIPTION: Record<string, string> = {
  hr: 'Kamena kuća iz 1908. na otoku Krku. Debeli kameni zidovi, privatni vrt s maslinama i smokvama, terasa s pogledom na more. Najam do 4 gosta — Skrbčići, Hrvatska.',
  de: 'Steinhaus aus dem Jahr 1908 auf der Insel Krk. Dicke Steinwände, privater Garten mit Oliven und Feigen, Terrasse mit Meerblick. Ferienvermietung für bis zu 4 Gäste — Skrbčići, Kroatien.',
  en: 'Traditional stone house built in 1908 on the island of Krk, Croatia. Thick stone walls, private garden with figs and olives, sea-view terrace. Holiday rental for up to 4 guests — Skrbčići.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: PAGE_TITLE[locale] ?? 'Krčka kuća — Skrbčići, otok Krk',
    description: PAGE_DESCRIPTION[locale] ?? PAGE_DESCRIPTION.en,
  };
}

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const base = `/${locale}`;

  const rollingLines = [
    t(locale, 'rolling_1'),
    t(locale, 'rolling_2'),
    t(locale, 'rolling_3'),
  ];

  const navBlocks = [
    {
      label: t(locale, 'block_house'),
      href: `${base}/kuca`,
      image: images.exterior,
    },
    {
      label: t(locale, 'block_location'),
      href: `${base}/lokacija`,
      image: images.garden,
    },
    {
      label: t(locale, 'block_book'),
      href: `${base}/book-now`,
      image: images.terrace,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Krčka kuća',
    description: PAGE_DESCRIPTION[locale] ?? PAGE_DESCRIPTION.en,
    url: `https://nedo-kuca.vercel.app/${locale}`,
    email: 'info@krcka-kuca.hr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Skrbčići',
      addressLocality: 'Krk',
      addressRegion: 'Primorsko-goranska županija',
      addressCountry: 'HR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.08,
      longitude: 14.53,
    },
    numberOfRooms: 2,
    occupancy: { '@type': 'QuantitativeValue', maxValue: 4 },
    petsAllowed: true,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Private parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Garden', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Terrace', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Fireplace', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'BBQ', value: true },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '8',
      bestRating: '5',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Section 1: Bento Hero */}
      <section style={{ position: 'relative' }}>
        <BentoHero images={heroImages} title={t(locale, 'home_title')} />
      </section>

      {/* Section 2: Rolling text */}
      <section
        style={{
          background: 'var(--mist)',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <RollingText lines={rollingLines} />
      </section>

      {/* Section 3: Three nav blocks */}
      <section
        className="home-nav-blocks"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
        }}
      >
        {navBlocks.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            style={{
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transition: 'transform 0.6s ease',
              }}
              className="nav-block-img"
            >
              <Image
                src={block.image.src}
                alt={block.image.alt}
                fill
                sizes="33vw"
                className="object-cover"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(28,28,26,0.5) 0%, transparent 50%)',
                }}
              />
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'var(--stone)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 400,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {block.label}
            </span>
          </Link>
        ))}
      </section>

      {/* Section 4: Guest quotes */}
      <section
        style={{
          background: 'var(--mist)',
          padding: 'clamp(4rem, 10vw, 10rem) clamp(1.5rem, 10vw, 12rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
        }}
      >
        {[
          { quote: t(locale, 'quote_1'), attr: t(locale, 'quote_1_attr') },
          { quote: t(locale, 'quote_2'), attr: t(locale, 'quote_2_attr') },
          { quote: t(locale, 'quote_3'), attr: t(locale, 'quote_3_attr') },
        ].map((q, i) => (
          <blockquote
            key={i}
            style={{
              borderLeft: '2px solid var(--blue)',
              paddingLeft: '2rem',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                lineHeight: 1.6,
                color: 'var(--ink)',
                marginBottom: '1rem',
              }}
            >
              {q.quote}
            </p>
            <cite
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                opacity: 0.5,
                fontStyle: 'normal',
              }}
            >
              {q.attr}
            </cite>
          </blockquote>
        ))}
      </section>

      {/* Airbnb social proof */}
      <div
        style={{
          background: 'var(--mist)',
          padding: '0 clamp(1.5rem, 10vw, 12rem) clamp(3rem, 6vw, 5rem)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            color: 'var(--ink)',
            opacity: 0.45,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {t(locale, 'airbnb_social_proof')}
        </p>
      </div>

      {/* Section 6: Book CTA */}
      <section
        style={{
          background: 'var(--blue)',
          padding: 'clamp(4rem, 10vw, 8rem) 5vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2.5rem',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--stone)',
            fontStyle: 'italic',
          }}
        >
          {t(locale, 'book_cta_text')}
        </p>
        <Link
          href={`${base}/book-now`}
          style={{
            display: 'inline-block',
            background: 'var(--stone)',
            color: 'var(--blue-dark)',
            padding: '1rem 2.5rem',
            fontSize: '0.9rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {t(locale, 'book_cta_btn')}
        </Link>
      </section>

    </>
  );
}
