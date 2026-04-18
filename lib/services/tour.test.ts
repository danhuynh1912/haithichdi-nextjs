import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/api';
import { tourService } from './tour';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApiGet = vi.mocked(api.get);
const mockedApiPost = vi.mocked(api.post);

describe('tourService', () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
    mockedApiPost.mockReset();
  });

  it('builds list query with filter/search/sort params', async () => {
    mockedApiGet.mockResolvedValueOnce({ data: [] });

    await tourService.getTours({
      locationIds: [1, 2],
      search: '  ky quan san  ',
      sortUpcoming: true,
    });

    const calledUrl = mockedApiGet.mock.calls[0]?.[0] as string;
    expect(calledUrl.startsWith('/api/tours/?')).toBe(true);

    const queryString = calledUrl.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    expect(params.get('location_id')).toBe('1,2');
    expect(params.get('search')).toBe('ky quan san');
    expect(params.get('ordering')).toBe('start_date');
  });

  it('calls related tours endpoint with tour id and limit', async () => {
    mockedApiGet.mockResolvedValueOnce({ data: [] });

    await tourService.getRelatedTours(11, 6);

    expect(mockedApiGet).toHaveBeenCalledWith('/api/tours/11/related/?limit=6');
  });

  it('posts booking payload to booking endpoint', async () => {
    const payload = {
      tour: 3,
      full_name: 'Nguyen Van A',
      phone: '0988888888',
      medal_name: 'NGUYEN VAN A',
      dob: '1998-05-23',
      citizen_id: '012345678901',
    };
    mockedApiPost.mockResolvedValueOnce({ data: { id: 99, status: 'pending' } });

    const response = await tourService.createBooking(payload);

    expect(mockedApiPost).toHaveBeenCalledWith('/api/bookings/', payload);
    expect(response).toEqual({ id: 99, status: 'pending' });
  });
});
