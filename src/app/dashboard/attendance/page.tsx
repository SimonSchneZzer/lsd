'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import ProgressBar from '@/components/ProgressBar/ProgressBar';

type AttendanceData = {
  courseId: string;
  summary: string;
  totalLessonUnits: number;
  missedLessonUnits: number;
};

export default function AttendancePage() {
  const { data: session, status } = useSession();
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/attendance')
        .then((res) => res.json())
        .then((data) => {
          const attendance: AttendanceData[] = data.attendance || [];
          setAttendanceData(attendance);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching attendance data:', err);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'loading' || loading) return <Spinner />;
  if (!session) return <p>Please sign in to view your attendance.</p>;

  const updateMissedLessonUnits = async (courseId: string, newValue: number) => {
    try {
      const res = await fetch(`/api/attendance/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missedLessonUnits: newValue }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update missedLessonUnits for course ${courseId}`);
      }
    } catch (error) {
      console.error('Error updating missedLessonUnits:', error);
    }
  };

  const handleChange = (id: string, delta: number) => {
    setAttendanceData((prev) =>
      prev.map((item) => {
        if (item.courseId === id) {
          const newMissed = Math.max(0, item.missedLessonUnits + delta);
          updateMissedLessonUnits(id, newMissed);
          return { ...item, missedLessonUnits: newMissed };
        }
        return item;
      })
    );
  };

  return (
    <div>
      {attendanceData.length === 0 ? (
        <p>No attendance data found.</p>
      ) : (
        attendanceData.map((item) => (
          <ProgressBar
            key={item.courseId}
            summary={item.summary}
            missed={item.missedLessonUnits}
            totalLessonUnits={item.totalLessonUnits}
            onIncrement={() => handleChange(item.courseId, 1)}
            onDecrement={() => handleChange(item.courseId, -1)}
          />
        ))
      )}
    </div>
  );
}