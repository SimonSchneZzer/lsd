'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner/Spinner';
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';
import { getUserId, fetchCourses } from '@/lib/courseService';
type GroupedEvent = { courseId: string; summary: string; ects: number };

export default function ECTSPage() {
  const [courses, setCourses] = useState<GroupedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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
        const data = await fetchCourses(id);
        // Map EditableCourse to GroupedEvent
        const mapped = data.map((course) => ({
          courseId: course.courseId,
          summary: course.summary,
          ects: course.ects,
        }));
        setCourses(mapped);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Spinner />;
  if (!userId) return <NotLoggedIn context="your ECTS overview" />;

  return (
    <div>
      {courses.length === 0 ? (
        <p>No courses found. This feature is currently only available for students with saved courses.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.courseId} className="mb-4">
              <p><strong>Summary:</strong> {course.summary.replace(/^.*? - /, '')}</p>
              <p><strong>ECTS:</strong> {course.ects}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
