'use client';

import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import ToursClient from './tours-client';
import MobileToursClient from './mobile-tours-client';

export default function ToursRouteClient() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileToursClient />;
  }

  return <ToursClient />;
}
