import './globals.css';
import Script from 'next/script';

import { Plus_Jakarta_Sans, Syne, DM_Mono } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'LearnWithFlow',
  description: 'AI career guidance, mock exams, voice interview practice — all in one place.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: 'LearnWithFlow',
    description: 'Your path from Inter to Career starts here',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LearnWithFlow Preview Image',
      },
    ],
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your actual verification code
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable} ${dmMono.variable}`}>
      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
