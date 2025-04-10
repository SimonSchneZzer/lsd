import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Alle Kurse aus der Course-Tabelle laden
    const courses = await prisma.course.findMany();

    // Für jeden Kurs upserten wir einen Attendance-Datensatz für diesen User
    // Für jeden Kurs upserten wir einen Attendance-Datensatz für diesen User
    const attendancePromises = courses.map((course) =>
        prisma.attendance.upsert({
        where: { 
            // Composite Key: Kombination aus userId und courseId
        userId_courseId: { userId, courseId: course.courseId } 
        },
        update: {
            totalLessonUnits: course.lessonUnits,
            summary: course.summary,
        },
        create: {
            courseId: course.courseId,
            summary: course.summary,
            totalLessonUnits: course.lessonUnits,
            missedLessonUnits: 0,
            progress: 0,
            userId,
        },
        })
    );

    const attendanceResults = await Promise.all(attendancePromises);
    return NextResponse.json({ attendance: attendanceResults });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error importing attendance records" },
      { status: 500 }
    );
  }
}