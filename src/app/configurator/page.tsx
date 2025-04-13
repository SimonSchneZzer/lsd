'use client';

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
      if (!persistentRes.ok) {
        throw new Error("Error fetching persistent courses");
      }
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
      if (!response.ok) {
        throw new Error("Error fetching courses from ICS feed");
      }
      const icsData = await response.json();
      const fetchedCourses = icsData.events;
     
      setCourses(fetchedCourses);

    } catch (err) {
      console.error(err);
      setError("Error fetching courses from ICS feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Beim Mounten der Seite werden persistente Kurse geladen
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
      // Sende alle Kurse gesammelt an den Batch-Import-Endpunkt
      const attendanceRes = await fetch("/api/attendance/importAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses }),
      });
      if (!attendanceRes.ok) {
        throw new Error("Error syncing attendance data");
      }
      alert("Courses and attendance saved successfully");
    } catch (err) {
      console.error(err);
      setError("Error saving courses or syncing attendance");
    }
  };

  // Reduziere das Array, sodass nur der erste Kurs für jede Course ID gespeichert wird.
  const uniqueCourses = Object.values(
    courses.reduce((acc, course) => {
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