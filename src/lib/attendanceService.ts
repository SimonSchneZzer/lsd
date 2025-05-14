import { supabase } from './supabaseClient';
import { AttendanceData } from '@/types/attendance';

export async function fetchAttendanceData(userId: string): Promise<AttendanceData[]> {
  const { data, error } = await supabase
    .from('Attendance')
    .select('*')
    .eq('userId', userId);

  if (error) throw error;
  return data as AttendanceData[];
}

export async function updateMissedUnits(id: string, missed: number, total: number) {
  const progress = total > 0 ? missed / total : 0;
  const { error } = await supabase
    .from('Attendance')
    .update({ missedLessonUnits: missed, progress })
    .eq('id', id);

  if (error) throw error;
}