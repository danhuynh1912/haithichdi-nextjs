'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Location, Tour } from '../types';
import { locationService } from '@/lib/services/location';
import { X, Calendar, Users, MoveRight, FileText } from 'lucide-react';
import { formatDateDdMm } from '@/lib/utils';

interface LocationDetailModalProps {
  location: Location | null;
  onClose: () => void;
}

export default function LocationDetailModal({
  location,
  onClose,
}: LocationDetailModalProps) {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setTours([]);
      return;
    }

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
  }, [location]);

  const pdfUrl = useMemo(
    () => location?.quotation_file_url || null,
    [location?.quotation_file_url],
  );

  const pdfSrc = useMemo(() => {
    if (!pdfUrl) return null;
    const suffix = 'toolbar=0&navpanes=0&scrollbar=0';
    return pdfUrl.includes('#') ? `${pdfUrl}&${suffix}` : `${pdfUrl}#${suffix}`;
  }, [pdfUrl]);
  return (
    <AnimatePresence>
      {location && (
        <motion.div
          key={location.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className='fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md text-white'
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='relative w-full h-full flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className='absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-2 bg-white/10 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer'
              aria-label='Đóng'
            >
              <X size={20} />
            </button>

            <div className='flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-8 max-w-screen-2xl w-full mx-auto'>
              {/* Left: PDF viewer */}
              <div className='w-full md:w-[70%] bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[50vh] md:min-h-[75vh]'>
                {pdfSrc ? (
                  <iframe
                    src={pdfSrc}
                    title={`Quotation - ${location.name}`}
                    className='w-full h-full'
                  />
                ) : (
                  <div className='w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400 px-6 text-center'>
                    <FileText className='text-red-600' size={32} />
                    <p>Chưa có file quotation cho địa điểm này.</p>
                  </div>
                )}
              </div>

              {/* Right: Tours list */}
              <div className='w-full md:w-[30%] bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden'>
                <div className='p-6 border-b border-white/5'>
                  <p className='text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-2'>
                    Các cung
                  </p>
                  <h2 className='text-3xl font-black uppercase tracking-tight text-white mb-3'>
                    {location.name}
                  </h2>
                  <p className='text-neutral-400 text-sm leading-relaxed line-clamp-3'>
                    {location.description}
                  </p>
                </div>

                <div className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
                  <div className='flex items-center justify-between mb-4 gap-3'>
                    <h3 className='text-white font-bold text-lg flex items-center gap-2'>
                      Tours sắp tới
                      <span className='px-2 py-0.5 bg-red-600/20 text-red-500 text-[10px] rounded-full uppercase tracking-widest'>
                        {tours.length} tours
                      </span>
                    </h3>
                    <button className='text-neutral-500 hover:text-red-500 text-xs font-bold flex items-center gap-1 uppercase tracking-[0.2em] transition-colors cursor-pointer'>
                      Xem thêm <MoveRight size={14} />
                    </button>
                  </div>

                  {loading ? (
                    <div className='space-y-3'>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className='h-20 bg-white/5 rounded-2xl animate-pulse' />
                      ))}
                    </div>
                  ) : tours.length > 0 ? (
                    <div className='space-y-3'>
                      {tours.map((tour) => (
                        <div
                          key={tour.id}
                          className='group bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 cursor-pointer flex justify-between items-center transition-colors'
                          onClick={() => router.push(`/tour-booking/${tour.id}`)}
                        >
                          <div className='flex flex-col gap-1.5'>
                            <h4 className='font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-wide'>
                              {tour.title}
                            </h4>
                            <div className='flex items-center gap-4 text-xs text-neutral-400'>
                              <span className='flex items-center gap-1.5'>
                                <Calendar size={14} className='text-red-600' />
                                {formatDateDdMm(tour.start_date)}
                              </span>
                              <span className='flex items-center gap-1.5'>
                                <Users size={14} className='text-red-600' />
                                Còn {tour.slots_left} chỗ
                              </span>
                            </div>
                          </div>
                          <div className='p-2 rounded-full bg-white/5 group-hover:bg-red-600 group-hover:text-white transition-colors text-neutral-500'>
                            <MoveRight size={18} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='py-10 text-center'>
                      <p className='text-neutral-500 italic'>
                        Hiện chưa có tour cho cung đường này.
                      </p>
                    </div>
                  )}
                </div>

                {/* <div className='p-6 border-t border-white/5 flex justify-end items-center'>
                  <button className='text-neutral-500 hover:text-red-500 text-xs font-bold flex items-center gap-1 uppercase tracking-[0.2em] transition-colors cursor-pointer'>
                    Xem lịch trình {location.name}
                    <MoveRight size={14} />
                  </button>
                </div> */}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
