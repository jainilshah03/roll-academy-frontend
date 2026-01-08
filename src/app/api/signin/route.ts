import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
