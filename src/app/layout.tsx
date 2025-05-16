import './globals.css';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Toast from '@/components/Toast/Toast'
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import Spinner from '../components/Spinner/Spinner';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import ParticleBackground from '@/components/ParticleBackground/ParticleBackground';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Lazy Student Dashboard',
  description: 'Dashboard for ECTS and attendance tracking',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabaseServerClient = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  return (
    <html lang="en">
      <body>
        <ParticleBackground />
        <SessionProviderWrapper initialSession={session}>
        <Toast />
          <div className="layout">
            <aside className="side-nav glassCard backdrop-blur-sm">
              <SideNav />
            </aside>
            <main className="main-content border-none px-0 md:px-[var(--glass-padding)] py-[var(--glass-padding)] ml-[calc(var(--side-nav-width)+var(--side-nav-gap))]">
              <Header />
              <Suspense fallback={<Spinner />}>
                {children}
              </Suspense>
            </main>
            <footer className="bottom-nav glassCard">
              <BottomNav />
            </footer>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
