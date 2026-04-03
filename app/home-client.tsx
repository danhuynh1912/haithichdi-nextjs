'use client';

import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import HomeDesktop from './home/home-desktop';
import HomeMobile from './home/home-mobile';

export default function HomeClient() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <HomeMobile />;
  }

  return <HomeDesktop />;
}
