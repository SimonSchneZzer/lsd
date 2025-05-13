import { describe, expect, it } from 'vitest';
import { flattenMapping, getEctsMatch } from './ectsUtils';

describe('flattenMapping', () => {
  it('flattens simple semester array structure', () => {
    const input = {
      semester1: [
        { name: 'Mathe 1', ects: 5 },
        { name: 'Englisch', ects: 2 },
      ],
    };

    const result = flattenMapping(input);
    expect(result).toEqual({
      'Mathe 1': 5,
      'Englisch': 2,
    });
  });

  it('flattens common + wahlpflicht + schwerpunkt (web + game)', () => {
    const input = {
      semester2: {
        common: [{ name: 'Medienrecht', ects: 2 }],
        wahlpflicht: [{ name: 'Statistik', ects: 3 }],
        schwerpunkt: {
          web: [{ name: 'Webtechnologien', ects: 4 }],
          game: [{ name: 'Game Engine', ects: 6 }],
        },
      },
    };

    const result = flattenMapping(input);
    expect(result).toEqual({
      'Medienrecht': 2,
      'Statistik': 3,
      'Webtechnologien': 4,
      'Game Engine': 6,
    });
  });

  it('uses 0 as fallback if ects is missing', () => {
    const input = {
      semester3: {
        schwerpunkt: {
          web: [{ name: 'Unbekannt' }], // ohne ects
        },
      },
    };

    const result = flattenMapping(input);
    expect(result).toEqual({ 'Unbekannt': 0 });
  });
});

describe('getEctsMatch', () => {
  const mapping = {
    'Mathe 1': 5,
    'Webtechnologien': 4,
    'Game Engine': 6,
  };

  it('matches exact course name', () => {
    const result = getEctsMatch('Mathe 1', mapping);
    expect(result).toEqual({ ects: 5, courseId: 'Mathe 1' });
  });

  it('matches ignoring spaces and case', () => {
    const result = getEctsMatch('  web   TECHNOLOGIEN  ', mapping);
    expect(result).toEqual({ ects: 4, courseId: 'Webtechnologien' });
  });

  it('returns 0 and null if no match', () => {
    const result = getEctsMatch('Biologie', mapping);
    expect(result).toEqual({ ects: 0, courseId: null });
  });
});