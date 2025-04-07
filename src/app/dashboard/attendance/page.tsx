'use client';

import { useEffect, useState } from 'react';
import { formatDuration, getDurationMinutes, estimateLessonUnits } from '@/lib/icsUtils';

type Event = {
  summary: string;
  dtstart: string;
  dtend: string;
};

export default function AttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
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
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event, i) => {
            const duration = formatDuration(event.dtstart, event.dtend);
            const durationMinutes = getDurationMinutes(event.dtstart, event.dtend);
            const lessonUnits = estimateLessonUnits(durationMinutes);
            console.log(`⏱️ ${event.summary} = ${durationMinutes}min → ${lessonUnits} EH`);

            return (
              <li key={i} className="glassCard">
                <p><strong>Summary:</strong> {event.summary}</p>
                <p><strong>Duration:</strong> {duration} ({lessonUnits  } EH)</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}