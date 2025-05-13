'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    fetchSession();
  }, []);

  return (
    <div>
      <main>
        <h2>
          Welcome to the <b>Lazy Student Dashboard!</b>
        </h2>
        <br />
        <p>
          The Lazy Student Dashboard <b>(LSD)</b> helps you monitor your attendance and effort so you only do as much work as absolutely necessary!
        </p>
        <br />
        {isLoggedIn === false && (
          <p>
            Please <u><a href="/Welcome">sign in</a></u> or <u><a href="/Welcome">register</a></u> to start making the most of doing the least.
          </p>
        )}
      </main>
    </div>
  );
}