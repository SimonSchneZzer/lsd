'use client';

import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SupabaseProviderWrapperProps {
  children: React.ReactNode;
  initialSession?: any;
}

export default function SessionProviderWrapper({
  children,
  initialSession,
}: SupabaseProviderWrapperProps) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}