'use client';

import { useEffect, useState } from 'react';
import { CalendarEvent } from '@/types/event';

type GroupedEvent = {
  courseId: string;
  summary: string;
  totalLessonUnits: number;
};

export default function AttendancePage() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        const events: CalendarEvent[] = data.events || [];

        const grouped = events.reduce((acc, event) => {
          if (!event.courseId) return acc;

          if (!acc[event.courseId]) {
            acc[event.courseId] = {
              courseId: event.courseId,
              summary: event.summary,
              totalLessonUnits: 0,
            };
          }

          acc[event.courseId].totalLessonUnits += event.lessonUnits;
          return acc;
        }, {} as Record<string, GroupedEvent>);

        setGroupedEvents(Object.values(grouped));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching calendar:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading events...</p>
      ) : groupedEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {groupedEvents.map((event) => (
            <li key={event.courseId} className="mb-4">
              <p><strong>Summary:</strong> {event.summary.replace(/^.*? - /, '')}</p>
              <p><strong>Total EH:</strong> {event.totalLessonUnits}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}