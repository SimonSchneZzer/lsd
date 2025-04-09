import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Alle Kurse abrufen
export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, summary, lessonUnits, ects } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId must not be null" }, { status: 400 });
    }

    const course = await prisma.course.upsert({
      where: { courseId },
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
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating/upserting course" }, { status: 500 });
  }
}