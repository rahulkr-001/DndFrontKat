import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dandiya Night Katoria | Nachega Katoria Ek Sath',
  description: "Experience Dandiya Night 3.0 in Katoria on 19 October 2026 at Indira Garden. Enjoy Dandiya, music, dance, exciting prizes, food and beverages, themed selfie points and more. Book tickets from ₹99.",
  keywords: [  'Dandiya Night Katoria',
    'Dandiya Night Katoria 2026',
    'Dandiya Night 3.0 Katoria',
    'Dandiya Night 3.0',
    'Dandiya event Katoria',
    'Dandiya event Katoria Bihar',
    'Dandiya tickets Katoria',
    'Dandiya Night tickets Katoria',
    'Dandiya ticket booking Katoria',
    'Garba Night Katoria',
    'Garba event Katoria',
    'Navratri event Katoria',
    'Navratri celebration Katoria',
    'Dandiya Night Banka',
    'Dandiya event Banka Bihar',
    'Dandiya celebration Katoria',
    'Dandiya festival Katoria'],
  openGraph: {
    title: 'Dandiya Night Katoria 2026 | Dandiya Night 3.0',
    description: "नाचेगा KATORIA एक साथ! Join Dandiya Night 3.0 on 19 October 2026 at Indira Garden, Katoria. Dance, music, prizes, food, Dandiya and more. Tickets from ₹99",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#090308] text-[#F5EFEB] antialiased selection:bg-[#D4AF37]/30 selection:text-[#FFF]">
        {children}
      </body>
    </html>
  );
}
