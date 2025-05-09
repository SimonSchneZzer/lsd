import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET: Alle Kurse abrufen
export async function GET() {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const userId = session.user.id;
      const courses = await prisma.course.findMany({
        where: { userId },
      });
      return NextResponse.json({ courses });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error fetching courses" }, { status: 500 });
    }
  }

export async function POST(request: Request) {
  try {
    // Hole zunächst die Session und extrahiere die User-ID:
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { courseId, summary, lessonUnits, ects } = body;

    if (!courseId || courseId.trim() === "") {
      return NextResponse.json(
        { error: "courseId must not be empty" },
        { status: 400 }
      );
    }

    // Upsert in der Course-Tabelle, dabei wird auch userId gesetzt
    const course = await prisma.course.upsert({
      where: { courseId_userId: { courseId, userId } },
      update: {
        lessonUnits: { increment: lessonUnits },
        summary,
        ects,
      },
      create: {
        courseId,
        summary,
        lessonUnits,
        ects,
        userId
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating/upserting course" },
      { status: 500 }
    );
  }
}