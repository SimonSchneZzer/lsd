"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner/Spinner";
import { EditableCourse } from "@/components/CourseCard/CourseCard";
import styles from "./ConfiguratorLayout.module.css";

export default function ConfiguratorPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [icsUrl, setIcsUrl] = useState<string>("");
  const [rawCourses, setRawCourses] = useState<EditableCourse[]>([]);
  const [deletedCourseIds, setDeletedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Helper to aggregate courses by courseId or summary
  const aggregateCourses = useCallback((courses: EditableCourse[]) => {
    const map = new Map<string, EditableCourse>();
    courses.forEach(course => {
      const key = course.courseId || course.summary;
      if (!map.has(key)) {
        map.set(key, { ...course });
      } else {
        map.get(key)!.lessonUnits += course.lessonUnits;
      }
    });
    return Array.from(map.values());
  }, []);

  // Check session and fetch attendance on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const id = session?.user?.id || null;
        setUserId(id);
        if (!id) {
          setRawCourses([]);
          return;
        }

        const { data, error } = await supabase
          .from("Attendance")
          .select("courseId, summary, totalLessonUnits, ects")
          .eq("userId", id);
        if (error) throw error;

        const fetched = data.map(item => ({
          courseId: item.courseId,
          summary: item.summary,
          lessonUnits: item.totalLessonUnits,
          ects: item.ects || 0,
        }));
        setRawCourses(aggregateCourses(fetched));
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Fehler beim Laden der Daten: " + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [aggregateCourses]);

  const handleFetchICS = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`);
      if (!res.ok) throw new Error("ICS fetch failed");
      const icsData = await res.json();
      setRawCourses(aggregateCourses(icsData.events));
    } catch (err: any) {
      console.error(err);
      setError("Error fetching courses from ICS. " + err.message);
    } finally {
      setLoading(false);
    }
  }, [icsUrl, aggregateCourses, userId]);

  // Local edits
  const handleChange = useCallback(
    (index: number, field: keyof EditableCourse, value: string) => {
      setRawCourses(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: field === "lessonUnits" || field === "ects" ? Number(value) : value,
        } as any;
        return updated;
      });
    },
    []
  );

  const handleAdd = () => {
    setRawCourses(prev => [
      ...prev,
      { courseId: "", summary: "", lessonUnits: 0, ects: 0 },
    ]);
  };

  const handleDelete = (index: number) => {
    const { courseId } = rawCourses[index];
    if (courseId) setDeletedCourseIds(prev => [...prev, courseId]);
    setRawCourses(prev => prev.filter((_, i) => i !== index));
  };

  // Save all: deletes + inserts + updates separately
  const handleSaveAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      // 1) Delete queued removals
      if (deletedCourseIds.length > 0) {
        const { error: delErr } = await supabase
          .from("Attendance")
          .delete()
          .in("courseId", deletedCourseIds)
          .eq("userId", userId);
        if (delErr) throw delErr;
        setDeletedCourseIds([]);
      }

      // 2) Fetch existing IDs
      const { data: existingEntries, error: fetchErr } = await supabase
        .from("Attendance")
        .select("courseId")
        .eq("userId", userId);
      if (fetchErr) throw fetchErr;
      const existingIds = new Set(existingEntries.map(e => e.courseId));

      // 3) Prepare inserts and updates using aggregation
      const aggregated = aggregateCourses(rawCourses);
      const toInsert = aggregated.filter(
        c => c.courseId && !existingIds.has(c.courseId)
      );
      const toUpdate = aggregated.filter(
        c => c.courseId && existingIds.has(c.courseId)
      );

      // 4) Inserts
      if (toInsert.length > 0) {
        const { error: insErr } = await supabase.from("Attendance").insert(
          toInsert.map(course => ({
            userId,
            courseId: course.courseId,
            summary: course.summary,
            totalLessonUnits: course.lessonUnits,
            ects: course.ects,
            missedLessonUnits: 0,
            progress: 0,
          }))
        );
        if (insErr) throw insErr;
      }

      // 5) Updates
      for (const course of toUpdate) {
        const { error: updErr } = await supabase
          .from("Attendance")
          .update({
            summary: course.summary,
            totalLessonUnits: course.lessonUnits,
            ects: course.ects,
          })
          .eq("userId", userId)
          .eq("courseId", course.courseId!);
        if (updErr) throw updErr;
      }

      alert("Courses and attendance saved successfully.");
    } catch (err: any) {
      console.error("Save error:", err);
      setError("Fehler beim Speichern der Daten: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [rawCourses, deletedCourseIds, aggregateCourses, userId]);

  // Early return if not authenticated
  if (!loading && userId === null) {
    return (
      <div className={styles.wrapper}>
        <p className="error">Please log in to view or edit courses.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}

      {!loading && rawCourses.length === 0 && (
        <div className={styles["form-row"]}>
          <label htmlFor="icsUrl">ICS URL:</label>
          <input
            id="icsUrl"
            type="text"
            value={icsUrl}
            onChange={e => setIcsUrl(e.target.value)}
            placeholder="Enter your ICS URL"
          />
          <button onClick={handleFetchICS} disabled={loading}>
            Fetch Courses
          </button>
        </div>
      )}

      {rawCourses.length > 0 && (
        <>  
          <div className={styles["courses-container"]}>
            {rawCourses.map((course, i) => (
              <div key={i} className={styles["course-card"]}>
                <div className={`${styles["form-group"]} ${styles.summary}`}>  
                  <label>Summary:</label>
                  <input
                    value={course.summary}
                    onChange={e => handleChange(i, "summary", e.target.value)}
                  />
                </div>
                <div className={`${styles["form-group"]} ${styles["course-id"]}`}>  
                  <label>Course ID:</label>
                  <input
                    value={course.courseId}
                    onChange={e => handleChange(i, "courseId", e.target.value)}
                  />
                </div>
                <div className={`${styles["form-group"]} ${styles.ects}`}>  
                  <label>ECTS:</label>
                  <input
                    type="number"
                    value={course.ects}
                    onChange={e => handleChange(i, "ects", e.target.value)}
                  />
                </div>
                <div className={`${styles["form-group"]} ${styles["lesson-units"]}`}>  
                  <label>Lesson Units:</label>
                  <input
                    type="number"
                    value={course.lessonUnits}
                    onChange={e => handleChange(i, "lessonUnits", e.target.value)}
                  />
                </div>
                <button
                  className={styles["delete-button"]}
                  onClick={() => handleDelete(i)}
                  disabled={loading}
                >
                  Delete Course
                </button>
              </div>
            ))}
          </div>

          <div className={styles["actions-row"]}>
            <button onClick={handleAdd}>➕ Add Course</button>
            <button onClick={handleSaveAll}>💾 Save Changes</button>
          </div>
        </>
      )}
    </div>
  );
}
