'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Location } from '../types';
import LocationCard from './location-card';
import { motion } from 'motion/react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface LocationCarouselProps {
  locations: Location[];
  onActiveChange: (index: number) => void;
  onDetailsClick: (location: Location) => void;
}

export default function LocationCarousel({
  locations,
  onActiveChange,
  onDetailsClick,
}: LocationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const is2xl = useMediaQuery('(min-width: 1536px)');

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % locations.length;
    setActiveIndex(nextIndex);
    onActiveChange(nextIndex);
  };

  const handlePrev = () => {
    const nextIndex = (activeIndex - 1 + locations.length) % locations.length;
    setActiveIndex(nextIndex);
    onActiveChange(nextIndex);
  };

  const setIndex = (index: number) => {
    setActiveIndex(index);
    onActiveChange(index);
  };

  if (!locations.length) return null;

  return (
    <>
      <div className='relative w-full flex flex-col items-center justify-center min-h-[500px] overflow-visible'>
        {/* Carousel Container with Perspective */}
        <div
          className='relative w-full h-[calc(100vh-400px)] flex items-center justify-center'
          style={{ perspective: '1200px' }}
        >
          {locations.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              index={index}
              activeIndex={activeIndex}
              is2xl={is2xl}
              onClick={() => setIndex(index)}
              onDetailsClick={onDetailsClick}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        {/* Navigation Controls */}
        <div className='mt-8 flex items-center gap-8'>
          <button
            onClick={handlePrev}
            className='w-14 h-14 cursor-pointer rounded-full border border-white/40 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-white/90'
          >
            <ChevronLeft size={24} />
          </button>

          <div className='flex flex-col items-center'>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center'
            >
              <h2 className='text-4xl font-black text-white uppercase tracking-wider mb-1'>
                {locations[activeIndex].name}
              </h2>
              <p className='text-red-500 font-medium tracking-widest'>
                {locations[activeIndex].elevation_m}M ABOVE SEA LEVEL
              </p>
            </motion.div>
          </div>

          <button
            onClick={handleNext}
            className='w-14 h-14 cursor-pointer rounded-full border border-white/40 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-white/90'
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className='mt-4 flex gap-2'>
          {locations.map((_, index) => (
            <div
              key={index}
              onClick={() => setIndex(index)}
              className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
                index === activeIndex ? 'w-8 bg-red-600' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
