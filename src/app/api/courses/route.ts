import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { courseId, summary, lessonUnits, ects } = body;

    const newCourse = await prisma.course.create({
      data: {
        courseId,
        summary,
        lessonUnits,
        ects,
      },
    });
    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) { 
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}