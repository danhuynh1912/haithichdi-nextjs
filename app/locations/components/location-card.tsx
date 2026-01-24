'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import { Location } from '../types';
import { ANIMATION_EASE } from '@/lib/constants';

interface LocationCardProps {
  location: Location;
  index: number;
  activeIndex: number;
  is2xl: boolean;
  onClick: () => void;
  onDetailsClick: (location: Location) => void;
}

function LocationCardBase({
  location,
  index,
  activeIndex,
  is2xl,
  onClick,
  onDetailsClick,
}: LocationCardProps) {
  const diff = index - activeIndex;
  const isCenter = diff === 0;

  const { translateX, scale, rotateY, zIndex, opacity } = useMemo(() => {
    const getScale = () => {
      if (isCenter) return 1.0;
      return 1 + Math.min(Math.abs(diff) * 0.25, 0.75);
    };

    const getRotateY = () => {
      if (isCenter) return 0;
      return diff < 0 ? 35 : -35;
    };

    const getTranslateX = () => {
      const multiplier = is2xl ? 260 : 200;
      return diff * multiplier;
    };

    const getZIndex = () => 100 - Math.abs(diff);

    const getOpacity = () => (Math.abs(diff) > 2 ? 0 : 1);

    return {
      scale: getScale(),
      rotateY: getRotateY(),
      translateX: getTranslateX(),
      zIndex: getZIndex(),
      opacity: getOpacity(),
    };
  }, [diff, isCenter, is2xl]);

  return (
    <motion.div
      whileHover={isCenter ? 'hover' : undefined}
      initial='initial'
      animate={{
        x: translateX,
        scale,
        rotateY,
        zIndex,
        opacity: isCenter ? 1 : opacity,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      onClick={onClick}
      className='absolute cursor-pointer perspective-1000'
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        layoutId={`location-card-${location.id}`}
        transition={{
          duration: 0.4,
          ease: ANIMATION_EASE,
        }}
        className='relative w-[250px] h-[400px] 2xl:w-[300px] 2xl:h-[450px] rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-[#d1d1d1] group transform-gpu bg-neutral-900 flex'
      >
        {/* Left Side (Image Area) - Synchronized with Modal structure but without intermediate layoutId */}
        <div
          className='relative h-full overflow-hidden shrink-0'
          style={{ width: '100%' }}
        >
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
                className='object-cover transition-transform duration-500 group-hover:scale-110'
              />
            ) : (
              <div className='w-full h-full bg-neutral-800 flex items-center justify-center'>
                <span className='text-neutral-500'>No Image</span>
              </div>
            )}
          </motion.div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1]' />
        </div>

        {/* Right Side (Content Area Placeholder for Parity) */}
        <div className='w-0 h-full overflow-hidden invisible' />

        {/* Floating Overlay Content - Labels no longer use layoutId to stop production flicker */}
        <div className='absolute inset-0 z-10 flex flex-col justify-end p-8 pointer-events-none'>
          <div className='pointer-events-auto'>
            <p className='text-red-500 font-bold mb-1'>
              #{String(index + 1).padStart(2, '0')}
            </p>
            <h3 className='text-3xl font-black uppercase tracking-tight text-white'>
              {location.name}
            </h3>

            <motion.div
              variants={{
                initial: { opacity: 0, height: 0, marginTop: 0 },
                hover: { opacity: 1, height: 'auto', marginTop: 16 },
              }}
              transition={{ ease: ANIMATION_EASE, duration: 0.5 }}
              className='overflow-hidden'
            >
              <p className='text-sm text-neutral-300 line-clamp-2'>
                {location.description}
              </p>

              {isCenter && (
                <div className='mt-1'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDetailsClick(location);
                    }}
                    className='w-full cursor-pointer py-4 bg-white text-black font-extrabold rounded-full text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95'
                  >
                    Chi tiết
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const LocationCard = memo(LocationCardBase, (prev, next) => {
  return (
    prev.location.id === next.location.id &&
    prev.index === next.index &&
    prev.activeIndex === next.activeIndex &&
    prev.is2xl === next.is2xl
  );
});

export default LocationCard;
