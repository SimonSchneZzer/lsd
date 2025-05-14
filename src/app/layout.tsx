import './globals.css';
import type { Metadata } from 'next';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
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
          <div className="layout">
            <aside className="side-nav glassCard">
              <SideNav />
            </aside>
            <main className="main-content glassCard">
              <Header />
              {children}
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