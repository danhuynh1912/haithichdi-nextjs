import api from '@/lib/api';
import { Location } from '@/app/locations/types';

export interface TourDetail {
  id: number;
  title: string;
  start_date: string | null;
  end_date: string | null;
  location: Location;
  image_url: string | null;
  slots_left: number;
  booked_count: number;
}

export interface BookingPayload {
  tour: number;
  full_name: string;
  phone: string;
  email?: string;
  note?: string;
  medal_name: string;
  dob: string;
  citizen_id: string;
}

export interface BookingResponse {
  id: number;
  status: string;
}

export const tourService = {
  getTourDetail: async (tourId: number) => {
    const response = await api.get<TourDetail>(`/api/tours/${tourId}/`);
    return response.data;
  },
  createBooking: async (payload: BookingPayload) => {
    const response = await api.post<BookingResponse>('/api/bookings/', payload);
    return response.data;
  },
};
