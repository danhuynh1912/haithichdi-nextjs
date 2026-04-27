import api from '@/lib/api';

export interface HomeFeaturedRouteAudience {
  id: number;
  code: string;
  title: string;
  description: string;
}

export interface HomeFeaturedRoute {
  id: number;
  name: string;
  display_name: string;
  subtitle: string;
  summary: string;
  image_url: string | null;
  suitable_audiences: HomeFeaturedRouteAudience[];
}

export interface HomeHighlightAudienceLocation {
  id: number;
  name: string;
  display_name: string;
}

export interface HomeHighlightAudience {
  id: number;
  code: string;
  title: string;
  description: string;
  locations: HomeHighlightAudienceLocation[];
}

export interface HomeFeaturedRoutesResponse {
  routes: HomeFeaturedRoute[];
  highlight_audience: HomeHighlightAudience | null;
}

export interface HomeMomentsGalleryImage {
  id: number;
  image_url: string | null;
  caption: string;
  tour_title: string;
  location_name: string;
  width: number | null;
  height: number | null;
}

export interface HomeMomentsGalleryResponse {
  images: HomeMomentsGalleryImage[];
}

export const homeService = {
  getFeaturedRoutes: async () => {
    const response = await api.get<HomeFeaturedRoutesResponse>(
      '/api/home/featured-routes/',
    );
    return response.data;
  },
  getMomentsGallery: async () => {
    const response = await api.get<HomeMomentsGalleryResponse>(
      '/api/home/moments-gallery/',
    );
    return response.data;
  },
};
