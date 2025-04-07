'use client';

import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/icsUtils';
import { CalendarEvent } from '@/types/event';

export default function AttendancePage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
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
          {events.map((event, i) => (
            <li key={i}>
              <p><strong>Summary:</strong> {event.summary}</p>
              <p>
                <strong>Duration:</strong> {formatDuration(event.dtstart, event.dtend)} ({event.lessonUnits} EH)
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}