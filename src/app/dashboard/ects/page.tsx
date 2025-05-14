'use client';

import { useEffect, useState } from 'react';
import { CalendarEvent } from '@/types/event';
import Spinner from '@/components/Spinner/Spinner';
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';
import { getUserId } from '@/lib/courseService';

type GroupedEvent = {
  courseId: string;
  summary: string;
  ects: number;
};

export default function ECTSPage() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
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

      fetch('/api/calendar')
        .then((res) => res.json())
        .then((data) => {
          const events: CalendarEvent[] = data.events || [];
          const grouped: Record<string, GroupedEvent> = {};

          for (const event of events) {
            if (!event.courseId) continue;

            if (!grouped[event.courseId]) {
              grouped[event.courseId] = {
                courseId: event.courseId,
                summary: event.summary,
                ects: event.ects,
              };
            }
          }

          setGroupedEvents(Object.values(grouped));
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching calendar:', err);
          setLoading(false);
        });
    };

    load();
  }, []);

  if (loading) return <Spinner />;
  if (!userId) return <NotLoggedIn context="your ECTS overview" />;

  return (
    <div>
      {groupedEvents.length === 0 ? (
        <p>No events found. This feature is currently only available for MMT-Bachelor Students</p>
      ) : (
        <ul>
          {groupedEvents.map((event) => (
            <li key={event.courseId} className="mb-4">
              <p><strong>Summary:</strong> {event.summary.replace(/^.*? - /, '')}</p>
              <p><strong>ECTS:</strong> {event.ects}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}