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
        window.location.href = '/dashboard';
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="btn">Login</button>
        </form>
        </div>
    );
    }