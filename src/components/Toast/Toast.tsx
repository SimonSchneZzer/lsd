'use client';

import { useEffect, useState } from 'react';
import { useToastStore } from '@/store/toastStore';

export default function Toast() {
  const { message, clearMessage } = useToastStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const fadeOutTimer = setTimeout(() => setVisible(false), 2500);
      const clearTimer = setTimeout(() => clearMessage(), 3000);
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message, clearMessage]);

  if (!message) return null;

return (
  <div
    className={`fixed top-10 left-1/2 -translate-x-1/2 z-100
                px-4 py-2
                border-2 border-[var(--glass-color)]
                bg-[var(--glass-bg)]
                text-[var(--glass-color)]
                rounded-[var(--glass-radius)]
                shadow-lg
                backdrop-blur-md
                transition-opacity duration-500 ease-in-out
                text-center
                ${visible ? 'opacity-100' : 'opacity-0'}`}
  >
    {message}
  </div>
);
}