import './globals.css';

export const metadata = {
  title: 'LandingRodi AI',
  description: 'Luxury AI landing page SaaS for copy generation and live page previews.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
