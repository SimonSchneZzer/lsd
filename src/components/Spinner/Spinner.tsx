'use client';

import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles.spinnerWrapper} role="status">
      <div className={styles.loader} />
    </div>
  );
}