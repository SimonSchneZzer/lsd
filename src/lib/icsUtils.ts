export function parseIcsDate(dateStr: string): Date {
  // Beispiel: 20250513T081500
  if (!/^\d{8}T\d{6}$/.test(dateStr)) return new Date(NaN);

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(9, 11);
  const minute = dateStr.slice(11, 13);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
}

export function getDurationMinutes(start: string, end: string): number {
  const startDate = parseIcsDate(start);
  const endDate = parseIcsDate(end);
  return Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
}

export function formatDuration(start: string, end: string): string {
  const minutes = getDurationMinutes(start, end);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${remaining}min`;
}

export function estimateLessonUnits(durationMinutes: number): number {
  const possibleEH = Math.floor((durationMinutes + 15) / 45);
  return Math.min(possibleEH, Math.floor(durationMinutes / 45) + 1);
}