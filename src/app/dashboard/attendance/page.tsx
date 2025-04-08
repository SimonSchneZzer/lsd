'use client';

import { useEffect, useState } from 'react';
import { CalendarEvent } from '@/types/event';
import Spinner from '@/components/Spinner/Spinner';
import ProgressBar from '@/components/ProgressBar/ProgressBar';


type GroupedEvent = {
  courseId: string;
  summary: string;
  totalLessonUnits: number;
};

export default function AttendancePage() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
  const [missedEH, setMissedEH] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        const events: CalendarEvent[] = data.events || [];

        const grouped = events.reduce((acc, event) => {
          const id = event.courseId || event.summary;
          if (!acc[id]) {
            acc[id] = {
              courseId: id,
              summary: event.summary,
              totalLessonUnits: 0,
            };
          }
          acc[id].totalLessonUnits += event.lessonUnits;
          return acc;
        }, {} as Record<string, GroupedEvent>);

        const groupedArray = Object.values(grouped);
        setGroupedEvents(groupedArray);

        const missedState: Record<string, number> = {};
        groupedArray.forEach((e) => (missedState[e.courseId] = 0));
        setMissedEH(missedState);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching calendar:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (id: string, delta: number) => {
    setMissedEH((prev) => {
      const newValue = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: newValue };
    });
  };

<<<<<<< HEAD
  // ...
return (
  <div>
    {loading ? (
      <Spinner />
    ) : groupedEvents.length === 0 ? (
      <p>No events found.</p>
    ) : (
      groupedEvents.map((event) => {
        const missed = missedEH[event.courseId] || 0;
        return (
          <ProgressBar
            key={event.courseId}
            summary={event.summary}
            missed={missed}
            totalLessonUnits={event.totalLessonUnits}
            onIncrement={() => handleChange(event.courseId, 1)}
            onDecrement={() => handleChange(event.courseId, -1)}
          />
        );
      })
    )}
  </div>
);
=======
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : groupedEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        groupedEvents.map((event) => {
          const missed = missedEH[event.courseId] || 0;
          const percentageMissed = Math.min(100, (missed / event.totalLessonUnits) * 100);

          return (
            <div key={event.courseId} className="course-block">
              <h2>
                <b>{event.summary.replace(/^.*? - /, '')}</b>
              </h2>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentageMissed}%` }}
                />
              </div>

              <div className="control-bar">
                <div className="control-row">
                  <button
                    onClick={() => handleChange(event.courseId, -1)}
                    className="control-button"
                  >
                    −
                  </button>
                  <span>
                    {missed} EH missed of {event.totalLessonUnits} EH
                  </span>
                  <button
                    onClick={() => handleChange(event.courseId, 1)}
                    className="control-button"
                  >
                    +
                  </button>
                </div>
                <p className="percentage-label">
                  {percentageMissed.toFixed(0)}% missed
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
>>>>>>> fa1cccbcb15bc44d92bac024d4072fd270118447
}