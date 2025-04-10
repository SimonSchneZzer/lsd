import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise <{ id: string }>  }) {
  try {
    const {id} = await params;
    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT( request: Request, { params }: { params: Promise <{ id: string }> }) {
    try {
      const body = await request.json();
  
      const { courseId, summary, lessonUnits, ects } = body;
      const {id} = await params;

      const updatedCourse = await prisma.course.update({
        where: { id: id },
        data: {
          courseId,
          summary,
          lessonUnits,
          ects,
        },
      });
      return NextResponse.json({ course: updatedCourse }, { status: 200 });
    }
    catch (error) {
      console.error("Error updating course:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}

export async function DELETE( request: Request, { params }: { params: Promise <{ id: string }> }) {
    try {
    const {id} = await params;
      await prisma.course.delete({
        where: { id: id },
      });
  
      return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting course:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}