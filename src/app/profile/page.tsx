'use client';

import { useSession, signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>
        <strong>Email:</strong> {session.user?.email || 'No email available'}
      </p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}