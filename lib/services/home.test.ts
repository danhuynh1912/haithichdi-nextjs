import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/api';
import { homeService } from './home';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedApiGet = vi.mocked(api.get);

describe('homeService', () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it('loads featured routes for the home section from the dedicated endpoint', async () => {
    mockedApiGet.mockResolvedValueOnce({
      data: { routes: [], highlight_audience: null },
    });

    const response = await homeService.getFeaturedRoutes();

    expect(mockedApiGet).toHaveBeenCalledWith('/api/home/featured-routes/');
    expect(response).toEqual({ routes: [], highlight_audience: null });
  });
});
