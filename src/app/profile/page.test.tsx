import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfilePage from './page';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabaseClient';

describe('<ProfilePage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading', async () => {
    // Simuliert, dass die Sitzung noch nicht geladen ist (session: null).
    (supabase.auth.getSession as any).mockResolvedValueOnce({
      data: { session: null },
    });

    // Rendert die ProfilePage-Komponente.
    render(<ProfilePage />);

    // Überprüft, ob ein Spinner (Ladesymbol) angezeigt wird, während die Sitzung geladen wird.
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wartet darauf, dass die Nachricht "not logged in" angezeigt wird, nachdem die Sitzung geladen wurde.
    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });
  });

  it('shows "not logged in" message when session is null', async () => {
    // Simuliert, dass keine Sitzung vorhanden ist (session: null).
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    render(<ProfilePage />);

    // Wartet darauf, dass die Nachricht "you are not logged in" angezeigt wird.
    await waitFor(() => {
      expect(screen.getByText(/you are not logged in/i)).toBeInTheDocument();
    });
  });

  it('shows email when user is logged in', async () => {
    // Simuliert, dass ein Benutzer eingeloggt ist und eine E-Mail-Adresse hat.
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { email: 'test@example.com' } } },
    });

    render(<ProfilePage />);

    // Wartet darauf, dass die E-Mail-Adresse des Benutzers angezeigt wird.
    await waitFor(() => {
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });
  });

  it('calls signOut and redirects on sign out click', async () => {
    // Simuliert, dass ein Benutzer eingeloggt ist.
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { email: 'test@example.com' } } },
    });

    // Simuliert, dass die Abmeldung erfolgreich ist.
    (supabase.auth.signOut as any).mockResolvedValue({});

    render(<ProfilePage />);

    // Wartet darauf, dass die E-Mail-Adresse des Benutzers angezeigt wird.
    await waitFor(() => {
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });

    // Sucht die Schaltfläche "Sign Out" und simuliert einen Klick darauf.
    const button = screen.getByRole('button', { name: /sign out/i });
    await userEvent.click(button);

    // Überprüft, ob die Abmeldefunktion aufgerufen wurde.
    expect(supabase.auth.signOut).toHaveBeenCalled();

    // Überprüft, ob der Benutzer nach der Abmeldung zur "/Welcome"-Seite weitergeleitet wurde.
    expect(mockPush).toHaveBeenCalledWith('/Welcome');
  });
});