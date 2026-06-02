import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krcka kuća — Skrbčići, otok Krk",
  description: "Traditional stone house from 1908 on the island of Krk, Croatia. Available for holiday rental.",
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
