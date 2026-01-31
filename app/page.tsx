import HomeClient from './home-client';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Trang chủ',
  pathname: '/',
});

export default function Page() {
  return <HomeClient />;
}
