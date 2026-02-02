import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // ✅ FIXED
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const gymId = body.gymId; // optional

    console.log("🔍 Login attempt:", { email, gymId, hasPassword: !!password });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { gym: true },
    });

    console.log("👤 User found:", user ? { id: user.id, email: user.email, hasPassword: !!user.password, gymId: user.gymId } : null);

    if (!user || !user.password) {
      console.log("❌ User not found or no password");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔐 Password check
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("🔑 Password valid:", isValidPassword);
    if (!isValidPassword) {
      console.log("❌ Invalid password");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🏋️ Gym validation (only if provided)
    if (gymId && user.gymId !== gymId) {
      return NextResponse.json(
        { error: "You are not a member of this gym" },
        { status: 403 }
      );
    }

    // 🎟️ JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        gymId: user.gymId,
      },
      SECRET,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        gymId: user.gymId,
        gymName: user.gym.name,
      },
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
