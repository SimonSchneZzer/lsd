import './globals.css'
import '../styles/background.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attendance Dashboard',
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
        {children}
      </body>
    </html>
  )
}