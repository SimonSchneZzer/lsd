'use client';

import React from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  summary: string;
  missed: number;
  totalLessonUnits: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function ProgressBar({
  summary,
  missed,
  totalLessonUnits,
  onIncrement,
  onDecrement,
}: ProgressBarProps) {
  const percentage = totalLessonUnits > 0 ? Math.min(100, (missed / totalLessonUnits) * 100) : 0;
  return (
    <div className={styles['course-block']}>
      <h2>
        <b>{summary.replace(/^.*? - /, '')}</b>
      </h2>
      <div className={styles['progress-bar']}>
        <div className={styles['progress-fill']} style={{ width: `${percentage}%` }} />
      </div>
      <div className={styles['control-bar']}>
        <div className={styles['control-row']}>
          <button onClick={onDecrement} className={styles['control-button']}>−</button>
          <span>
            {missed} EH missed of {totalLessonUnits} EH
          </span>
          <button onClick={onIncrement} className={styles['control-button']}>+</button>
        </div>
      </div>
    </div>
  );
}