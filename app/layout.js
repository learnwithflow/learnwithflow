import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'LearnWithFlow',
  description: 'AI career guidance, mock exams, voice interview practice — all in one place.',
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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
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
