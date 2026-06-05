import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--stone, #f5f0e8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontWeight: 500,
          fontStyle: 'italic',
          color: 'var(--ink, #1c1c1a)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--ink, #1c1c1a)',
          opacity: 0.55,
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        Stranica nije pronađena&nbsp;·&nbsp;Seite nicht gefunden&nbsp;·&nbsp;Page not found
      </p>
      <Link
        href="/hr"
        style={{
          background: 'var(--blue-dark, #1a2c3d)',
          color: 'var(--stone, #f5f0e8)',
          padding: '0.875rem 2.25rem',
          fontSize: '0.8rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 500,
          textDecoration: 'none',
          marginTop: '0.5rem',
        }}
      >
        Krčka kuća →
      </Link>
    </div>
  );
}
