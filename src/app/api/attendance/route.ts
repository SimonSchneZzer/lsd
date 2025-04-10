import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const attendanceData = await prisma.attendance.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json({ attendance: attendanceData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching attendance data" }, { status: 500 });
  }
}