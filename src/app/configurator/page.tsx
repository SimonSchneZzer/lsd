'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Spinner from "@/components/Spinner/Spinner";
import CourseCard, { EditableCourse } from "@/components/CourseCard/CourseCard";
import styles from './ConfiguratorLayout.module.css';

export default function ConfiguratorPage() {
  const [icsUrl, setIcsUrl] = useState("");
  const [courses, setCourses] = useState<EditableCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load persistent courses from the DB
  const loadPersistentCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) {
        throw new Error("Error fetching persistent courses");
      }
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
      setError("Error loading persistent courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch courses from ICS if no persistent data
  const handleFetchICS = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`
      );
      if (!response.ok) {
        throw new Error("Error fetching courses from ICS feed");
      }
      const icsData = await response.json();
      setCourses(icsData.events);
    } catch (err) {
      console.error(err);
      setError("Error fetching courses from ICS feed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [icsUrl]);

  // On mount, load persistent courses
  useEffect(() => {
    loadPersistentCourses();
  }, [loadPersistentCourses]);

  const handleChange = useCallback(
    (index: number, field: keyof EditableCourse, value: string) => {
      setCourses((prev) => {
        const newCourses = [...prev];
        if (field === "lessonUnits" || field === "ects") {
          const parsed = Number(value);
          if (isNaN(parsed)) return prev;
          newCourses[index] = { ...newCourses[index], [field]: parsed };
        } else {
          newCourses[index] = { ...newCourses[index], [field]: value };
        }
        return newCourses;
      });
    },
    []
  );

  const handleAdd = useCallback(() => {
    const newCourse: EditableCourse = {
      courseId: "",
      summary: "",
      lessonUnits: 0,
      ects: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
  }, []);

  const handleDelete = useCallback(
    async (index: number) => {
      const courseToDelete = courses[index];
      try {
        if (courseToDelete && (courseToDelete as any).id) {
          const res = await fetch(`/api/courses/${(courseToDelete as any).id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Error deleting course");
          }
        }
        setCourses((prev) => prev.filter((_, i) => i !== index));
      } catch (err) {
        console.error(err);
        setError("Error deleting course");
      }
    },
    [courses]
  );

  const handleSaveAll = useCallback(async () => {
    try {
      const res = await fetch("/api/attendance/importAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses }),
      });
      if (!res.ok) {
        throw new Error("Error syncing attendance data");
      }
      // TODO: replace alert with toast for better UX
      alert("Courses and attendance saved successfully");
    } catch (err) {
      console.error(err);
      setError("Error saving courses or syncing attendance");
    }
  }, [courses]);

  // Only keep first course per courseId or summary
  const uniqueCourses = useMemo(() => {
    return Object.values(
      courses.reduce<Record<string, EditableCourse>>((acc, course) => {
        const key = course.courseId || course.summary;
        if (!acc[key]) acc[key] = course;
        return acc;
      }, {})
    );
  }, [courses]);

  return (
    <div className={styles.wrapper}>
      <div className={styles['form-row']}>
        <label htmlFor="icsUrl">ICS URL:</label>
        <input
          type="text"
          id="icsUrl"
          value={icsUrl}
          onChange={(e) => setIcsUrl(e.target.value)}
          placeholder="Enter your ICS URL here..."
        />
        <button onClick={handleFetchICS} disabled={loading}>
          Fetch Courses (from ICS)
        </button>
      </div>

      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}

      {uniqueCourses.length > 0 && (
        <>
          <div className={styles['courses-container']}>
            {uniqueCourses.map((course, index) => (
              <div key={(course as any).id || index} className={styles['course-card']}>
                <div className={`${styles['form-group']} ${styles['summary']}`}>
                  <label>Summary:</label>
                  <input
                    type="text"
                    value={course.summary}
                    onChange={(e) => handleChange(index, 'summary', e.target.value)}
                  />
                </div>

                <div className={`${styles['form-group']} ${styles['course-id']}`}>
                  <label>Course ID:</label>
                  <input
                    type="text"
                    value={course.courseId}
                    onChange={(e) => handleChange(index, 'courseId', e.target.value)}
                  />
                </div>

                <div className={`${styles['form-group']} ${styles['ects']}`}>
                  <label>ECTS:</label>
                  <input
                    type="number"
                    value={course.ects}
                    onChange={(e) => handleChange(index, 'ects', e.target.value)}
                  />
                </div>

                <div className={`${styles['form-group']} ${styles['lesson-units']}`}>
                  <label>Lesson Units:</label>
                  <input
                    type="number"
                    value={course.lessonUnits}
                    onChange={(e) => handleChange(index, 'lessonUnits', e.target.value)}
                  />
                </div>

                <button
                  className={styles['delete-button']}
                  onClick={() => handleDelete(index)}
                  disabled={loading}
                >
                  Delete Course
                </button>
              </div>
            ))}
          </div>
        <div className={styles['actions-row']}>
            <button onClick={handleAdd} className="button-with-icon">
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
              d="M6 12H18M12 6V18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              />
            </svg>
            Add Course
            </button>
          <button onClick={handleSaveAll} className="button-with-icon"><svg
          fill="currentColor"
          width="24px"
          height="24px"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fillRule="evenodd">
            <path d="M65.456 48.385c10.02 0 96.169-.355 96.169-.355 2.209-.009 5.593.749 7.563 1.693 0 0-1.283-1.379.517.485 1.613 1.67 35.572 36.71 36.236 37.416.665.707.241.332.241.332.924 2.007 1.539 5.48 1.539 7.691v95.612c0 7.083-8.478 16.618-16.575 16.618-8.098 0-118.535-.331-126.622-.331-8.087 0-16-6.27-16.356-16.1-.356-9.832.356-118.263.356-126.8 0-8.536 6.912-16.261 16.932-16.261zm-1.838 17.853l.15 121c.003 2.198 1.8 4.003 4.012 4.015l120.562.638a3.971 3.971 0 0 0 4-3.981l-.143-90.364c-.001-1.098-.649-2.616-1.445-3.388L161.52 65.841c-.801-.776-1.443-.503-1.443.601v35.142c0 3.339-4.635 9.14-8.833 9.14H90.846c-4.6 0-9.56-4.714-9.56-9.14s-.014-35.14-.014-35.14c0-1.104-.892-2.01-1.992-2.023l-13.674-.155a1.968 1.968 0 0 0-1.988 1.972zm32.542.44v27.805c0 1.1.896 2.001 2 2.001h44.701c1.113 0 2-.896 2-2.001V66.679a2.004 2.004 0 0 0-2-2.002h-44.7c-1.114 0-2 .896-2 2.002z" />
            <path d="M127.802 119.893c16.176.255 31.833 14.428 31.833 31.728s-14.615 31.782-31.016 31.524c-16.401-.259-32.728-14.764-32.728-31.544s15.735-31.963 31.91-31.708zm-16.158 31.31c0 9.676 7.685 16.882 16.218 16.843 8.534-.039 15.769-7.128 15.812-16.69.043-9.563-7.708-16.351-15.985-16.351-8.276 0-16.045 6.52-16.045 16.197z" />
          </g>
        </svg>Save Changes</button>
        
        </div>
      </>
    )}
  </div>
  );
}