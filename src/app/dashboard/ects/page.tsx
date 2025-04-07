'use client';

import { useEffect, useState } from 'react';
import { formatDuration, getDurationMinutes, estimateLessonUnits } from '@/lib/icsUtils';

type Event = {
  summary: string;
  dtstart: string;
  dtend: string;
  ects: number;
};

export default function ECTSPage() {
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
          {events.map((event, i) => (
            <li key={i} className="glassCard">
                <p><strong>Summary:</strong> {event.summary}</p>
                <p><strong>Start:</strong> {event.dtstart}</p>
                <p><strong>End:</strong> {event.dtend}</p>
                <p><strong>Duration:</strong> {formatDuration(event.dtstart, event.dtend)}</p>
                <p><strong>ECTS:</strong> {event.ects}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )};