"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner/Spinner";
import CourseCard, { EditableCourse } from "@/components/CourseCard/CourseCard";

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
    <>
        {/* URL Input und Fetch Button */}
        <label htmlFor="icsUrl">ICS URL:</label>
        <input
          type="text"
          id="icsUrl"
          value={icsUrl}
          onChange={(e) => setIcsUrl(e.target.value)}
          placeholder="Enter your ICS URL here..."
        />
        <button onClick={handleFetchICS}>Fetch Courses (from ICS)</button>
  
      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}
  
      {courses.length > 0 && (
        <>
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                index={index}
                onChange={handleChange}
                onDelete={handleDelete}
              />
            ))}
              <button onClick={handleAdd}>Add Course</button>
              <button onClick={handleSaveAll}>Save Changes</button>
        </>
      )}
    </>
  );
}
