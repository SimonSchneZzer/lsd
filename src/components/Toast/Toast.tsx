'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/store/toastStore';

export default function Toast() {
  const { message, clearMessage } = useToastStore();

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        clearMessage();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, clearMessage]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
      {message}
    </div>
  );
}