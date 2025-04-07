'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      window.location.href = '/';
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="">
      <h1 className="">Login</h1>
 
      <div className="">
        <span>or</span>
        <button
          onClick={handleGoogleSignIn}
          className=""
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}