import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: attendanceData, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Error fetching attendance data" }, { status: 500 });
    }

    return NextResponse.json({ attendance: attendanceData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching attendance data" }, { status: 500 });
  }
}