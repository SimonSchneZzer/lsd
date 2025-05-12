"use client";

import React, { useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner/Spinner";
import CourseCard, { EditableCourse } from "@/components/CourseCard/CourseCard";
import styles from "./ConfiguratorLayout.module.css";

export default function ConfiguratorPage() {
  const [icsUrl, setIcsUrl] = useState("");
  const [rawCourses, setRawCourses] = useState<EditableCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchICS = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`);
      if (!response.ok) throw new Error("Error fetching courses from ICS feed");
      const icsData = await response.json();
      setRawCourses(icsData.events);
    } catch (err) {
      console.error(err);
      setError("Error fetching courses from ICS feed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [icsUrl]);

  const handleChange = useCallback(
    (index: number, field: keyof EditableCourse, value: string) => {
      setRawCourses((prev) => {
        const updated = [...prev];
        if (field === "lessonUnits" || field === "ects") {
          const parsed = Number(value);
          if (isNaN(parsed)) return prev;
          updated[index] = { ...updated[index], [field]: parsed };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
        return updated;
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
    setRawCourses((prev) => [...prev, newCourse]);
  }, []);

  const handleDelete = useCallback((index: number) => {
    setRawCourses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveAll = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("You must be logged in to save.");
        return;
      }

      const grouped = aggregatedCourses;

      const attendanceEntries = grouped
        .filter((course) => course.courseId && course.courseId.trim() !== "")
        .map((course) => ({
          userId: session.user.id,
          courseId: course.courseId,
          summary: course.summary,
          totalLessonUnits: course.lessonUnits,
          missedLessonUnits: 0,
        }));

      console.log("Prepared attendance entries:", attendanceEntries);

      const { error } = await supabase
        .from("Attendance")
        .insert(attendanceEntries);

      if (error) throw error;

      alert("Courses and attendance saved successfully.");
    } catch (err) {
      console.error("Insert error:", err);
      if (err instanceof Error) {
        setError(err.message || "Unknown error while saving attendance");
      } else {
        setError("Unknown error while saving attendance");
      }
    } finally {
      setLoading(false);
    }
  }, [rawCourses]);

  const aggregatedCourses = useMemo(() => {
    const map = new Map<string, EditableCourse>();

    for (const course of rawCourses) {
      const key = course.courseId || course.summary;
      if (!map.has(key)) {
        map.set(key, { ...course });
      } else {
        const existing = map.get(key)!;
        existing.lessonUnits += course.lessonUnits;
      }
    }

    return Array.from(map.values());
  }, [rawCourses]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["form-row"]}>
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

      {aggregatedCourses.length > 0 && (
        <>
          <div className={styles["courses-container"]}>
            {aggregatedCourses.map((course, index) => (
              <div key={index} className={styles["course-card"]}>
                <div className={`${styles["form-group"]} ${styles["summary"]}`}>
                  <label>Summary:</label>
                  <input
                    type="text"
                    value={course.summary || ""}
                    onChange={(e) =>
                      handleChange(index, "summary", e.target.value)
                    }
                  />
                </div>

                <div className={`${styles["form-group"]} ${styles["course-id"]}`}>
                  <label>Course ID:</label>
                  <input
                    type="text"
                    value={course.courseId || ""}
                    onChange={(e) =>
                      handleChange(index, "courseId", e.target.value)
                    }
                  />
                </div>

                <div className={`${styles["form-group"]} ${styles["ects"]}`}>
                  <label>ECTS:</label>
                  <input
                    type="number"
                    value={course.ects || 0}
                    onChange={(e) =>
                      handleChange(index, "ects", e.target.value)
                    }
                  />
                </div>

                <div className={`${styles["form-group"]} ${styles["lesson-units"]}`}>
                  <label>Lesson Units:</label>
                  <input
                    type="number"
                    value={course.lessonUnits || 0}
                    onChange={(e) =>
                      handleChange(index, "lessonUnits", e.target.value)
                    }
                  />
                </div>

                <button
                  className={styles["delete-button"]}
                  onClick={() => handleDelete(index)}
                  disabled={loading}
                >
                  Delete Course
                </button>
              </div>
            ))}
          </div>

          <div className={styles["actions-row"]}>
            <button onClick={handleAdd} className="button-with-icon">
              ➕ Add Course
            </button>
            <button onClick={handleSaveAll} className="button-with-icon">
              💾 Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}