import { Inter, JetBrains_Mono, Barlow_Condensed } from 'next/font/google';

export const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-barlow',
  weight: ['500', '600', '700', '800'],
});
