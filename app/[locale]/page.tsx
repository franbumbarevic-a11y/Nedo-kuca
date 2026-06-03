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
  hr: 'Krcka kuća — Skrbčići, otok Krk',
  de: 'Krcka kuća — Skrbčići, Insel Krk',
  en: 'Krcka kuća — Skrbčići, island of Krk',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: PAGE_TITLE[locale] ?? 'Krcka kuća — Skrbčići, otok Krk' };
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

  return (
    <>
      {/* Section 1: Bento Hero */}
      <section style={{ position: 'relative' }}>
        <BentoHero images={heroImages} title={t(locale, 'home_title')} />
      </section>

      {/* Section 2: Rolling text */}
      <section
        style={{
          background: 'var(--ink)',
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
