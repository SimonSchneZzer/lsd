'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner/Spinner';
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';
import { getUserId, fetchCourses } from '@/lib/courseService';
import CourseOverviewCard from '@/components/CourseOverviewCard/CourseOverviewCard';

type CourseWithHome = {
  courseId: string;
  summary: string;
  ects: number;
  lessonUnits: number;
  homeHours: number;
};

export default function ECTSPage() {
  const [courses, setCourses] = useState<CourseWithHome[]>([]);
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
        const mapped: CourseWithHome[] = data.map((course) => {
          // Calculate contact hours: each lesson unit is 45 minutes
          const contactHours = (course.lessonUnits * 45) / 60;
          // Total required hours per ECTS: 25 hours
          const totalHours = course.ects * 25;
          // Home study hours = total hours minus contact hours
          const homeHours = parseFloat((totalHours - contactHours).toFixed(1));

          return {
            courseId: course.courseId,
            summary: course.summary,
            ects: course.ects,
            lessonUnits: course.lessonUnits,
            homeHours,
          };
        });
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
        <div>
          {courses.map((course) => (
            <CourseOverviewCard
              key={course.courseId}
              courseId={course.courseId}
              summary={course.summary}
              ects={course.ects}
              lessonUnits={course.lessonUnits}
              homeHours={course.homeHours}
            />
          ))}
        </div>
      )}
    </div>
  );
}
