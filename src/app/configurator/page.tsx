"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner/Spinner";
import CourseCard, { EditableCourse } from "@/components/CourseCard/CourseCard";
import styles from './ConfiguratorLayout.module.css';

export default function ConfiguratorPage() {
  const [icsUrl, setIcsUrl] = useState("");
  const [courses, setCourses] = useState<EditableCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Funktion zum Laden persistenter Kurse aus der DB
  const loadPersistentCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const persistentRes = await fetch("/api/courses");
      if (!persistentRes.ok)
        throw new Error("Error fetching persistent courses");
      const persistentData = await persistentRes.json();
      setCourses(persistentData.courses || []);
    } catch (err) {
      console.error(err);
      setError("Error loading persistent courses.");
    } finally {
      setLoading(false);
    }
  };

  // Funktion, um ICS-Daten zu holen, falls noch keine persistente Daten vorhanden sind
  const handleFetchICS = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`
      );
      if (!response.ok) throw new Error("Error fetching courses from ICS feed");
      const icsData = await response.json();
      const fetchedCourses = icsData.events;
      // Speichere jeden Kurs in der DB per POST an /api/courses
      for (const course of fetchedCourses) {
        const postRes = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(course),
        });
        if (!postRes.ok) {
          console.error("Error saving course:", course);
        }
      }
      await loadPersistentCourses();
    } catch (err) {
      console.error(err);
      setError("Error fetching courses from ICS feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Beim Mounten der Seite werden persistent gespeicherte Kurse geladen
  useEffect(() => {
    loadPersistentCourses();
  }, []);

  const handleChange = (
    index: number,
    field: keyof EditableCourse,
    value: string
  ) => {
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
  };

  const handleAdd = () => {
    const newCourse: EditableCourse = {
      // courseId bleibt leer, damit der Nutzer ihn füllen kann
      courseId: "",
      summary: "",
      lessonUnits: 0,
      ects: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleDelete = async (index: number) => {
    const courseToDelete = courses[index];
    try {
      if (courseToDelete && courseToDelete.id) {
        const res = await fetch(`/api/courses/${courseToDelete.id}`, {
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
  };

  const handleSaveAll = async () => {
    try {
      for (const course of courses) {
        if (course.id) {
          const res = await fetch(`/api/courses/${course.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(course),
          });
          if (!res.ok) {
            throw new Error(`Error updating course with id ${course.id}`);
          }
        } else {
          if (!course.courseId || course.courseId.trim() === "") {
            setError("Course ID must not be empty for new courses.");
            return;
          }
          const res = await fetch("/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(course),
          });
          if (!res.ok) {
            throw new Error("Error creating course");
          }
          const data = await res.json();

          setCourses((prev) =>
            prev.map((c) => (c === course ? data.course : c))
          );
        }
      }
      alert("Courses saved to database");
    } catch (err) {
      console.error(err);
      setError("Error saving courses");
    }
  };

  // Reduziere das Array, sodass nur der erste Kurs für jede Course ID gespeichert wird.
  const uniqueCourses = Object.values(
    courses.reduce((acc, course) => {
      // Verwende courseId als Schlüssel – falls courseId nicht vorhanden ist, nutze summary.
      const key = course.courseId || course.summary;
      if (!acc[key]) {
        acc[key] = course;
      }
      return acc;
    }, {} as Record<string, EditableCourse>)
  );

  return (
    <div className={styles.wrapper}>
    {/* URL Input und ICS Fetch Button */}
    <div className={styles['form-row']}>
      <label htmlFor="icsUrl">ICS URL:</label>
      <input
        type="text"
        id="icsUrl"
        value={icsUrl}
        onChange={(e) => setIcsUrl(e.target.value)}
        placeholder="Enter your ICS URL here..."
      />
      <button onClick={handleFetchICS}>Fetch Courses (from ICS)</button>
    </div>

    {loading && <Spinner />}
    {error && <p className="error">{error}</p>}

    {uniqueCourses.length > 0 && (
      <>
        <div className={styles['courses-container']}>
          {uniqueCourses.map((course, index) => (
            <div key={course.id || index} className={styles['course-card']}>
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
                  type="text"
                  value={course.ects}
                  onChange={(e) => handleChange(index, 'ects', e.target.value)}
                />
              </div>

              <div className={`${styles['form-group']} ${styles['lesson-units']}`}>
                <label>Lesson Units:</label>
                <input
                  type="text"
                  value={course.lessonUnits}
                  onChange={(e) => handleChange(index, 'lessonUnits', e.target.value)}
                />
              </div>

              <button
                className={styles['delete-button']}
                onClick={() => handleDelete(index)}
              >
                Delete Course
              </button>
            </div>
          ))}
        </div>
        <div className={styles['actions-row']}>
          <button onClick={handleAdd}>Add Course</button>
          <button onClick={handleSaveAll}>Save Changes</button>
        </div>
      </>
    )}
  </div>
  );
}
