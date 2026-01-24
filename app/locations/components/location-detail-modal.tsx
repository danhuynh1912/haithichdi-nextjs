'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Location, Tour } from '../types';
import { locationService } from '@/lib/services/location';
import { X, Calendar, Users, MoveRight } from 'lucide-react';
import { ANIMATION_EASE } from '@/lib/constants';
import { formatDateDdMm } from '@/lib/utils';

interface LocationDetailModalProps {
  location: Location | null;
  onClose: () => void;
}

export default function LocationDetailModal({
  location,
  onClose,
}: LocationDetailModalProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      const fetchTours = async () => {
        setLoading(true);
        try {
          const data = await locationService.getToursByLocation(location.id);
          setTours(data);
        } catch (error) {
          console.error('Error fetching tours:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTours();
    } else {
      setTours([]);
    }
  }, [location]);

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            ease: ANIMATION_EASE,
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6 },
          }}
          className='fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md'
          onClick={onClose}
        >
          {/* Main Expanding Shell */}
          <motion.div
            layoutId={`location-card-${location.id}`}
            transition={{
              duration: 0.4,
              ease: ANIMATION_EASE,
            }}
            className='relative w-full max-w-5xl bg-neutral-900 rounded-[30px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[70vh] max-h-[800px] border border-white/10 shadow-2xl z-[10000]'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button UI */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-2 bg-black/40 md:bg-white/5 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer backdrop-blur-sm'
            >
              <X size={20} />
            </button>

            {/* Left side: Image Area */}
            <div className='relative w-full md:w-1/2 h-64 md:h-full overflow-hidden bg-neutral-800 shrink-0'>
              <motion.div
                layoutId={`location-image-${location.id}`}
                className='absolute inset-0'
                layout
              >
                {location.full_image_url &&
                typeof location.full_image_url === 'string' &&
                location.full_image_url.trim() !== '' ? (
                  <Image
                    src={location.full_image_url}
                    alt={location.name}
                    fill
                    unoptimized
                    priority
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-neutral-800 flex items-center justify-center'>
                    <span className='text-neutral-500'>No Image</span>
                  </div>
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20' />
              </motion.div>
            </div>

            {/* Right side: Content Area */}
            <div className='flex flex-col w-full md:w-1/2 overflow-hidden'>
              <div className='p-6 md:p-12 h-full flex flex-col overflow-hidden'>
                {/* Text content - Reverted to simple motion divs without layoutId for stability */}
                <div className='mb-6 md:mb-8 relative'>
                  <p className='text-red-500 font-bold tracking-[0.2em] uppercase mb-1 text-xs md:text-sm'>
                    Các cung
                  </p>
                  <h2 className='text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2 md:mb-4'>
                    {location.name}
                  </h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className='text-neutral-400 text-xs md:text-sm leading-relaxed max-w-md line-clamp-3 md:line-clamp-none'
                  >
                    {location.description}
                  </motion.p>
                </div>

                {/* The rest of the list fades in */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='flex-1 flex flex-col overflow-hidden'
                >
                  <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
                    <h3 className='text-white font-bold text-lg mb-6 flex items-center gap-2'>
                      Tours sắp tới
                      <span className='px-2 py-0.5 bg-red-600/20 text-red-500 text-[10px] rounded-full uppercase tracking-widest'>
                        {tours.length} tours
                      </span>
                    </h3>

                    {loading ? (
                      <div className='space-y-4'>
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className='h-24 bg-white/5 rounded-2xl'
                          />
                        ))}
                      </div>
                    ) : tours.length > 0 ? (
                      <div className='space-y-4'>
                        {tours.map((tour) => (
                          <div
                            key={tour.id}
                            className='group bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 cursor-pointer flex justify-between items-center transition-colors'
                          >
                            <div className='flex flex-col gap-2'>
                              <h4 className='font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-wide'>
                                {tour.title}
                              </h4>
                              <div className='flex items-center gap-4 text-xs text-neutral-400'>
                                <span className='flex items-center gap-1.5'>
                                  <Calendar
                                    size={14}
                                    className='text-red-600'
                                  />
                                  {formatDateDdMm(tour.start_date)}
                                </span>
                                <span className='flex items-center gap-1.5'>
                                  <Users size={14} className='text-red-600' />
                                  Còn {tour.slots_left} chỗ
                                </span>
                              </div>
                            </div>
                            <div className='p-2 rounded-full bg-white/5 group-hover:bg-red-600 group-hover:text-white transition-colors text-neutral-500'>
                              <MoveRight size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='py-12 text-center'>
                        <p className='text-neutral-500 italic'>
                          Hiện chưa có tour cho cung đường này.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='mt-8 pt-6 border-t border-white/5 flex justify-end items-center'>
                    <button className='text-neutral-500 hover:text-red-500 text-xs font-bold flex items-center gap-1 group uppercase tracking-[0.2em] transition-colors cursor-pointer'>
                      Xem thêm
                      <MoveRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
