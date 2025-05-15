'use client';

import React from 'react';

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
  const attended = totalLessonUnits - missed;
  const attendancePercentage =
    totalLessonUnits > 0
      ? Math.min(100, (attended / totalLessonUnits) * 100)
      : 0;

  return (
    <div className="pb-[var(--glass-padding)]">
      <h2 className="text-lg font-semibold mb-2">
        <strong>{summary.replace(/^.*? - /, '')}</strong>
      </h2>

      {/* Progress Bar */}
      <div className="relative h-[var(--glass-margin-bottom)] bg-[var(--glass-color)] rounded-[var(--glass-radius)] overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#F18F01] transition-all duration-300 ease-in-out"
          style={{ width: `${attendancePercentage}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <button
        onClick={onIncrement}
        className="
          px-3 py-1 text-base
          bg-[rgba(255,255,255,0.4)] text-black
          rounded-[0.5em] border border-black
          cursor-pointer
          transition-colors duration-200 ease-in-out
          hover:bg-black
          hover:text-white
          hover:dark:bg-white
          hover:dark:text-black
        "
          >
        -
          </button>

          <span className="font-medium">{attendancePercentage.toFixed(0)}%</span>

          <button
        onClick={onDecrement}
        className="
          px-3 py-1 text-base
          bg-[rgba(255,255,255,0.4)] text-black
          rounded-[0.5em] border border-black
          cursor-pointer
          transition-colors duration-200 ease-in-out
          hover:bg-black
          hover:text-white
          hover:dark:bg-white
          hover:dark:text-black
        "
          >
        +
          </button>

          <span className="text-gray-700 dark:text-gray-300">
        {attended}/{totalLessonUnits} Attended
          </span>
        </div>
      </div>
    </div>
  );
}