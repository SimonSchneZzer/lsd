'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Props {
  context?: string;
}

export default function NotLoggedIn({ context = 'your profile' }: Props) {
  return (
    <div className="glassCard backdrop-blur-sm flex flex-col items-center justify-center px-4 py-12 mb-6 text-center">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/images/logo/logo.svg"
          alt="Logo"
          width={150}
          height={150}
          className="h-32 w-auto rounded-full"
        />
      </div>

      {/* Titel */}
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-4 dark:text-white">
        You are not logged in
      </h2>

      {/* Hinweis mit Links */}
      <p className="text-center text-gray-700 dark:text-white">
        <Link
          href="/Welcome"
          className="underline text-indigo-600 hover:text-indigo-500 font-medium text-inherit"
        >
          Sign in
        </Link>{' '}
        or{' '}
        <Link
          href="/Welcome"
          className="underline text-indigo-600 hover:text-indigo-500 font-medium text-inherit"
        >
          register
        </Link>{' '}
        to access {context}.
      </p>
    </div>
  );
}