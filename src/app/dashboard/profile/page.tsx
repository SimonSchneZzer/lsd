"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import NotLoggedIn from "@/components/NotLoggedIn/NotLoggedIn";
import Spinner from "@/components/Spinner/Spinner";
import { useToastStore } from "@/store/toastStore"; // 👈 import toast

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setMessage } = useToastStore(); // 👈 toast setter

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setMessage("Fehler beim Laden der Session: " + error.message);
        setLoading(false);
        return;
      }

      if (!session) {
        setEmail(null);
        setLoading(false);
        return;
      }

      setEmail(session.user.email ?? null);
      setLoading(false);
    };

    getSession();
  }, [setMessage]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage("Abmelden fehlgeschlagen: " + error.message);
    } else {
      setMessage("Erfolgreich abgemeldet.");
      router.push("/Welcome");
    }
  };

  if (loading) return <Spinner />;
  if (!email) return <NotLoggedIn context="your profile" />;

  return (
    <div>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <button
        className="w-full flex items-center justify-center
          px-4 py-2
          border-2 border-[var(--glass-color)]
          bg-[var(--glass-bg)]
          text-[var(--glass-color)]
          rounded-[var(--glass-radius)]
          cursor-pointer
          transition-colors duration-300 ease-in-out
          hover:bg-[var(--glass-color)]
          hover:text-white
          hover:border-[var(--glass-bg)]
          dark:hover:text-black
          disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
}