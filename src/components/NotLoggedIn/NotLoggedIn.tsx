'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './NotLoggedIn.module.css';

interface Props {
  context?: string;
}

export default function NotLoggedIn({ context = 'your profile' }: Props) {
  return (
    <div className={styles.notloggedin}>
      <div className={styles.logo}>
        <Image
          src="/images/logo/logo.svg"
          alt="Logo"
          width={150}
          height={150}
          priority={false}
        />
      </div>
      <h2>You are not logged in</h2>
      <p>
        <u><Link href="/Welcome">Sign in</Link></u> or <u><Link href="/Welcome">register</Link></u> to access {context}.
      </p>
    </div>
  );
}