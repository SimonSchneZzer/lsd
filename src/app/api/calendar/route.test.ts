import { GET } from './route';
import { describe, expect, it, vi } from 'vitest';
import { NextResponse } from 'next/server';

// Utils-Mocks
vi.mock('@/lib/icsUtils', async () => {
  const actual = await vi.importActual<any>('@/lib/icsUtils');
  return {
    ...actual,
    getDurationMinutes: vi.fn(() => 90),
    estimateLessonUnits: vi.fn(() => 2),
  };
});

vi.mock('@/lib/ectsUtils', async () => {
  const actual = await vi.importActual<any>('@/lib/ectsUtils');
  return {
    ...actual,
    flattenMapping: vi.fn(() => ({
      'Medientechnik': 3,
      'Mathe 1': 5,
    })),
    getEctsMatch: vi.fn((summary: string) => {
      if (summary.includes('Mathe')) return { ects: 5, courseId: 'Mathe 1' };
      if (summary.includes('Medientechnik')) return { ects: 3, courseId: 'Medientechnik' };
      return { ects: 0, courseId: null };
    }),
  };
});

// Setup fetch mock
const setFetchResponse = (ics: string) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve(ics),
    })
  ) as any;
};

describe('GET /api/calendar', () => {
  it('returns parsed calendar events and total ECTS', async () => {
    setFetchResponse(`
BEGIN:VEVENT
SUMMARY:Mathe 1 - Einführung
DESCRIPTION:Grundlagen der Mathematik
DTSTART:20250513T080000
DTEND:20250513T093000
END:VEVENT

BEGIN:VEVENT
SUMMARY:Medientechnik - Grundlagen
DESCRIPTION:Vorlesung zu Medienproduktion
DTSTART:20250513T100000
DTEND:20250513T113000
END:VEVENT

BEGIN:VEVENT
SUMMARY:Unbekanntes Fach
DESCRIPTION:Irgendeine Beschreibung
DTSTART:20250513T120000
DTEND:20250513T133000
END:VEVENT
`);

    const request = new Request('http://localhost/api/calendar?icsUrl=http://example.com/calendar.ics');
    const response = await GET(request);
    const json = await response.json();

    expect(response instanceof NextResponse).toBe(true);
    expect(json.events).toHaveLength(3);
    expect(json.totalEcts).toBe(8); // 5 + 3 + 0

    const summaries = json.events.map((e: any) => e.summary);
    expect(summaries).toContain('Einführung');
    expect(summaries).toContain('Grundlagen');
    expect(summaries).toContain('Unbekanntes Fach');
  });

  it('filters guest lectures from result', async () => {
    setFetchResponse(`
BEGIN:VEVENT
SUMMARY:Gastvortrag - Nachhaltigkeit
DESCRIPTION:Gastvortrag über Umwelttechnik
DTSTART:20250513T080000
DTEND:20250513T093000
END:VEVENT
`);

    const request = new Request('http://localhost/api/calendar?icsUrl=http://example.com/calendar.ics');
    const response = await GET(request);
    const json = await response.json();

    expect(json.events).toHaveLength(0);
    expect(json.totalEcts).toBe(0);
  });

  it('returns 400 when icsUrl is missing', async () => {
    const request = new Request('http://localhost/api/calendar');
    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it('returns 500 on fetch failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch failed'))) as any;

    const request = new Request('http://localhost/api/calendar?icsUrl=http://example.com/fail.ics');
    const response = await GET(request);
    expect(response.status).toBe(500);
  });
});

