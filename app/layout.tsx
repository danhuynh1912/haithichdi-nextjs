import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { PageTransition } from '@/components/page-transition';
import Providers from './providers';
import { createRootMetadata } from '@/lib/seo';
import SiteHeader from '@/components/site-header';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
});

export const metadata = createRootMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi'>
      <body className={`${beVietnamPro.className} antialiased relative`}>
        {/* <PageTransition /> */}
        <SiteHeader />
        <Providers>
          <div className=''>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
