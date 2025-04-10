'use client';

import React from "react";

export type EditableCourse = {
  id?: string;
  courseId: string;
  summary: string;
  lessonUnits: number;
  ects: number;
};

type CourseCardProps = {
  course: EditableCourse;
  index: number;
  onChange: (index: number, field: keyof EditableCourse, value: string) => void;
  onDelete: (index: number) => void;
};

export default function CourseCard({ course, index, onChange, onDelete }: CourseCardProps) {
  return (
    <div className="course-card">
      <div className="course-field">
        <label>Summary:</label>
        <input
          type="text"
          value={course.summary || ""}
          onChange={(e) => onChange(index, "summary", e.target.value)}
        />
      </div>
      <div className="course-field">
        <label>Course ID:</label>
        <input
          type="text"
          value={course.courseId || ""}
          onChange={(e) => onChange(index, "courseId", e.target.value)}
        />
      </div>
      <div className="course-field">
        <label>Lesson Units:</label>
        <input
          type="number"
          value={course.lessonUnits || ""}
          onChange={(e) => onChange(index, "lessonUnits", e.target.value)}
        />
      </div>
      <div className="course-field">
        <label>ECTS:</label>
        <input
          type="number"
          value={course.ects || ""}
          onChange={(e) => onChange(index, "ects", e.target.value)}
        />
      </div>
      
      <button className="delete-button" onClick={() => onDelete(index)}>
        Delete Course
      </button>
    </div>
  );
}