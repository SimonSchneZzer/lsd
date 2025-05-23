import { useEffect, useState, useCallback } from "react";
import { EditableCourse } from "@/types/course";
import { getUserId, fetchCourses, deleteCourses, saveCourses } from "@/lib/courseService";
import { useToastStore } from "@/store/toastStore"; // 👈 Toast-Store importieren

export function useConfigurator() {
  const [userId, setUserId] = useState<string | null>(null);
  const [icsUrl, setIcsUrl] = useState<string>("");
  const [rawCourses, setRawCourses] = useState<EditableCourse[]>([]);
  const [deletedCourseIds, setDeletedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setMessage } = useToastStore(); // 👈 Toast-Setter verwenden

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const id = await getUserId();
      setUserId(id);

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const courses = await fetchCourses(id);
        setRawCourses(aggregateCourses(courses));
      } catch (err: any) {
        setMessage("Fehler beim Laden der Daten: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [aggregateCourses, setMessage]);

  const handleChange = useCallback((index: number, field: keyof EditableCourse, value: string | number) => {
    setRawCourses(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: (field === "lessonUnits" || field === "ects")
          ? typeof value === "number"
            ? value
            : Number(value)
          : value,
      } as EditableCourse;
      return updated;
    });
  }, []);

  const handleAdd = () => {
    setRawCourses(prev => [...prev, { courseId: "", summary: "", lessonUnits: 0, ects: 0 }]);
  };

  const handleDelete = (index: number) => {
    const { courseId } = rawCourses[index];
    if (courseId) setDeletedCourseIds(prev => [...prev, courseId]);
    setRawCourses(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      if (deletedCourseIds.length > 0) {
        await deleteCourses(userId, deletedCourseIds);
        setDeletedCourseIds([]);
      }
      await saveCourses(userId, aggregateCourses(rawCourses));
      setMessage("Kurse erfolgreich gespeichert.");
    } catch (err: any) {
      setMessage("Fehler beim Speichern: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, deletedCourseIds, rawCourses, aggregateCourses, setMessage]);

  const handleFetchICS = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`);
      if (!res.ok) throw new Error("ICS fetch failed");
      const data = await res.json();
      setRawCourses(aggregateCourses(data.events));
      setMessage("ICS erfolgreich geladen.");
    } catch (err: any) {
      setMessage("Fehler beim ICS-Import: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, icsUrl, aggregateCourses, setMessage]);

  return {
    userId,
    loading,
    rawCourses,
    icsUrl,
    setIcsUrl,
    handleChange,
    handleAdd,
    handleDelete,
    handleSaveAll,
    handleFetchICS,
  };
}