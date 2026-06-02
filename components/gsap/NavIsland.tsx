'use client';

import { useEffect, useRef, useState } from 'react';
// scrolled state removed — nav is always solid
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';

interface Props {
  locale: Locale;
  labels: {
    gallery: string;
    location: string;
    house: string;
    book: string;
  };
}

export default function NavIsland({ locale, labels }: Props) {
  const islandRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 200);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const base = `/${locale}`;
  const pathWithoutLocale = pathname.replace(/^\/(hr|de|en)/, '');

  const navLinks = [
    { href: `${base}/galerija`, label: labels.gallery },
    { href: `${base}/lokacija`, label: labels.location },
    { href: `${base}/kuca`, label: labels.house },
  ];

  return (
    <header
      ref={islandRef}
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${hidden ? '-200%' : '0'})`,
        transition: 'transform 0.4s ease, background 0.3s ease, box-shadow 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        padding: '0.5rem 1.5rem',
        background: 'var(--stone)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
        borderRadius: '99px',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Logo */}
      <Link
        href={base}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1rem',
          fontWeight: 500,
          color: 'var(--ink)',
          marginRight: '2rem',
          letterSpacing: '-0.01em',
        }}
      >
        Krcka kuća
      </Link>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--ink)',
              letterSpacing: '0.01em',
              opacity: 0.75,
              transition: 'opacity 0.2s',
            }}
          >
            {link.label}
          </Link>
        ))}

        <Link
          href={`${base}/book-now`}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--blue)',
            letterSpacing: '0.01em',
          }}
        >
          {labels.book}
        </Link>
      </nav>

      {/* Language switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          marginLeft: '2rem',
          fontSize: '0.75rem',
          fontWeight: 400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {locales.map((loc, i) => (
          <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {i > 0 && (
              <span style={{ color: 'var(--ink)', opacity: 0.3 }}>
                /
              </span>
            )}
            <Link
              href={`/${loc}${pathWithoutLocale}`}
              style={{
                color: 'var(--ink)',
                opacity: loc === locale ? 1 : 0.45,
                fontWeight: loc === locale ? 500 : 400,
              }}
            >
              {loc.toUpperCase()}
            </Link>
          </span>
        ))}
      </div>
    </header>
  );
}
