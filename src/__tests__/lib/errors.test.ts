import { describe, it, expect } from 'vitest';
import { toErrorMessage } from '@/lib/errors';

// simple t() mock that returns the key prefixed
const t = (key: string) => `translated:${key}`;

describe('toErrorMessage', () => {
  it('returns backend message when present', () => {
    const err = { message: 'Email already taken', status: 409 };
    expect(toErrorMessage(t, err)).toBe('Email already taken');
  });

  it('falls back to i18n key for 404', () => {
    const err = { message: '', status: 404 };
    expect(toErrorMessage(t, err)).toBe('translated:error.notFound');
  });

  it('falls back to i18n key for 500', () => {
    const err = { message: '', status: 500 };
    expect(toErrorMessage(t, err)).toBe('translated:error.server');
  });

  it('falls back to i18n key for 429', () => {
    const err = { message: '', status: 429 };
    expect(toErrorMessage(t, err)).toBe('translated:error.tooMany');
  });

  it('returns unknown error for unmapped status', () => {
    const err = { message: '', status: 418 };
    expect(toErrorMessage(t, err)).toBe('translated:error.unknown');
  });

  it('handles completely unknown error shape', () => {
    expect(toErrorMessage(t, new Error('oops'))).toBe('oops');
  });

  it('handles null/undefined error', () => {
    expect(toErrorMessage(t, null)).toBe('translated:error.unknown');
  });
});
