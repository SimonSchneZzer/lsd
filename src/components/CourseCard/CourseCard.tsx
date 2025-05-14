"use client";

import React from "react";
import styles from "./CourseCard.module.css";

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
  if (index === 0) {
    throw new Error("Test Error");
  }
  return (
    <div className={styles["course-card"]}>
      <div className={`${styles["form-group"]} ${styles.summary}`}>  
        <label>Summary:</label>
        <input
          value={course.summary}
          onChange={e => onChange(index, "summary", e.target.value)}
        />
      </div>
      <div className={`${styles["form-group"]} ${styles["course-id"]}`}>  
        <label>Course ID:</label>
        <input
          value={course.courseId}
          onChange={e => onChange(index, "courseId", e.target.value)}
        />
      </div>
      <div className={`${styles["form-group"]} ${styles.ects}`}>  
        <label>ECTS:</label>
        <input
          type="number"
          value={course.ects}
          onChange={e => onChange(index, "ects", e.target.value)}
        />
      </div>
      <div className={`${styles["form-group"]} ${styles["lesson-units"]}`}>  
        <label>Lesson Units:</label>
        <input
          type="number"
          value={course.lessonUnits}
          onChange={e => onChange(index, "lessonUnits", e.target.value)}
        />
      </div>
      <button
        className={styles["delete-button"]}
        onClick={() => onDelete(index)}
        disabled={disabled}
      >
        Delete Course
      </button>
    </div>
  );
}