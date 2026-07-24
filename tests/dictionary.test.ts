import { describe, it, expect } from 'vitest';
import dictionary from '@/lib/i18n/dictionary';

/**
 * Recursively collects every "key path" in an object, e.g.
 * { nav: { home: 'x' } } -> ['nav.home']
 */
function collectKeyPaths(obj: any, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return [prefix];
  }
  return Object.keys(obj).flatMap((key) =>
    collectKeyPaths(obj[key], prefix ? `${prefix}.${key}` : key)
  );
}

describe('dictionary translation parity (fr vs ar)', () => {
  const frKeys = collectKeyPaths(dictionary.fr).sort();
  const arKeys = collectKeyPaths(dictionary.ar).sort();

  it('has both a fr and an ar top-level section', () => {
    expect(dictionary.fr).toBeTruthy();
    expect(dictionary.ar).toBeTruthy();
  });

  it('every French key path also exists in Arabic', () => {
    const missingInAr = frKeys.filter((k) => !arKeys.includes(k));
    expect(missingInAr, `Keys present in fr but missing in ar:\n${missingInAr.join('\n')}`).toEqual([]);
  });

  it('every Arabic key path also exists in French', () => {
    const missingInFr = arKeys.filter((k) => !frKeys.includes(k));
    expect(missingInFr, `Keys present in ar but missing in fr:\n${missingInFr.join('\n')}`).toEqual([]);
  });

  it('no translation value is an empty string', () => {
    const emptyFr = frKeys.filter((k) => {
      const value = k.split('.').reduce((obj, part) => obj?.[part], dictionary.fr as any);
      return typeof value === 'string' && value.trim() === '';
    });
    const emptyAr = arKeys.filter((k) => {
      const value = k.split('.').reduce((obj, part) => obj?.[part], dictionary.ar as any);
      return typeof value === 'string' && value.trim() === '';
    });
    expect([...emptyFr, ...emptyAr]).toEqual([]);
  });
});
