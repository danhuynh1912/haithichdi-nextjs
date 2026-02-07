import api from '@/lib/api';

export interface Leader {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  full_avatar_url?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  strengths?: string[];
  display_role?: string;
  relationship_status?: string;
  date_of_birth?: string | null;
  location?: string | null;
  highlight?: string | null;
  years_experience?: number;
  date_joined?: string;
}

export const leaderService = {
  getLeaders: async () => {
    const response = await api.get<Leader[]>('/api/leaders/');
    return response.data;
  },
};
