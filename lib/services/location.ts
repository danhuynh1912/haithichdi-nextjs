import api from '@/lib/api';
import { Location } from '@/app/locations/types';

export const locationService = {
  getLocations: async () => {
    const response = await api.get<Location[]>('/api/locations/');
    return response.data;
  },
};
