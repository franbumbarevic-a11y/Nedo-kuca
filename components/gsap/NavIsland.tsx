'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';

const FLAGS: Record<Locale, string> = {
  hr: '🇭🇷',
  de: '🇩🇪',
  en: '🇬🇧',
};

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const langDropRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  /* ── GSAP matchMedia ── */
  useEffect(() => {
    let mm: ReturnType<typeof import('gsap').gsap.matchMedia>;
    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => { setIsMobile(false); setMenuOpen(false); });
      mm.add('(max-width: 768px)', () => { setIsMobile(true); });
    };
    init();
    return () => mm?.revert();
  }, []);

  /* ── Scroll hide/show ── */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 200);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Mobile menu animate ── */
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    let animating = false;
    const run = async () => {
      if (animating) return;
      animating = true;
      const { default: gsap } = await import('gsap');
      if (menuOpen) {
        gsap.set(el, { display: 'flex' });
        gsap.fromTo(el, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', onComplete: () => { animating = false; } });
      } else {
        gsap.to(el, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', onComplete: () => { gsap.set(el, { display: 'none' }); animating = false; } });
      }
    };
    run();
  }, [menuOpen]);

  /* ── Click outside to close lang dropdown ── */
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const base = `/${locale}`;
  const pathWithoutLocale = pathname.replace(/^\/(hr|de|en)/, '');

  const navLinks = [
    { href: `${base}/galerija`, label: labels.gallery },
    { href: `${base}/lokacija`, label: labels.location },
    { href: `${base}/kuca`,     label: labels.house },
  ];

  const otherLocales = locales.filter((l) => l !== locale);

  const linkStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 400,
    color: 'var(--ink)',
    letterSpacing: '0.01em',
    opacity: 0.75,
    transition: 'opacity 0.2s',
  };

  return (
    <>
      {/* ── Combined wrapper: nav island + lang dot, centered ── */}
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: `translateX(-50%) translateY(${hidden ? '-200%' : '0'})`,
          transition: 'transform 0.4s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/* Nav island */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.875rem 2rem',
            background: 'var(--stone)',
            boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
            borderRadius: '99px',
            whiteSpace: 'nowrap',
            gap: 0,
          }}
        >
          {/* Logo */}
          <Link
            href={base}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.0625rem',
              fontWeight: 500,
              color: 'var(--ink)',
              marginRight: isMobile ? '1rem' : '2.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            Krčka kuća
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={linkStyle}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile burger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.25rem', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', gap: '5px',
                width: 28, height: 28,
              }}
            >
              <span style={{ display: 'block', width: 20, height: 1.5, background: 'var(--ink)', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'transform 0.25s ease' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: 'var(--ink)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s ease' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: 'var(--ink)', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'transform 0.25s ease' }} />
            </button>
          )}
        </header>

        {/* ── Language dot ── */}
        <div ref={langDropRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setLangOpen((o) => !o)}
            aria-label="Change language"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.125rem',
              height: '3.125rem',
              background: 'var(--stone)',
              boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
              borderRadius: '99px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.375rem',
              lineHeight: 1,
              padding: 0,
            }}
          >
            {FLAGS[locale]}
          </button>

          {/* Dropdown: other flags stacked below */}
          {langOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.4rem)',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'var(--stone)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                borderRadius: '99px',
                padding: '0.375rem',
              }}
            >
              {otherLocales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}${pathWithoutLocale}`}
                  onClick={() => setLangOpen(false)}
                  title={loc.toUpperCase()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    fontSize: '1.25rem',
                    lineHeight: 1,
                    borderRadius: '99px',
                    transition: 'background 0.15s',
                  }}
                >
                  {FLAGS[loc]}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <div
        ref={menuRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 'calc(1.25rem + 62px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--stone)',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
          padding: '0.5rem 0',
          minWidth: 200,
          opacity: 0,
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '0.85rem 2rem',
              fontSize: '0.9rem',
              fontWeight: 400,
              color: 'var(--ink)',
              letterSpacing: '0.01em',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* ── Fixed bottom-right book button ── */}
      <Link
        href={`${base}/book-now`}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 1000,
          background: 'var(--blue-dark)',
          color: 'var(--stone)',
          padding: '0.875rem 1.75rem',
          borderRadius: '99px',
          fontSize: '0.875rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          whiteSpace: 'nowrap',
        }}
      >
        {labels.book}
      </Link>
    </>
  );
}
