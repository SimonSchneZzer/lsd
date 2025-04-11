import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Damit Next.js den dynamischen Parameter asynchron verarbeitet:
export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Zuerst die Session abrufen, um den User zu kennen:
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const resolvedParams = await Promise.resolve(params);
    const { courseId } = resolvedParams;
    const body = await request.json();
    const missedLessonUnits = body.missedLessonUnits ?? 0;

    // Verwende den zusammengesetzten Unique-Key im Where-Block:
    const attendance = await prisma.attendance.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { missedLessonUnits },
      create: {
        courseId,
        summary: body.summary || "",
        totalLessonUnits: 0, // Hier ggf. einen Wert einsetzen, wenn verfügbar
        missedLessonUnits: missedLessonUnits,
        progress: 0,
        userId,
      },
    });
    return NextResponse.json({ attendance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating attendance" }, { status: 500 });
  }
}