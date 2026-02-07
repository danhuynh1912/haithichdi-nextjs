import api from '@/lib/api';
import { Location, Tour } from '@/app/locations/types';

export const locationService = {
  getLocations: async () => {
    const response = await api.get<Location[]>('/api/locations/');
    return response.data;
  },
  getToursByLocation: async (locationId: number) => {
    const response = await api.get<Tour[]>(`/api/tours/?location_id=${locationId}`);
    return response.data;
  },
};
