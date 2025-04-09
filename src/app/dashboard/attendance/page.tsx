'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import ProgressBar from '@/components/ProgressBar/ProgressBar';

type GroupedEvent = {
  courseId: string;
  summary: string;
  totalLessonUnits: number;
  missedLessonUnits: number; // Angepasst an das DB-Feld
};

export default function AttendancePage() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance')
      .then((res) => res.json())
      .then((data) => {
        console.log("Attendance data:", data); // Debug-Ausgabe
        // Erwartet wird hier ein Objekt { attendance: Attendance[] }
        const courses: GroupedEvent[] = data.attendance || [];
        setGroupedEvents(courses);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching attendance data:', err);
        setLoading(false);
      });
  }, []);

  // Aktualisiert missedLessonUnits im lokalen State und in der Datenbank
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
    setGroupedEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.courseId === id) {
          const newMissed = Math.max(0, event.missedLessonUnits + delta);
          // Update in der DB
          updateMissedLessonUnits(id, newMissed);
          return { ...event, missedLessonUnits: newMissed };
        }
        return event;
      })
    );
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : groupedEvents.length === 0 ? (
        <p>No attendance data found.</p>
      ) : (
        groupedEvents.map((event: GroupedEvent) => (
          <ProgressBar
            key={event.courseId}
            summary={event.summary}
            missed={event.missedLessonUnits} // Hier wird das DB-Feld verwendet
            totalLessonUnits={event.totalLessonUnits}
            onIncrement={() => handleChange(event.courseId, 1)}
            onDecrement={() => handleChange(event.courseId, -1)}
          />
        ))
      )}
    </div>
  );
}