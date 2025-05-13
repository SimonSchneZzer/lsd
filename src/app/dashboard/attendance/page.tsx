'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Spinner from '@/components/Spinner/Spinner';

type AttendanceData = {
  id: string;
  courseId: string;
  summary: string;
  totalLessonUnits: number;
  missedLessonUnits: number;
  progress: number;
};

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError || !session?.user?.id) {
        console.error("Fehler beim Abrufen der Session:", sessionError);
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from('Attendance')
        .select('*')
        .eq('userId', session.user.id); 
  
      if (error) {
        console.error('Fehler beim Laden der Daten:', error);
      } else {
        setAttendanceData(data as AttendanceData[]);
      }
  
      setLoading(false);
    };
  
    fetchData();
  }, []);

  const updateMissedLessonUnits = async (id: string, missed: number, total: number) => {
    const progress = total > 0 ? missed / total : 0;

    const { error } = await supabase
      .from('Attendance')
      .update({ missedLessonUnits: missed, progress })
      .eq('id', id);

    if (error) {
      console.error('Fehler beim Aktualisieren:', error);
    }
  };

  const handleChange = (id: string, delta: number) => {
    setAttendanceData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newMissed = Math.max(0, item.missedLessonUnits + delta);
          updateMissedLessonUnits(id, newMissed, item.totalLessonUnits);
          return {
            ...item,
            missedLessonUnits: newMissed,
            progress: item.totalLessonUnits > 0 ? newMissed / item.totalLessonUnits : 0,
          };
        }
        return item;
      })
    );
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {attendanceData.length === 0 ? (
        <p>Keine Anwesenheitsdaten gefunden.</p>
      ) : (
        attendanceData.map((item) => (
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