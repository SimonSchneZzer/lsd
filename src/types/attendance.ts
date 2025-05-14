export type AttendanceData = {
  id: string;
  courseId: string;
  summary: string;
  totalLessonUnits: number;
  missedLessonUnits: number;
  progress: number;
};