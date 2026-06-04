import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { isValidLocale, Locale, t } from '@/lib/i18n';
import NavIsland from '@/components/gsap/NavIsland';
import Footer from '@/components/Footer';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const pathname = (await headers()).get('x-pathname') ?? '';
  const showFooter = !pathname.endsWith('/kuca');

  return (
    <>
      <NavIsland
        locale={locale}
        labels={{
          gallery: t(locale, 'nav_gallery'),
          location: t(locale, 'nav_location'),
          house: t(locale, 'nav_house'),
          book: t(locale, 'nav_book'),
        }}
      />
      <main>{children}</main>
      {showFooter && <Footer locale={locale} />}
    </>
  );
}
