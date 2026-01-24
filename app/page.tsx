'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HotTours from './components/hotTours/hot-tours';
import { ANIMATION_EASE } from '@/lib/constants';

export default function Home() {
  return (
    <main>
      {/* bg-[url('/images/haithichdi1.webp')] */}
      <section className='text-white absolute w-screen h-screen bg-black/50 bg-cover bg-[center_70%]'>
        <Image
          src='/images/haithichdi1.webp'
          alt='Trekking Haithichdi'
          fill
          priority // hero -> load sớm
          sizes='100vw'
          className='object-cover'
        />
        <div className='relative lg:flex justify-between h-screen p-8 lg:pr-0'>
          <div className='z-0 absolute inset-0 bg-black/40' />
          <div className='relative lg:pl-32 pt-31 lg:pt-62 z-1 lg:w-[50%] max-w-[700px]'>
            <motion.p
              initial={{ opacity: 0, transform: 'translateY(60px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{
                delay: 0.3,
                ease: ANIMATION_EASE,
                duration: 1,
              }}
            >
              Vietnam
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, transform: 'translateY(60px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{
                delay: 0.4,
                ease: ANIMATION_EASE,
                duration: 1,
              }}
              className='leading-[clamp(2rem,5vw,75px)] text-[clamp(2rem,5vw,72px)] font-black mt-4'
            >
              CHUYÊN TOUR <br /> TREKKING
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, transform: 'translateY(60px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{
                delay: 0.5,
                ease: ANIMATION_EASE,
                duration: 1,
              }}
              className='text-[20px] mt-6'
            >
              Với Hải Thích Đi, trekking không đơn thuần là đi thật xa leo thật
              cao, mà là hành trình đi sâu vào thiên nhiên, cùng những con người
              tử tế tạo nên những tác động tích cực, bền vững cho núi rừng và
              cộng đồng Việt Nam.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, transform: 'translateY(60px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{
                delay: 0.6,
                duration: 1,
                ease: ANIMATION_EASE,
              }}
            >
              <Button
                size='xl'
                className='mt-6 text-lg has-[>svg]:px-16 has-[>svg]:py-8 shadow-lg'
              >
                Booking
                <MoveRight className='ml-2' />
              </Button>
            </motion.div>
          </div>
          <HotTours className='mt-16 max-w-[500px] w-[500px]' />
          <div className='pointer-events-none absolute h-[400px] bottom-0 left-0 right-0 bg-gradient-to-b from-black/0 to-black' />
        </div>
      </section>
    </main>
  );
}
