'use client';

import { useEffect } from 'react';

/** Syncs <html lang> to the active locale for correct screen-reader pronunciation. */
export default function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
