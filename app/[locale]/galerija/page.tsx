import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import { galleryLayout } from '@/lib/images';
import FlipModal from '@/components/gsap/FlipModal';

interface Props {
  params: Promise<{ locale: string }>;
}

const PAGE_TITLE: Record<string, string> = {
  hr: 'Galerija | Krcka kuća',
  de: 'Galerie | Krcka kuća',
  en: 'Gallery | Krcka kuća',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: PAGE_TITLE[locale] ?? 'Galerija | Krcka kuća' };
}

export default async function GalleryPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <>
      <div
        style={{
          padding: 'clamp(6rem, 12vw, 10rem) 5vw 3rem',
          background: 'var(--stone)',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: 'var(--ink)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 500,
            marginBottom: '0.75rem',
          }}
        >
          {t(locale, 'gallery_title')}
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--ink)',
            opacity: 0.55,
            letterSpacing: '0.04em',
          }}
        >
          {t(locale, 'gallery_subtitle')}
        </p>
      </div>

      <div style={{ background: 'var(--stone)' }}>
        <FlipModal items={galleryLayout} />
      </div>
    </>
  );
}
