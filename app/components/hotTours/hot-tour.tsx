import Image from 'next/image';
import { Calendar, Star, MoveRight } from 'lucide-react';
import { motion } from 'motion/react';
import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { formatDateDdMm } from '@/lib/utils';

export type HotTourData = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  location: {
    id: number;
    name: string;
    elevation_m: number;
  } | null;
  slots_left: number;
  booked_count: number;
};

type HotTourProps = React.ComponentPropsWithoutRef<'div'> & {
  tour: HotTourData;
};

const formatDateRange = (startDate: string, endDate: string) => {
  return `${formatDateDdMm(startDate)} – ${formatDateDdMm(endDate)}`;
};

const HotTour = forwardRef<HTMLDivElement, HotTourProps>(
  ({ className, tour, ...props }, ref) => {
    const imageUrl = tour.image_url ?? '/images/tachinhu1.jpg';
    const isRemoteImage = imageUrl.startsWith('http');
    const dateRange = formatDateRange(tour.start_date, tour.end_date);
    const locationName = tour.location?.name ?? 'Chua xac dinh';

    return (
      <div
        ref={ref}
        className={`bg-white flex gap-4 rounded-2xl text-black p-6 shadow-lg ${
          className ?? ''
        }`}
        {...props}
      >
        <div className='relative aspect-square min-w-28'>
          <Image
            className='object-cover rounded-xl'
            src={imageUrl}
            alt={tour.title}
            fill
            priority
            unoptimized={isRemoteImage}
            referrerPolicy='no-referrer'
          />
        </div>

        <div className='flex flex-col gap-1 pt-2'>
          <h1 className='text-xl font-bold leading-tight'>{tour.title}</h1>

          {/* <p className='text-sm text-gray-600'>{locationName}</p> */}

          <div className='flex gap-1 items-center text-sm text-gray-500'>
            <Calendar size={14} />
            <p>{dateRange}</p>
          </div>

          <div className='flex gap-1'>
            <Button variant='outline'>
              More info <MoveRight />
            </Button>
            <Button variant='outline'>
              <Star />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

HotTour.displayName = 'HotTour';

export const MotionHotTour = motion(HotTour);
export default HotTour;
