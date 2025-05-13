'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
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

  if (!email) {
    return (
      <div className={styles.notloggedin}>
        <h2>You are not logged in</h2>
        <p>
          <u><a href="/Welcome">Sign in</a></u> or <u><a href="/Welcome">register</a></u> to access your profile.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p><strong>Email:</strong> {email}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}