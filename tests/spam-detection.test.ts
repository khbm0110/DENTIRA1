import { describe, it, expect } from 'vitest';
import { looksLikeSpam } from '@/lib/utils/spam-detection';

describe('looksLikeSpam', () => {
  it('flags a filled honeypot field as spam', () => {
    expect(looksLikeSpam('http://spam.example', undefined)).toBe(true);
  });

  it('does not flag an empty honeypot field', () => {
    expect(looksLikeSpam('', Date.now() - 5000)).toBe(false);
  });

  it('does not flag a whitespace-only honeypot field (trimmed before checking)', () => {
    expect(looksLikeSpam('   ', Date.now() - 5000)).toBe(false);
  });

  it('flags a submission that happens too fast after the form rendered', () => {
    const renderedAt = Date.now() - 500; // 0.5s ago
    expect(looksLikeSpam(undefined, renderedAt)).toBe(true);
  });

  it('allows a submission that happens after a reasonable delay', () => {
    const renderedAt = Date.now() - 5000; // 5s ago
    expect(looksLikeSpam(undefined, renderedAt)).toBe(false);
  });

  it('allows a submission when no timing info was provided at all', () => {
    expect(looksLikeSpam(undefined, undefined)).toBe(false);
  });

  it('respects the injectable "now" parameter for deterministic testing', () => {
    const renderedAt = 1_000_000;
    expect(looksLikeSpam(undefined, renderedAt, renderedAt + 100)).toBe(true);
    expect(looksLikeSpam(undefined, renderedAt, renderedAt + 10_000)).toBe(false);
  });
});
