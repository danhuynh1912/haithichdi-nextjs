'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[1000] text-white flex items-center justify-between p-6 lg:p-8 bg-gradient-to-b from-black to-black/0 transition-colors',
        scrolled && 'backdrop-blur-md shadow-lg',
      )}
    >
      <Link
        href='/'
        className='text-2xl font-semibold uppercase tracking-tight hover:text-red-500 transition-colors'
      >
        haithichdi
      </Link>
      <nav className='flex gap-8 lg:gap-12 text-sm lg:text-base'>
        <Link href='/' className='hover:text-red-500 transition-colors'>
          Trang chủ
        </Link>
        <Link href='/locations' className='hover:text-red-500 transition-colors'>
          Địa điểm
        </Link>
        <div className='cursor-pointer hover:text-red-500 transition-colors'>
          Tours
        </div>
        <div className='cursor-pointer hover:text-red-500 transition-colors'>
          Về chúng tôi
        </div>
        <Link href='/contact' className='hover:text-red-500 transition-colors'>
          Liên hệ
        </Link>
      </nav>
    </header>
  );
}
