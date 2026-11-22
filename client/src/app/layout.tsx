import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Limon Reza — Software Engineer & Full-Stack Developer',
  description: 'Software Engineer focused on full-stack web development.',
};

export const viewport: Viewport = {
  themeColor: '#090d0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
