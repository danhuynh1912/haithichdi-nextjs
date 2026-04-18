import api from '@/lib/api';
import { Location } from '@/app/locations/types';
import { TourListItem } from '@/app/tours/types';

export interface TourDetail {
  id: number;
  title: string;
  start_date: string | null;
  end_date: string | null;
  location: Location;
  image_url: string | null;
  slots_left: number;
  booked_count: number;
  price: string | null;
  description_md: string;
  summary: string;
  itinerary_md: string;
  images: TourImageItem[];
  itinerary_days: TourItineraryDay[];
}

export interface TourImageItem {
  id: number;
  image_url: string | null;
  caption: string;
  sort_order: number;
}

export interface TourItineraryDay {
  day_number: number;
  date: string | null;
  title: string;
  content_md: string;
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

export interface TourQueryParams {
  locationIds?: number[];
  search?: string;
  sortUpcoming?: boolean;
}

export const tourService = {
  getTourDetail: async (tourId: number) => {
    const response = await api.get<TourDetail>(`/api/tours/${tourId}/`);
    return response.data;
  },
  getTours: async (params: TourQueryParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.locationIds && params.locationIds.length) {
      searchParams.set('location_id', params.locationIds.join(','));
    }
    if (params.search?.trim()) {
      searchParams.set('search', params.search.trim());
    }
    if (params.sortUpcoming) {
      searchParams.set('ordering', 'start_date');
    }
    const query = searchParams.toString();
    const response = await api.get<TourListItem[]>(`/api/tours/${query ? `?${query}` : ''}`);
    return response.data;
  },
  getHotTours: async () => {
    const response = await api.get<TourDetail[]>('/api/tours/hot/');
    return response.data;
  },
  getRelatedTours: async (tourId: number, limit = 12) => {
    const response = await api.get<TourListItem[]>(`/api/tours/${tourId}/related/?limit=${limit}`);
    return response.data;
  },
  createBooking: async (payload: BookingPayload) => {
    const response = await api.post<BookingResponse>('/api/bookings/', payload);
    return response.data;
  },
};
