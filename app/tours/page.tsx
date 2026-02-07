import { createMetadata } from '@/lib/seo';
import ToursClient from './tours-client';

export const metadata = createMetadata({
  title: 'Tours',
  description: 'Danh sách tour trekking Hải Thích Đi với bộ lọc địa điểm và tìm kiếm.',
  pathname: '/tours',
});

export default function Page() {
  return <ToursClient />;
}
