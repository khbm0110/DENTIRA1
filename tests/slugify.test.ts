import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/utils/slugify';

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Implantologie Dentaire')).toBe('implantologie-dentaire');
  });

  it('strips accented characters (French text)', () => {
    expect(slugify('Blanchiment au Laser Éclatant')).toBe('blanchiment-au-laser-eclatant');
  });

  it('removes special characters', () => {
    expect(slugify("Soins d'urgence !!! 24/7")).toBe('soins-d-urgence-24-7');
  });

  it('collapses multiple separators into one hyphen', () => {
    expect(slugify('Pédodontie   --  Enfants')).toBe('pedodontie-enfants');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  -Orthodontie-  ')).toBe('orthodontie');
  });

  it('produces a stable, unique-enough slug for two similar names', () => {
    // Not truly unique on its own - the DB unique constraint is what
    // ultimately guarantees uniqueness - but should not silently produce
    // the exact same slug for two different service names.
    expect(slugify('Blanchiment')).not.toBe(slugify('Blanchiment Premium'));
  });
});
