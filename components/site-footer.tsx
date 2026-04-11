'use client';

import { Facebook, Mail, Phone, Ticket } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer
      id='site-footer'
      className='relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#090909] via-black to-black text-white scroll-mt-28'
    >
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute top-[-80px] right-[-60px] h-64 w-64 rounded-full bg-[#d00600]/18 blur-[120px]' />
        <div className='absolute bottom-[-120px] left-[8%] h-72 w-72 rounded-full bg-[#a00303]/16 blur-[140px]' />
      </div>

      <div className='relative mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]'>
        <section className='space-y-4'>
          <p className='inline-flex items-center gap-2 rounded-full border border-red-400/35 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-100'>
            <Ticket className='h-4 w-4 text-red-300' />
            Hải Thích Đi
          </p>
          <h2 className='text-3xl font-black'>Hải Thích Đi Travel</h2>
          <p className='max-w-xl text-sm leading-relaxed text-neutral-300'>
            Chúng tôi tạo ra những hành trình trekking thật, nơi bạn vừa chinh phục giới hạn
            của bản thân, vừa kết nối cộng đồng và để lại giá trị tích cực trên từng cung đường.
          </p>
        </section>

        <section className='space-y-4'>
          <h3 className='text-sm uppercase tracking-[0.2em] text-red-200'>Thông tin liên hệ</h3>
          <div className='space-y-3 text-sm text-neutral-200'>
            <p className='inline-flex items-center gap-2'>
              <Phone className='h-4 w-4 text-red-300' />
              Hotline: xxx.xxx.xxx
            </p>
            <p className='inline-flex items-center gap-2'>
              <Mail className='h-4 w-4 text-red-300' />
              Email: xxx@gmail.com
            </p>
          </div>
        </section>

        <section className='space-y-4'>
          <h3 className='text-sm uppercase tracking-[0.2em] text-red-200'>Mạng xã hội</h3>
          <div className='space-y-3 text-sm text-neutral-200'>
            <p className='inline-flex items-center gap-2'>
              <Facebook className='h-4 w-4 text-red-300' />
              Facebook: Hải Thích Đi
            </p>
            <p className='inline-flex items-center gap-2'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-4 w-4 text-red-300'
                fill='currentColor'
              >
                <path d='M19.59 6.69a4.83 4.83 0 0 0-3.77-1.52h-.67a4.26 4.26 0 0 0-3.18 1.47 4.27 4.27 0 0 0-3.19-1.47h-.67a4.83 4.83 0 0 0-3.77 1.52 4.83 4.83 0 0 0-1.52 3.77v2.89a4.83 4.83 0 0 0 1.52 3.77 4.83 4.83 0 0 0 3.77 1.52h.67a4.27 4.27 0 0 0 3.19-1.47 4.26 4.26 0 0 0 3.18 1.47h.67a4.83 4.83 0 0 0 3.77-1.52 4.83 4.83 0 0 0 1.52-3.77v-2.89a4.83 4.83 0 0 0-1.52-3.77Zm-6.4 8.03a2.63 2.63 0 1 1 0-5.26 2.63 2.63 0 0 1 0 5.26Z' />
              </svg>
              TikTok: Hải Thích Đi
            </p>
          </div>
        </section>
      </div>

      <div className='relative border-t border-white/10 px-4 py-4 text-center text-xs text-neutral-500 sm:px-8'>
        © {new Date().getFullYear()} Hải Thích Đi Travel. All rights reserved.
      </div>
    </footer>
  );
}
