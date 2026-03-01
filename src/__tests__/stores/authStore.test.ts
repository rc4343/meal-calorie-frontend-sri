import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    localStorage.clear();
  });

  it('starts with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('login sets token, user, and isAuthenticated', () => {
    useAuthStore.getState().login('jwt-token-123', {
      email: 'alice@example.com',
      firstName: 'Alice',
      lastName: 'Smith',
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe('jwt-token-123');
    expect(state.user?.firstName).toBe('Alice');
    expect(state.user?.email).toBe('alice@example.com');
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout clears all auth state', () => {
    useAuthStore.getState().login('token', {
      email: 'bob@example.com',
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('persists auth state to localStorage', () => {
    useAuthStore.getState().login('persist-token', {
      email: 'carol@example.com',
      firstName: 'Carol',
    });

    const stored = localStorage.getItem('auth-storage');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.token).toBe('persist-token');
    expect(parsed.state.isAuthenticated).toBe(true);
  });
});
