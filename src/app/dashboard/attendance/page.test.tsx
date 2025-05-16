import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AttendancePage from './page';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      eq: vi.fn(),
      update: vi.fn(),
    })),
  },
}));

describe('<AttendancePage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading', async () => {
    // Simuliert, dass der Benutzer eingeloggt ist und eine gültige Sitzung hat.
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    // Simuliert, dass keine Anwesenheitsdaten aus der Datenbank zurückgegeben werden.
    (supabase.from as any).mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    render(<AttendancePage />);

    // Überprüft, ob ein Spinner (Ladesymbol) angezeigt wird, während die Daten geladen werden.
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wartet darauf, dass die Nachricht "keine anwesenheitsdaten" angezeigt wird, wenn keine Daten vorhanden sind.
    await waitFor(() => {
      expect(screen.getByText(/no courses found/i)).toBeInTheDocument();
    });
  });

  it('renders attendance data', async () => {
    // Simuliert, dass der Benutzer eingeloggt ist und eine gültige Sitzung hat.
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    // Simuliert, dass Anwesenheitsdaten aus der Datenbank zurückgegeben werden.
    (supabase.from as any).mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve({
          data: [
            {
              id: 'abc',
              courseId: 'MT101',
              summary: 'Medientechnik',
              totalLessonUnits: 10,
              missedLessonUnits: 2,
              progress: 0.2,
            },
          ],
          error: null,
        }),
      }),
    });

    render(<AttendancePage />);

    // Wartet darauf, dass die Anwesenheitsdaten (z. B. der Kursname "Medientechnik") angezeigt werden.
    await waitFor(() => {
      expect(screen.getByText('Medientechnik')).toBeInTheDocument();
    });
  });
});