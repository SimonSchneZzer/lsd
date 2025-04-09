// src/app/api/attendance/[courseId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Damit Next.js die dynamische Route asynchron verarbeitet:
export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
      const body = await request.json();
      const missedLessonUnits = body.missedLessonUnits ?? 0;
      
      const updatedRecord = await prisma.attendance.update({
        where: { courseId: params.courseId },
        data: { missedLessonUnits },
      });
      
      return NextResponse.json({ attendance: updatedRecord });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error updating attendance" },
        { status: 500 }
      );
    }
  }