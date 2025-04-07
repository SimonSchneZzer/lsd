'use client';

import { useEffect, useState } from 'react';

type Event = {
  summary: string;
  dtstart: string;
  dtend: string;
  ects: number;
};

function parseIcsDate(dateStr: string): Date {
  // Formatiing: 20250520T151500 → 2025-05-20T15:15:00
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(9, 11);
  const minute = dateStr.slice(11, 13);
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
}

function formatDuration(start: string, end: string): string {
  const startDate = parseIcsDate(start);
  const endDate = parseIcsDate(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${remainingMinutes}min`;
}

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