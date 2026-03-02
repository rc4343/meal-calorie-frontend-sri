import { describe, it, expect, vi, afterEach } from 'vitest';
import { isTokenExpired } from '@/lib/auth';

// helper: build a fake JWT with a given exp
function fakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-sig`;
}

describe('isTokenExpired', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true for null token', () => {
    expect(isTokenExpired(null)).toBe(true);
  });

  it('returns true for empty string', () => {
    expect(isTokenExpired('')).toBe(true);
  });

  it('returns false for token with no exp claim', () => {
    const token = fakeJwt({ sub: 'user-1' });
    expect(isTokenExpired(token)).toBe(false);
  });

  it('returns false for token expiring in the future', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const token = fakeJwt({ exp: futureExp });
    expect(isTokenExpired(token)).toBe(false);
  });

  it('returns true for token that already expired', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
    const token = fakeJwt({ exp: pastExp });
    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns true when token expires within 30-second buffer', () => {
    const almostExpired = Math.floor(Date.now() / 1000) + 20; // 20s from now, within 30s buffer
    const token = fakeJwt({ exp: almostExpired });
    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns false for garbage token', () => {
    expect(isTokenExpired('not.a.jwt')).toBe(false);
  });
});
