import { useEffect, useState } from 'react';
import { AttendanceData } from '@/types/attendance';
import { fetchAttendanceData, updateMissedUnits } from '@/lib/attendanceService';
import { supabase } from '@/lib/supabaseClient';

export function useAttendance() {
  const [data, setData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAuthenticated, setNotAuthenticated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (sessionError) {
        console.error('Session-Fehler:', sessionError);
      }

      if (!session?.user) {
        setNotAuthenticated(true);
        setLoading(false);
        return;
      }

      try {
        const attendance = await fetchAttendanceData(session.user.id);
        setData(attendance);
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleChange = async (id: string, delta: number) => {
    setData(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newMissed = Math.max(0, item.missedLessonUnits + delta);
          updateMissedUnits(id, newMissed, item.totalLessonUnits);
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

  return { data, loading, notAuthenticated, handleChange };
}