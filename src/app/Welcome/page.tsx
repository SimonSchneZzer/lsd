'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { z } from 'zod';

// Validation-Schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  password: z.string().min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein' }),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwörter stimmen nicht überein.',
});

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');

    const inputData = { email, password, confirmPassword };
    const result = mode === 'register'
      ? registerSchema.safeParse(inputData)
      : loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      setError(firstError || 'Ungültige Eingabe');
      return;
    }

    setLoading(true);
    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      error ? setError(error.message) : setMessage('Registrierung erfolgreich! Willkommen!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      error ? setError(error.message) : router.push('/');
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError(''); setMessage(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Dein Logo */}
      <div className="mb-6">
        <Image
          src="/images/logo/logo.svg"
          alt="Dein Logo"
          width={128}
          height={128}
          className="h-32 w-auto rounded-full"
        />
      </div>

      {/* Überschrift */}
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
        {mode === 'login' ? 'Einloggen' : 'Registrieren'}
      </h2>

      {/* Toggle Login/Register */}
      <div className="flex items-center justify-center mb-6 space-x-3">
        <span className="text-sm font-medium text-gray-700">Login</span>
        <label htmlFor="authModeToggle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="authModeToggle"
            className="sr-only peer"
            checked={mode === 'register'}
            onChange={toggleMode}
            disabled={loading}
          />
          <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-600 rounded-full peer-checked:bg-indigo-600 transition-colors" />
          <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform" />
        </label>
        <span className="text-sm font-medium text-gray-700">Register</span>
      </div>

      {/* Form */}
      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          />
        </div>

        {/* Passwort */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={loading}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          />
        </div>

        {/* Passwort bestätigen */}
        {mode === 'register' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 disabled:opacity-50"
        >
          {loading
            ? mode === 'login' ? 'Einloggen…' : 'Registrieren…'
            : mode === 'login' ? 'Einloggen' : 'Registrieren'}
        </button>
      </form>
    </div>
  );
}