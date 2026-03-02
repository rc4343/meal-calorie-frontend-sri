import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/authStore';

describe('apiRequest', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    vi.restoreAllMocks();
  });

  it('attaches Bearer token when authenticated', async () => {
    const { apiRequest } = await import('@/lib/api');

    useAuthStore.getState().login('test-jwt', { email: 'test@example.com' });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiRequest('/test', { method: 'GET' });

    const headers = mockFetch.mock.calls[0][1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-jwt');
  });

  it('does not attach token when unauthenticated', async () => {
    const { apiRequest } = await import('@/lib/api');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiRequest('/public', { method: 'GET' });

    const headers = mockFetch.mock.calls[0][1].headers as Headers;
    expect(headers.has('Authorization')).toBe(false);
  });

  it('sets Content-Type to application/json by default', async () => {
    const { apiRequest } = await import('@/lib/api');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiRequest('/test');

    const headers = mockFetch.mock.calls[0][1].headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('logs out and throws on 401 response', async () => {
    const { apiRequest } = await import('@/lib/api');

    useAuthStore.getState().login('expired', { email: 'test@example.com' });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 401, json: async () => ({ message: 'Unauthorized' }),
    }));

    await expect(apiRequest('/protected'))
      .rejects.toMatchObject({ message: 'Session expired', status: 401 });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('throws with backend message on 4xx/5xx', async () => {
    const { apiRequest } = await import('@/lib/api');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 404, json: async () => ({ message: 'Dish not found' }),
    }));

    await expect(apiRequest('/get-calories'))
      .rejects.toMatchObject({ message: 'Dish not found', status: 404 });
  });

  it('throws with empty message when body has no message field', async () => {
    const { apiRequest } = await import('@/lib/api');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500, json: async () => ({}),
    }));

    await expect(apiRequest('/fail'))
      .rejects.toMatchObject({ message: '', status: 500 });
  });

  it('handles non-JSON error body gracefully', async () => {
    const { apiRequest } = await import('@/lib/api');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 502, json: async () => { throw new Error('not json'); },
    }));

    await expect(apiRequest('/bad-gateway'))
      .rejects.toMatchObject({ message: '', status: 502 });
  });

  it('returns data and status on success', async () => {
    const { apiRequest } = await import('@/lib/api');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ dish_name: 'Rice', total_calories: 400 }),
    }));

    const res = await apiRequest('/get-calories');
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ dish_name: 'Rice', total_calories: 400 });
  });
});
