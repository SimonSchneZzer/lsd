// src/app/api/attendance/importAll/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


type Course = {
  id: string;
  courseId: string;
  summary: string;
  lessonUnits: number;
  ects: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function POST() {
  try {

    const courses: Course[] = await prisma.course.findMany();

    const attendancePromises = courses.map((course: Course) =>
      prisma.attendance.upsert({
        where: { courseId: course.courseId },
        update: {
          // Falls der Eintrag schon existiert, aktualisiere summary und totalLessonUnits
          summary: course.summary,
          totalLessonUnits: course.lessonUnits,
        },
        create: {
          courseId: course.courseId,
          summary: course.summary,
          totalLessonUnits: course.lessonUnits,
          missedLessonUnits: 0, // Startwert: 0
          progress: 0,
        },
      })
    );

    const attendanceResults = await Promise.all(attendancePromises);
    return NextResponse.json({ attendance: attendanceResults });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error importing courses into attendance" },
      { status: 500 }
    );
  }
}