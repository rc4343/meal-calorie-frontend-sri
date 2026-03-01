import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/authStore';

describe('API mock mode', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('registerUser returns mock response with user data', async () => {
    const { registerUser } = await import('@/lib/api');

    const res = await registerUser({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.data.token).toBe('mock-jwt-token-xxx');
    expect(res.data.user.firstName).toBe('Alice');
    expect(res.data.user.email).toBe('alice@example.com');
  });

  it('loginUser returns mock response with email', async () => {
    const { loginUser } = await import('@/lib/api');

    const res = await loginUser({
      email: 'bob@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.data.token).toBe('mock-jwt-token-xxx');
    expect(res.data.user.email).toBe('bob@example.com');
  });

  it('getCalories returns correct calorie math', async () => {
    const { getCalories } = await import('@/lib/api');

    const res = await getCalories({ dish_name: 'Pasta', servings: 3 });

    expect(res.status).toBe(200);
    expect(res.data.dish_name).toBe('Pasta');
    expect(res.data.servings).toBe(3);
    expect(res.data.calories_per_serving).toBe(280);
    expect(res.data.total_calories).toBe(840);
  });
});

describe('apiRequest', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    vi.restoreAllMocks();
  });

  it('attaches Bearer token when authenticated', async () => {
    const { apiRequest } = await import('@/lib/api');

    useAuthStore.getState().login('test-jwt', {
      email: 'test@example.com',
    });

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

  it('logs out on 401 response', async () => {
    const { apiRequest } = await import('@/lib/api');

    useAuthStore.getState().login('expired', {
      email: 'test@example.com',
    });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 401, json: async () => ({ message: 'Unauthorized' }),
    }));

    await expect(apiRequest('/protected', { method: 'GET' }))
      .rejects.toMatchObject({ message: 'Session expired', status: 401 });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('throws on server error', async () => {
    const { apiRequest } = await import('@/lib/api');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500, json: async () => ({ message: 'Internal Server Error' }),
    }));

    await expect(apiRequest('/fail', { method: 'GET' }))
      .rejects.toMatchObject({ message: 'Internal Server Error', status: 500 });
  });
});
