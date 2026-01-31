import { createMetadata } from '@/lib/seo';
import LocationsClient from './locations-client';

export const metadata = createMetadata({
  title: 'Địa điểm trekking nổi bật',
  description:
    'Khám phá các cung đường trekking nổi bật cùng Hải Thích Đi, đầy đủ thông tin địa điểm và tour sắp diễn ra.',
  pathname: '/locations',
});

export default function Page() {
  return <LocationsClient />;
}
