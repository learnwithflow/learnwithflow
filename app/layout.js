import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'LearnWithFlow',
  description: 'AI career guidance, mock exams, voice interview practice — all in one place.',
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
