import './globals.css'
import '../styles/background.css'
import type { Metadata } from 'next'
import SideNav from '../components/SideNav'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'

export const metadata: Metadata = {
  title: 'Lazy Student Dashboard',
  description: 'Dashboard for ECTS and attendance tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <aside className="side-nav glassCard">
            <SideNav />
          </aside>

          <main className="main-content">
            <Header />
            {children}
          </main>

          <footer className="bottom-nav glassCard">
            <BottomNav />
          </footer>
        </div>
      </body>
    </html>
  )
}