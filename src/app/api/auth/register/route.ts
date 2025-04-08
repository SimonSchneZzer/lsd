import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Prüfe, ob der Benutzer bereits existiert
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }
    
    // Hash das Passwort
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Erstelle den neuen Benutzer ohne Namensangabe (name bleibt null)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: null,
      },
    });
    
    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}