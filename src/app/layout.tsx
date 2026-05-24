import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bebas_Neue, Space_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-alt",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-alt",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "YOOBOO",
  description: "Real-time multiplayer card game — high-stakes action, stacking penalties, and elimination. Last one standing wins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${spaceMono.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
