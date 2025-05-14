'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';
import Spinner from '@/components/Spinner/Spinner';

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setEmail(null);
        setLoading(false);
        return;
      }

      setEmail(session.user.email ?? null);
      setLoading(false);
    };

    getSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/Welcome');
  };

  if (loading) return <Spinner />;

  if (!email) return <NotLoggedIn context="your profile" />;

  return (
    <div>
      <p><strong>Email:</strong> {email}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}