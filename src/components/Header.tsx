
'use client';

import { usePathname } from 'next/navigation';

const getTitleFromPath = (pathname: string): string => {
  if (pathname === '/') return 'Home';
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
};

export default function Header() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  return (
    <header className="page-header">
      <h1>{title}</h1>
    </header>
  );
}