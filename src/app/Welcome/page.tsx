'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from './welcome.module.css';
import { z } from 'zod';
import { useToastStore } from '@/store/toastStore'; // 👈 global toast store

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
  const [loading, setLoading] = useState(false);
  const { setMessage } = useToastStore(); // 👈 use global toast
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputData = { email, password, confirmPassword };

    const result = mode === 'register'
      ? registerSchema.safeParse(inputData)
      : loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      setMessage(firstError || 'Ungültige Eingabe');
      return;
    }

    setLoading(true);
    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Registrierung erfolgreich! Willkommen!');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (error) {
        setMessage(error.message); // 👈 show in toast
      } else {
        setMessage('Erfolgreich eingeloggt!');
        router.push('/');
      }
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <div className={styles.toggleContainer}>
        <input
          type="checkbox"
          id="authModeToggle"
          className={styles.toggleInput}
          checked={mode === 'register'}
          onChange={toggleMode}
          disabled={loading}
        />
        <label htmlFor="authModeToggle" className={styles.switch} />
        <h2 style={{ marginBottom: '0.5rem' }}>
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <br />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        <br />

        {mode === 'register' && (
          <>
            <input
              type="password"
              placeholder="Passwort bestätigen"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <br />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? mode === 'login'
              ? 'Einloggen...'
              : 'Registrieren...'
            : mode === 'login'
            ? 'Einloggen'
            : 'Registrieren'}
        </button>
      </form>
    </div>
  );
}