'use client';

import Link from 'next/link';
import { useSession } from '@supabase/auth-helpers-react';
import { usePathname } from 'next/navigation';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: '/dashboard/attendance',
    label: 'Attendance',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 13v4M12 7v10M16 10v7" />
      </svg>
    ),
  },
  {
    href: '/dashboard/ects',
    label: 'ECTS',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    href: '/dashboard/configurator',
    label: 'Course Settings',
    icon: (
      <svg width="24" height="24" fill="currentColor">
        <path d="M18.5 8.25a.75.75 0 0 0 .75-.75V2.7a.75.75 0 0 0-1.5 0v4.8a.75.75 0 0 0 .75.75z" />
        <path d="M12 15.75a.75.75 0 0 0-.75.75v4.65a.75.75 0 0 0 1.5 0v-4.65a.75.75 0 0 0-.75-.75z" />
        <path d="M5.5 8.25a.75.75 0 0 0 .75-.75V2.7a.75.75 0 0 0-1.5 0v4.8a.75.75 0 0 0 .75.75z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: (
      <svg width="24" height="24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    href: '/dashboard/tutorial',
    label: 'Tutorial',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16h.01M12 12.5c0-.3.2-.6.5-.7 1-.3 1.5-1 1.5-1.8 0-1.1-.9-2-2-2s-2 .9-2 2" />
      </svg>
    ),
  },
];

export default function Nav() {
  const session = useSession();
  const pathname = usePathname();
  const isLoggedIn = !!session;

  return (
    <nav
      className={`
        glassCard fixed z-50 flex
        bg-[var(--glass-bg)] text-[var(--glass-color)]
        md:flex-col md:left-0 md:top-0 md:h-screen md:w-20
        w-full bottom-0 h-16 justify-around items-center md:justify-start md:gap-6
      `}
    >
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href;
  
        const linkClasses = `
          flex flex-col items-center justify-center
          md:py-4 md:px-0 px-2 py-1
          transition-colors duration-200
          ${isActive ? 'text-white font-semibold' : 'text-[var(--glass-color)]'}
        `;
  
        return (
          <Link key={href} href={href}>
            <div className={linkClasses}>
              {icon}
              <span className="text-xs md:text-[10px] hidden md:block">{label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}