'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TicketCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  hasStoredBookingIds,
  subscribeBookingIdsChanged,
} from '@/lib/services/booking-storage';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [showBookedToursItem, setShowBookedToursItem] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncBookedToursItem = () => {
      setShowBookedToursItem(hasStoredBookingIds());
    };

    syncBookedToursItem();
    const unsubscribe = subscribeBookingIdsChanged(syncBookedToursItem);

    return unsubscribe;
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[1000] text-white flex items-center justify-between px-6 py-4 lg:px-8 lg:py-6 bg-gradient-to-b from-black to-black/0 transition-colors',
        scrolled && 'backdrop-blur-md shadow-lg',
      )}
    >
      <Link
        href='/'
        aria-label='Hải Thích Đi'
        className='inline-flex items-center shrink-0'
      >
        <Image
          src='/haithichdi-logo-white.png'
          alt='Hải Thích Đi'
          width={2366}
          height={2366}
          priority
          className='h-14 md:h-16 w-auto hover:opacity-85 transition-opacity'
        />
      </Link>
      <nav className='flex gap-8 lg:gap-12 text-sm lg:text-base'>
        <Link href='/' className='hover:text-red-500 transition-colors'>
          Trang chủ
        </Link>
        <Link href='/locations' className='hover:text-red-500 transition-colors'>
          Địa điểm
        </Link>
        <Link href='/tours' className='hover:text-red-500 transition-colors'>
          Tours
        </Link>
        <Link href='/about' className='hover:text-red-500 transition-colors'>
          Về chúng tôi
        </Link>
        <Link href='/contact' className='hover:text-red-500 transition-colors'>
          Liên hệ
        </Link>
        {showBookedToursItem && (
          <Link
            href='/my-bookings'
            className='hover:text-[#43d88a] transition-colors inline-flex items-center gap-2 whitespace-nowrap'
          >
            <TicketCheck size={16} />
            Tours bạn đã đặt
          </Link>
        )}
      </nav>
    </header>
  );
}
