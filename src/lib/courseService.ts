import { supabase } from './supabaseClient';
import { EditableCourse } from '@/types/course';

export async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}

export async function fetchCourses(userId: string): Promise<EditableCourse[]> {
  const { data, error } = await supabase
    .from("Attendance")
    .select("courseId, summary, totalLessonUnits, ects")
    .eq("userId", userId);
  if (error) throw error;

  return data.map((item: any) => ({
    courseId: item.courseId,
    summary: item.summary,
    lessonUnits: item.totalLessonUnits,
    ects: item.ects || 0,
  }));
}

export async function deleteCourses(userId: string, courseIds: string[]) {
  const { error } = await supabase
    .from("Attendance")
    .delete()
    .in("courseId", courseIds)
    .eq("userId", userId);
  if (error) throw error;
}

export async function saveCourses(userId: string, courses: EditableCourse[]) {
  const { data: existingEntries, error } = await supabase
    .from("Attendance")
    .select("courseId")
    .eq("userId", userId);
  if (error) throw error;

  const existingIds = new Set(existingEntries.map((e: any) => e.courseId));
  const toInsert = courses.filter(c => c.courseId && !existingIds.has(c.courseId));
  const toUpdate = courses.filter(c => c.courseId && existingIds.has(c.courseId));

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase.from("Attendance").insert(
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
    if (insertError) throw insertError;
  }

  for (const course of toUpdate) {
    const { error: updateError } = await supabase
      .from("Attendance")
      .update({
        summary: course.summary,
        totalLessonUnits: course.lessonUnits,
        ects: course.ects,
      })
      .eq("userId", userId)
      .eq("courseId", course.courseId);
    if (updateError) throw updateError;
  }
}