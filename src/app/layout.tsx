import './globals.css';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Sustainability Leaderboard',
  description: 'Track and compete in sustainability challenges',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <Navigation />
          <main className="pt-16 flex-grow min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
