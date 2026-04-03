'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  Calendar,
  ChevronRight,
  Search,
  Tent,
} from 'lucide-react';
import { locationService } from '@/lib/services/location';
import { tourService } from '@/lib/services/tour';
import { formatDateDdMm } from '@/lib/utils';

function HotLocationCard({
  name,
  imageUrl,
  elevation,
  onClick,
}: {
  name: string;
  imageUrl: string | null;
  elevation: number;
  onClick: () => void;
}) {
  const src = imageUrl || '/images/tachinhu1.jpg';
  const isRemote = src.startsWith('http');

  return (
    <button
      onClick={onClick}
      className='relative h-44 w-40 shrink-0 overflow-hidden rounded-3xl border border-white/10 text-left'
    >
      <Image
        src={src}
        alt={name}
        fill
        className='object-cover'
        unoptimized={isRemote}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10' />
      <div className='absolute left-3 right-3 bottom-3 flex flex-col gap-1'>
        <p className='font-semibold leading-tight line-clamp-2'>{name}</p>
        <p className='text-xs text-neutral-300'>{elevation}m</p>
      </div>
    </button>
  );
}

function HotTourFeatureCard({
  title,
  imageUrl,
  locationName,
  startDate,
  endDate,
  slotsLeft,
  onClick,
}: {
  title: string;
  imageUrl: string | null;
  locationName: string;
  startDate: string | null;
  endDate: string | null;
  slotsLeft: number;
  onClick: () => void;
}) {
  const src = imageUrl || '/images/haithichdi1.jpg';
  const isRemote = src.startsWith('http');
  const dateLabel = startDate
    ? `${formatDateDdMm(startDate)}${endDate ? ` - ${formatDateDdMm(endDate)}` : ''}`
    : 'Đang cập nhật';

  return (
    <button
      onClick={onClick}
      className='relative w-full h-40 overflow-hidden rounded-3xl border border-white/10 text-left'
    >
      <Image
        src={src}
        alt={title}
        fill
        className='object-cover'
        unoptimized={isRemote}
      />
      <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20' />
      <div className='absolute inset-0 p-4 flex flex-col justify-between'>
        <div>
          <p className='text-xs uppercase tracking-[0.18em] text-red-200'>
            {locationName}
          </p>
          <h3 className='text-xl font-bold mt-1 line-clamp-2'>{title}</h3>
        </div>
        <div className='flex items-center justify-between text-xs text-neutral-200'>
          <span className='inline-flex items-center gap-1.5'>
            <Calendar size={13} className='text-red-300' />
            {dateLabel}
          </span>
          <span className='rounded-full border border-white/20 bg-black/45 px-2.5 py-1'>
            Còn {slotsLeft} chỗ
          </span>
        </div>
      </div>
    </button>
  );
}

export default function HomeMobile() {
  const router = useRouter();

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['mobile-home-locations'],
    queryFn: locationService.getLocations,
  });

  const { data: hotTours = [], isLoading: toursLoading } = useQuery({
    queryKey: ['mobile-home-hot-tours'],
    queryFn: tourService.getHotTours,
  });

  return (
    <main className='min-h-screen bg-[#070707] text-white px-4 pt-24 pb-28'>
      <div className='mx-auto max-w-lg flex flex-col gap-7'>
        <section className='rounded-[2rem] border border-white/10 bg-gradient-to-b from-neutral-900 to-black p-5'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-sm text-neutral-400'>Xin chào, Trekker</p>
              <h1 className='text-4xl font-black tracking-tight mt-1'>
                Let&apos;s trek
              </h1>
            </div>
            <button
              aria-label='Thông báo'
              className='h-10 w-10 rounded-full border border-white/15 bg-white/5 text-neutral-300 flex items-center justify-center'
            >
              <Bell size={18} />
            </button>
          </div>

          <div className='mt-5 h-12 rounded-2xl border border-white/10 bg-white/5 px-4 flex items-center gap-2'>
            <Search size={16} className='text-neutral-500' />
            <input
              type='text'
              placeholder='Tìm kiếm tour hoặc địa điểm...'
              className='w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500'
            />
          </div>
        </section>

        <section className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Cung trekking hot</h2>
            <button
              onClick={() => router.push('/tours?mode=location')}
              className='text-sm inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 transition-colors'
            >
              Xem tất cả <ChevronRight size={15} />
            </button>
          </div>

          {locationsLoading ? (
            <div className='text-sm text-neutral-400'>Đang tải địa điểm...</div>
          ) : (
            <div className='flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
              {locations.map((location) => (
                <HotLocationCard
                  key={location.id}
                  name={location.name}
                  elevation={location.elevation_m}
                  imageUrl={location.full_image_url}
                  onClick={() => router.push('/tours?mode=location')}
                />
              ))}
              {!locations.length && (
                <p className='text-sm text-neutral-400'>Chưa có địa điểm.</p>
              )}
            </div>
          )}
        </section>

        <section className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Tours sắp diễn ra</h2>
            <button
              onClick={() => router.push('/tours?mode=tour')}
              className='text-sm inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 transition-colors'
            >
              Xem thêm <ChevronRight size={15} />
            </button>
          </div>

          {toursLoading ? (
            <div className='text-sm text-neutral-400'>Đang tải hot tours...</div>
          ) : (
            <div className='flex flex-col gap-3'>
              {hotTours.map((tour) => (
                <HotTourFeatureCard
                  key={tour.id}
                  title={tour.title}
                  imageUrl={tour.image_url}
                  locationName={tour.location.name}
                  startDate={tour.start_date}
                  endDate={tour.end_date}
                  slotsLeft={tour.slots_left}
                  onClick={() => router.push(`/tour-booking/${tour.id}`)}
                />
              ))}
              {!hotTours.length && (
                <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-neutral-400 text-center'>
                  Chưa có tour nổi bật.
                </div>
              )}
            </div>
          )}
        </section>

        <button
          onClick={() => router.push('/tours')}
          className='w-full rounded-2xl bg-[#d00600] text-white font-semibold py-3.5 inline-flex items-center justify-center gap-2 hover:bg-[#ab0500] transition-colors'
        >
          <Tent size={18} />
          Khám phá tất cả tour trekking
        </button>

        <p className='text-xs text-neutral-500 text-center'>
          Hải Thích Đi • Trekking, Kết nối, Thiện nguyện
        </p>
      </div>
    </main>
  );
}
