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
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    render(<AttendancePage />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner is loading
    await waitFor(() => {
      expect(screen.getByText(/keine anwesenheitsdaten/i)).toBeInTheDocument();
    });
  });

  it('renders attendance data', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

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

    await waitFor(() => {
      expect(screen.getByText('Medientechnik')).toBeInTheDocument();
    });
  });
});