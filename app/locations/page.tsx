'use client';

import { useEffect, useState } from 'react';
import { locationService } from '@/lib/services/location';
import { Location } from './types';
import BackgroundBlur from './components/background-blur';
import LocationCarousel from './components/location-carousel';
import LocationDetailModal from './components/location-detail-modal';
import { motion, AnimatePresence } from 'motion/react';
import { ANIMATION_EASE } from '@/lib/constants';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center text-white'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className='w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full'
        />
      </div>
    );
  }

  return (
    <main className='relative h-[calc(100vh)] w-full flex flex-col items-center justify-center pt-24 overflow-hidden'>
      {/* Background with blur transition */}
      <BackgroundBlur imageUrl={locations[activeIndex]?.full_image_url} />

      <div className='container mx-auto px-4 z-10'>
        <div className='text-center mb-12'>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: ANIMATION_EASE, duration: 0.8 }}
            className='text-red-600 font-bold tracking-[0.3em] uppercase mb-1'
          >
            Hải Thích đi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: ANIMATION_EASE, duration: 0.8 }}
            className='text-white text-5xl font-black uppercase tracking-tight'
          >
            CÁC CUNG NỔI BẬT
          </motion.h1>
        </div>

        <LocationCarousel
          locations={locations}
          onActiveChange={(index) => setActiveIndex(index)}
          onDetailsClick={(location) => setSelectedLocation(location)}
        />
      </div>

      <LocationDetailModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </main>
  );
}
