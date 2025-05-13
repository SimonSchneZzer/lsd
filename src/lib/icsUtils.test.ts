import { describe, expect, it } from 'vitest';
import { parseIcsDate, getDurationMinutes, formatDuration, estimateLessonUnits } from './icsUtils';

  describe('parseIcsDate', () => {
  it('parses a valid ICS date string into a correct local Date', () => {
    // Testet, ob eine gültige ICS-Datumszeichenkette korrekt in ein lokales Datum umgewandelt wird.
    const date = parseIcsDate('20250513T081500');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(4); // Mai (0-indexed)
    expect(date.getDate()).toBe(13);
    expect(date.getHours()).toBe(8); // lokal
    expect(date.getMinutes()).toBe(15); // lokal
  });

  it('returns invalid Date when given incorrect format', () => {
    // Testet, ob eine ungültige ICS-Datumszeichenkette ein ungültiges Datum zurückgibt.
    const date = parseIcsDate('invalid');
    expect(isNaN(date.getTime())).toBe(true);
  });
});

describe('getDurationMinutes', () => {
  it('returns correct duration in minutes', () => {
    // Testet, ob die Dauer in Minuten korrekt berechnet wird, wenn Start- und Endzeit gültig sind.
    const start = '20250513T080000';
    const end = '20250513T093000';
    expect(getDurationMinutes(start, end)).toBe(90);
  });

  it('returns negative if end is before start', () => {
    // Testet, ob eine negative Dauer zurückgegeben wird, wenn die Endzeit vor der Startzeit liegt.
    const start = '20250513T100000';
    const end = '20250513T093000';
    expect(getDurationMinutes(start, end)).toBeLessThan(0);
  });

  it('returns NaN if input is invalid', () => {
    // Testet, ob NaN zurückgegeben wird, wenn eine der Eingaben ungültig ist.
    expect(getDurationMinutes('invalid', '20250513T093000')).toBeNaN();
  });
});

describe('formatDuration', () => {
  it('formats under 1 hour as Xmin', () => {
    // Testet, ob eine Dauer unter einer Stunde korrekt als "Xmin" formatiert wird.
    expect(formatDuration('20250513T080000', '20250513T082000')).toBe('20min');
  });

  it('formats hours and minutes correctly', () => {
    // Testet, ob Stunden und Minuten korrekt formatiert werden.
    expect(formatDuration('20250513T080000', '20250513T093000')).toBe('1h 30min');
  });

  it('formats exactly 2 hours', () => {
    // Testet, ob genau 2 Stunden korrekt formatiert werden.
    expect(formatDuration('20250513T080000', '20250513T100000')).toBe('2h 0min');
  });
});

describe('estimateLessonUnits', () => {
  it('returns 0 for 0 minutes', () => {
    // Testet, ob 0 Unterrichtseinheiten (EH) für 0 Minuten zurückgegeben werden.
    expect(estimateLessonUnits(0)).toBe(0);
  });

  it('returns 1 EH for 30min duration (+15 rule)', () => {
    // Testet, ob 1 Unterrichtseinheit (EH) für eine Dauer von 30 Minuten zurückgegeben wird.
    expect(estimateLessonUnits(30)).toBe(1);
  });

  it('caps EH at full block + 1', () => {
    // Testet, ob die Unterrichtseinheiten (EH) bei einem vollen Block + 1 korrekt begrenzt werden.
    expect(estimateLessonUnits(90)).toBe(2);
  });

  it('handles just below threshold correctly', () => {
    // Testet, ob die Unterrichtseinheiten (EH) knapp unterhalb der Schwelle korrekt berechnet werden.
    expect(estimateLessonUnits(44)).toBe(1);
  });
});