'use client';

import { useAttendance } from '@/hooks/useAttendance';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Spinner from '@/components/Spinner/Spinner';
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';

export default function AttendancePage() {
  const { data, loading, notAuthenticated, handleChange } = useAttendance();

  if (loading) return <Spinner />;

  if (notAuthenticated) {
    return <NotLoggedIn context="your attendance data" />;
  }

  return (
    <div>
      {data.length === 0 ? (
        <p>No courses found. This feature is currently only available for students with saved courses.</p>
      ) : (
        data.map(item => (
          <ProgressBar
            key={item.id}
            summary={item.summary}
            missed={item.missedLessonUnits}
            totalLessonUnits={item.totalLessonUnits}
            onIncrement={() => handleChange(item.id, 1)}
            onDecrement={() => handleChange(item.id, -1)}
          />
        ))
      )}
    </div>
  );
}