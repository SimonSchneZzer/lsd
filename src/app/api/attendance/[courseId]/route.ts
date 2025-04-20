import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise <{ courseId: string }> }
) {
  try {
    // Session abfragen
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { courseId } = await params;

    // Der Request-Body enthält die Daten für den einzelnen Kurs
    const courseData = await request.json();

    // Zuerst upserten wir den Kurs in der Course‑Tabelle
    const course = await prisma.course.upsert({
      where: { courseId_userId: { courseId, userId } },
      update: {
        lessonUnits: { increment: courseData.lessonUnits ?? 0 },
        summary: courseData.summary ?? "",
        ects: courseData.ects ?? 0,
      },
      create: {
        courseId,
        summary: courseData.summary ?? "",
        lessonUnits: courseData.lessonUnits ?? 0,
        ects: courseData.ects ?? 0,
        userId,
      },
    });

    // Anschließend upserten wir den Datensatz in der Attendance‑Tabelle
    const attendance = await prisma.attendance.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {
        totalLessonUnits: courseData.lessonUnits ?? 0,
        summary: courseData.summary ?? "",
        missedLessonUnits: courseData.missedLessonUnits ?? 0,
        progress: courseData.progress ?? 0,
      },
      create: {
        courseId,
        summary: courseData.summary ?? "",
        totalLessonUnits: courseData.lessonUnits ?? 0,
        missedLessonUnits: courseData.missedLessonUnits ?? 0,
        progress: courseData.progress ?? 0,
        userId,
      },
    });

    return NextResponse.json({ course, attendance });
  } catch (error) {
    console.error("Error in attendance for course", params.courseId, error);
    return NextResponse.json({ error: "Error updating attendance record" }, { status: 500 });
  }
}