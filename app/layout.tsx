import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { PageTransition } from '@/components/page-transition';
import Link from 'next/link';
import Providers from './providers';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'Haithich - Chuyên tour trekking Việt Nam',
  description:
    'Hải Thích Đi - Chuyên tour trekking Việt Nam, khám phá thiên nhiên và văn hóa địa phương bền vững.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi'>
      <body className={`${beVietnamPro.className} antialiased relative`}>
        {/* <PageTransition /> */}
        <div className='text-white absolute flex items-center justify-between h-fit p-8 pb-32 z-1 inset-0 bg-gradient-to-b from-black to-black/0'>
          <h1 className='text-2xl fw-600'>haithichdi</h1>
          <div className='flex gap-12'>
            <Link href={'/'} className='cursor-pointer hover:underline'>
              Trang chủ
            </Link>
            <Link
              href={'/locations'}
              className='cursor-pointer hover:underline'
            >
              Địa điểm
            </Link>
            <div className='cursor-pointer hover:underline'>Tours</div>
            <div className='cursor-pointer hover:underline'>Về chúng tôi</div>
            <Link href={'/contact'} className='cursor-pointer hover:underline'>
              Liên hệ
            </Link>
          </div>
        </div>
        <Providers>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
