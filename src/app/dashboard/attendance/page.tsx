'use client';

import { useAttendance } from '@/hooks/useAttendance';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Spinner from '@/components/Spinner/Spinner';

export default function AttendancePage() {
  const { data, loading, handleChange } = useAttendance();

  if (loading) return <Spinner />;

  return (
    <div>
      {data.length === 0 ? (
        <p>Keine Anwesenheitsdaten gefunden.</p>
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