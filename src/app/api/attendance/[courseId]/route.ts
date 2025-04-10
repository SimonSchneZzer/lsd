// src/app/api/attendance/[courseId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Damit Next.js den dynamischen Parameter asynchron verarbeitet:
export const dynamic = 'force-dynamic';
export async function PUT(
  request: Request,

  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { courseId } = resolvedParams;
    const body = await request.json();
    // Stelle sicher, dass missedLessonUnits einen numerischen Wert hat; falls nicht, setze auf 0.
    const missedLessonUnits = body.missedLessonUnits ?? 0;

    const attendance = await prisma.attendance.upsert({
      where: { courseId },
      update: { missedLessonUnits },
      create: {
        courseId,
        summary: body.summary || "",  // Falls du summary aus dem body übernehmen möchtest
        totalLessonUnits: 0, // oder, falls du diesen Wert aus Course übernehmen möchtest, musst du ihn hier weiterleiten
        missedLessonUnits: missedLessonUnits,
        progress: 0,
      },
    });
    return NextResponse.json({ attendance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating attendance" }, { status: 500 });
  }
}