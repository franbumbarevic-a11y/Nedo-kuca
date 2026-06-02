'use client';

import { useEffect, useRef, useState } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  /* ── GSAP matchMedia: handles resize + mobile/desktop switch ── */
  useEffect(() => {
    let mm: ReturnType<typeof import('gsap').gsap.matchMedia>;

    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        setIsMobile(false);
        setMenuOpen(false);
      });

      mm.add('(max-width: 768px)', () => {
        setIsMobile(true);
      });
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

  /* ── Animate mobile menu open/close ── */
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
        gsap.fromTo(
          el,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', onComplete: () => { animating = false; } }
        );
      } else {
        gsap.to(el, {
          opacity: 0, y: -8, duration: 0.2, ease: 'power2.in',
          onComplete: () => { gsap.set(el, { display: 'none' }); animating = false; },
        });
      }
    };
    run();
  }, [menuOpen]);

  const base = `/${locale}`;
  const pathWithoutLocale = pathname.replace(/^\/(hr|de|en)/, '');

  const navLinks = [
    { href: `${base}/galerija`, label: labels.gallery },
    { href: `${base}/lokacija`, label: labels.location },
    { href: `${base}/kuca`,     label: labels.house },
    { href: `${base}/book-now`, label: labels.book, accent: true },
  ];

  const linkStyle = (accent?: boolean): React.CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: accent ? 500 : 400,
    color: accent ? 'var(--blue)' : 'var(--ink)',
    letterSpacing: '0.01em',
    opacity: accent ? 1 : 0.75,
    transition: 'opacity 0.2s',
  });

  return (
    <>
      <header
        ref={islandRef}
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: `translateX(-50%) translateY(${hidden ? '-200%' : '0'})`,
          transition: 'transform 0.4s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 1.5rem',
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
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--ink)',
            marginRight: isMobile ? '1rem' : '2rem',
            letterSpacing: '-0.01em',
          }}
        >
          Krcka kuća
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={linkStyle(link.accent)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop language switcher */}
        {!isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            marginLeft: '2rem', fontSize: '0.75rem', fontWeight: 400,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {locales.map((loc, i) => (
              <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {i > 0 && <span style={{ color: 'var(--ink)', opacity: 0.3 }}>/</span>}
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
        )}

        {/* Mobile burger button */}
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
            <span style={{
              display: 'block', width: 20, height: 1.5,
              background: 'var(--ink)',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              transition: 'transform 0.25s ease',
            }} />
            <span style={{
              display: 'block', width: 20, height: 1.5,
              background: 'var(--ink)',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }} />
            <span style={{
              display: 'block', width: 20, height: 1.5,
              background: 'var(--ink)',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              transition: 'transform 0.25s ease',
            }} />
          </button>
        )}
      </header>

      {/* Mobile dropdown menu */}
      <div
        ref={menuRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 'calc(1.25rem + 52px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
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
              fontWeight: link.accent ? 500 : 400,
              color: link.accent ? 'var(--blue)' : 'var(--ink)',
              letterSpacing: '0.01em',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* Language switcher in mobile menu */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.85rem 2rem',
          fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {locales.map((loc, i) => (
            <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {i > 0 && <span style={{ color: 'var(--ink)', opacity: 0.3 }}>/</span>}
              <Link
                href={`/${loc}${pathWithoutLocale}`}
                onClick={() => setMenuOpen(false)}
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
      </div>
    </>
  );
}
