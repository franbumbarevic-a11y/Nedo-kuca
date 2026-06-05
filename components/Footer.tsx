import Link from 'next/link';
import { Locale, t } from '@/lib/i18n';
import FooterEmail from '@/components/FooterEmail';

interface Props {
  locale: Locale;
}

export default function Footer({ locale }: Props) {
  const base = `/${locale}`;

  return (
    <footer className="site-footer" style={{ background: 'var(--ink)', color: 'var(--stone)' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '3rem 5vw 4rem',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo */}
        <div>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 500,
              color: 'var(--stone)',
            }}
          >
            Krčka kuća
          </span>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--stone)',
              opacity: 0.55,
              marginTop: '0.5rem',
            }}
          >
            {t(locale, 'footer_address')}
          </p>
        </div>

        {/* Nav */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            href={`${base}/galerija`}
            style={{ fontSize: '0.875rem', color: 'var(--stone)', opacity: 0.7 }}
          >
            {t(locale, 'nav_gallery')}
          </Link>
          <Link
            href={`${base}/lokacija`}
            style={{ fontSize: '0.875rem', color: 'var(--stone)', opacity: 0.7 }}
          >
            {t(locale, 'nav_location')}
          </Link>
          <Link
            href={`${base}/kuca`}
            style={{ fontSize: '0.875rem', color: 'var(--stone)', opacity: 0.7 }}
          >
            {t(locale, 'nav_house')}
          </Link>
          <Link
            href={`${base}/book-now`}
            style={{ fontSize: '0.875rem', color: 'var(--blue)' }}
          >
            {t(locale, 'nav_book')}
          </Link>
        </nav>

        {/* Contact */}
        <div style={{ fontSize: '0.875rem', color: 'var(--stone)', opacity: 0.7 }}>
          <FooterEmail style={{ color: 'var(--stone)' }} />
        </div>
      </div>
    </footer>
  );
}
