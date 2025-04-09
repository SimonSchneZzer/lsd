import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json({ attendance: courses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching attendance data" },
      { status: 500 }
    );
  }
}
