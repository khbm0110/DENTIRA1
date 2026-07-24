import { describe, it, expect } from 'vitest';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';

describe('ADMIN_SECRET_PATH', () => {
  it('has a non-empty fallback value when no env var is set', () => {
    expect(ADMIN_SECRET_PATH).toBeTruthy();
    expect(ADMIN_SECRET_PATH.length).toBeGreaterThan(3);
  });

  it('does not equal the real internal route name (would defeat the hidden-path protection)', () => {
    expect(ADMIN_SECRET_PATH).not.toBe('admin');
    expect(ADMIN_SECRET_PATH).not.toBe('login');
  });

  it('contains only URL-safe characters', () => {
    expect(ADMIN_SECRET_PATH).toMatch(/^[a-zA-Z0-9-_]+$/);
  });
});
