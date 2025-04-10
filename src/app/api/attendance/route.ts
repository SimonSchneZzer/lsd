import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const attendanceData = await prisma.attendance.findMany();
    return NextResponse.json({ attendance: attendanceData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching attendance data" },
      { status: 500 }
    );
  }
}
