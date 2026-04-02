import api from '@/lib/api';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingLocationSummary {
  id: number;
  name: string;
  elevation_m: number;
  description: string;
  full_image_url: string | null;
  quotation_file_url?: string | null;
}

export interface BookingTourSummary {
  id: number;
  title: string;
  start_date: string | null;
  end_date: string | null;
  location: BookingLocationSummary;
}

export interface BookingDetail {
  id: number;
  tour: BookingTourSummary;
  full_name: string;
  phone: string;
  email: string;
  note: string;
  medal_name: string;
  dob: string | null;
  citizen_id: string;
  status: BookingStatus;
  status_label: string;
  created_at: string;
}

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; tone: 'warning' | 'success' | 'danger' }
> = {
  pending: { label: 'Chờ xác nhận', tone: 'warning' },
  confirmed: { label: 'Đã xác nhận', tone: 'success' },
  cancelled: { label: 'Đã hủy', tone: 'danger' },
};

export function getBookingStatusMeta(status: string, fallbackLabel?: string) {
  if (status in BOOKING_STATUS_META) {
    return BOOKING_STATUS_META[status as BookingStatus];
  }
  return {
    label: fallbackLabel || status,
    tone: 'warning' as const,
  };
}

export const bookingService = {
  getBookingDetail: async (bookingId: number) => {
    const response = await api.get<BookingDetail>(`/api/bookings/${bookingId}/`);
    return response.data;
  },
  getBookingsByIds: async (bookingIds: number[]) => {
    if (!bookingIds.length) {
      return [] as BookingDetail[];
    }

    const params = new URLSearchParams();
    params.set('ids', bookingIds.join(','));
    const response = await api.get<BookingDetail[]>(
      `/api/bookings/by-ids/?${params.toString()}`,
    );
    return response.data;
  },
};
