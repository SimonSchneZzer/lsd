import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Benutzer-Session prüfen
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Aus dem Request-Body wird ein Array von Kursen erwartet
    const { courses } = await request.json();
    if (!Array.isArray(courses)) {
      return NextResponse.json({ error: "Invalid courses data" }, { status: 400 });
    }

    // Für jeden Kurs upserten wir sowohl einen Datensatz in der Course‑ als auch in der Attendance‑Tabelle
    const results = await Promise.all(
      courses.map(async (courseData) => {
        if (!courseData.courseId) {
          console.warn(`Skipping course "${courseData.summary}" because courseId is missing.`);
          return null;
        }
        const course = await prisma.course.upsert({
          where: { courseId_userId: { courseId: courseData.courseId, userId: userId } },
          update: {
            lessonUnits: { increment: courseData.lessonUnits ?? 0 },
            summary: courseData.summary ?? "",
            ects: courseData.ects ?? 0,
          },
          create: {
            courseId: courseData.courseId,
            summary: courseData.summary ?? "",
            lessonUnits: courseData.lessonUnits ?? 0,
            ects: courseData.ects ?? 0,
            userId,
          },
        });

        const attendance = await prisma.attendance.upsert({
          where: { userId_courseId: { userId, courseId: courseData.courseId } },
          update: {
            totalLessonUnits: courseData.lessonUnits ?? 0,
            summary: courseData.summary ?? "",
            missedLessonUnits: courseData.missedLessonUnits ?? 0,
            progress: courseData.progress ?? 0,
          },
          create: {
            courseId: courseData.courseId,
            summary: courseData.summary ?? "",
            totalLessonUnits: courseData.lessonUnits ?? 0,
            missedLessonUnits: courseData.missedLessonUnits ?? 0,
            progress: courseData.progress ?? 0,
            userId,
          },
        });

        return { course, attendance };
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in importAll:", error);
    return NextResponse.json({ error: "Error importing attendance records" }, { status: 500 });
  }
}