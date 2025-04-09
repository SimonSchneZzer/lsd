"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner/Spinner";

type EditableCourse = {
  id?: string; // Wird von der Datenbank (Prisma) gesetzt
  courseId: string;
  summary: string;
  lessonUnits: number;
  ects: number;
};

export default function ConfiguratorPage() {
  const [icsUrl, setIcsUrl] = useState("");
  const [courses, setCourses] = useState<EditableCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Diese Funktion lädt ausschließlich persistente Kurse aus der DB
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

  // Diese Funktion wird manuell angestoßen, wenn noch keine Kurse in der DB vorhanden sind
  // oder der Benutzer einen ICS-Import durchführen will
  const handleFetchICS = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`
      );
      if (!response.ok)
        throw new Error("Error fetching courses from ICS feed");
      const icsData = await response.json();

      // Nutze icsData.events als Grundlage
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
      // Nach dem Speichern erneut die persistierten Kurse laden
      await loadPersistentCourses();
    } catch (err) {
      console.error(err);
      setError("Error fetching courses from ICS feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Beim Mounten der Seite werden automatisch persistente Kurse geladen
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

  const handleAdd = async () => {
    try {
      const newCourseData = {
        courseId: "",
        summary: "",
        lessonUnits: 0,
        ects: 0,
      };
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourseData),
      });
      if (!res.ok) throw new Error("Error creating course");
      const data = await res.json();
      setCourses((prev) => [...prev, data.course]);
    } catch (err) {
      console.error(err);
      setError("Error adding course");
    }
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
        }
      }
      alert("Courses saved to database");
    } catch (err) {
      console.error(err);
      setError("Error saving courses");
    }
  };

  return (
    <div className="configurator-container">
      <h1>Calendar Configurator</h1>
      <div className="url-input-container">
        <label htmlFor="icsUrl">ICS URL:</label>
        <input
          type="text"
          id="icsUrl"
          value={icsUrl}
          onChange={(e) => setIcsUrl(e.target.value)}
          placeholder="Enter your ICS URL here..."
        />
        {/* Button zum manuellen ICS-Import */}
        <button onClick={handleFetchICS}>Fetch Courses (from ICS)</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}

      {courses.length > 0 && (
        <>
          <div className="courses-container">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <div className="course-field">
                  <label>Summary:</label>
                  <input
                    type="text"
                    value={course.summary || ""}
                    onChange={(e) =>
                      handleChange(index, "summary", e.target.value)
                    }
                  />
                </div>
                <div className="course-field">
                  <label>Course ID:</label>
                  <input
                    type="text"
                    value={course.courseId || ""}
                    onChange={(e) =>
                      handleChange(index, "courseId", e.target.value)
                    }
                  />
                </div>
                <div className="course-field">
                  <label>Lesson Units:</label>
                  <input
                    type="number"
                    value={course.lessonUnits || ""}
                    onChange={(e) =>
                      handleChange(index, "lessonUnits", e.target.value)
                    }
                  />
                </div>
                <div className="course-field">
                  <label>ECTS:</label>
                  <input
                    type="number"
                    value={course.ects || ""}
                    onChange={(e) =>
                      handleChange(index, "ects", e.target.value)
                    }
                  />
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(index)}
                >
                  Delete Course
                </button>
              </div>
            ))}
          </div>
          <div className="save-changes-container">
            <button onClick={handleSaveAll}>Save Changes</button>
          </div>
        </>
      )}

      {courses.length > 0 && (
        <div className="add-course-container">
          <button onClick={handleAdd}>Add Course</button>
        </div>
      )}
    </div>
  );
}