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
}

function LocationCardBase({
  location,
  index,
  activeIndex,
  is2xl,
  onClick,
}: LocationCardProps) {
  const diff = index - activeIndex;
  const isCenter = diff === 0;

  // Calculate transforms based on the "concave" design from the image
  // User: "center thì nhỏ nhất và cân bằng"
  // User: "những slide không phải ở center sẽ có độ nghiêng giống hệt ảnh"

  // Memoize all calculations to avoid re-computing on every render
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
      className='absolute cursor-pointer perspective-1000 will-change-[transform] transform-gpu'
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div className='relative w-[250px] h-[400px] 2xl:w-[300px] 2xl:h-[450px] rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/10 group transform-gpu'>
        {location.full_image_url &&
        typeof location.full_image_url === 'string' &&
        location.full_image_url.trim() !== '' ? (
          <Image
            src={location.full_image_url}
            alt={location.name}
            fill
            unoptimized
            loading='lazy'
            className='object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform'
          />
        ) : (
          <div className='w-full h-full bg-neutral-800 flex items-center justify-center'>
            <span className='text-neutral-500'>No Image</span>
          </div>
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

        <div className='absolute bottom-10 left-8 right-8 text-white flex flex-col justify-end transform-gpu'>
          <p className='text-red-500 font-bold mb-1'>
            #{String(index + 1).padStart(2, '0')}
          </p>
          <h3 className='text-3xl font-black uppercase tracking-tight'>
            {location.name}
          </h3>

          <motion.div
            variants={{
              initial: { opacity: 0, height: 0, marginTop: 0 },
              hover: { opacity: 1, height: 'auto', marginTop: 16 },
            }}
            transition={{ ease: ANIMATION_EASE, duration: 0.5 }}
            className='overflow-hidden will-change-[height,opacity]'
          >
            <p className='text-sm text-neutral-300 line-clamp-2'>
              {location.description}
            </p>

            {/* Reveal Button for Center Card only */}
            {isCenter && (
              <div className='mt-1'>
                <button className='w-full py-4 bg-white text-black font-extrabold rounded-full text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 transform-gpu'>
                  Xem tours cung này
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Wrap with React.memo to prevent unnecessary re-renders of cards that didn't change
export const LocationCard = memo(LocationCardBase, (prev, next) => {
  return (
    prev.location.id === next.location.id &&
    prev.index === next.index &&
    prev.activeIndex === next.activeIndex &&
    prev.is2xl === next.is2xl
  );
});

export default LocationCard;
