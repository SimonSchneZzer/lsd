"use client";

import React from "react";

export interface EditableCourse {
  courseId: string;
  summary: string;
  lessonUnits: number;
  ects: number;
}

interface CourseCardProps {
  course: EditableCourse;
  index: number;
  onChange: (index: number, field: keyof EditableCourse, value: string) => void;
  onDelete: (index: number) => void;
  disabled?: boolean;
}

export default function CourseCard({
  course,
  index,
  onChange,
  onDelete,
  disabled = false,
}: CourseCardProps) {
  return (
    <div className="grid grid-cols-1 p-2 md:p-8 md:grid-rows-2 gap-4 mb-6 border-b border-black dark:border-white">
      {/* Course ID */}
      <div className="flex flex-col col-start-1 row-start-1">
        <label className="mb-1 text-black dark:text-white">Course ID:</label>
        <input
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={course.courseId}
          onChange={(e) => onChange(index, "courseId", e.target.value)}
        />
      </div>

       {/* ECTS */}
      <div className="flex flex-col col-start-1 row-start-3 md:row-start-1 md:col-start-2">
        <label className="mb-1 text-black dark:text-white">ECTS:</label>
        <input
          type="number"
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={course.ects}
          onChange={(e) => onChange(index, "ects", e.target.value)}
        />
      </div>

      {/* Summary */}
      <div className="flex flex-col col-start-1 md:col-start-1 row-start-2 md:row-start-2">
        <label className="mb-1 text-black dark:text-white">
          Lehrveranstaltung:
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={course.summary}
          onChange={(e) => onChange(index, "summary", e.target.value)}
        />
      </div>

     

      {/* Lesson Units */}
      <div className="flex flex-col col-start-1 md:col-start-2 row-start-4 md:row-start-2">
        <label className="mb-1 text-black dark:text-white">Lesson Units:</label>
        <input
          type="number"
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={course.lessonUnits}
          onChange={(e) => onChange(index, "lessonUnits", e.target.value)}
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(index)}
        disabled={disabled}
        className="col-span-1 md:col-span-2 self-start mt-4 px-4 py-2 border-2 border-[var(--glass-color)] bg-[var(--glass-bg)] text-[var(--glass-color)] rounded-[var(--glass-radius)] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[var(--glass-color)] hover:text-white hover:dark:text-black hover:border-[var(--glass-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete Course
      </button>
    </div>
  );
}
