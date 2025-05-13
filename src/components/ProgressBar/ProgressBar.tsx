'use client';

import React from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  summary: string;
  missed: number;
  totalLessonUnits: number;
  onIncrement: () => void; // increase attendance (decrease missed)
  onDecrement: () => void; // decrease attendance (increase missed)
};

export default function ProgressBar({
  summary,
  missed,
  totalLessonUnits,
  onIncrement,
  onDecrement,
}: ProgressBarProps) {
  const attended = totalLessonUnits - missed;
  const attendancePercentage =
    totalLessonUnits > 0
      ? Math.min(100, (attended / totalLessonUnits) * 100)
      : 0;

  return (
    <div className={styles['course-block']}>
      <h2>
        <strong>{summary.replace(/^.*? - /, '')}</strong>
      </h2>
      <div className={styles['progress-bar']}>
        <div
          className={styles['progress-fill']}
          style={{ width: `${attendancePercentage}%` }}
        />
      </div>
      <div className={styles['control-bar']}>
        <div className={styles['control-row']}>
          <button onClick={onIncrement} className={styles['control-button']}>
            -
          </button>
          <span className={styles['percentage']}>
            {attendancePercentage.toFixed(0)}%
          </span>
          <button onClick={onDecrement} className={styles['control-button']}>
            +
          </button>
          <span>
            {attended}/{totalLessonUnits} Attended
          </span>
        </div>
      </div>
    </div>
  );
}
