import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krčka kuća — Skrbčići, otok Krk",
  description: "Traditional stone house built in 1908 on the island of Krk, Croatia. Thick stone walls, private garden with figs and olives, sea-view terrace. Holiday rental for up to 4 guests.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
