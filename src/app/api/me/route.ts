import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromCookie } from "@/lib/auth";

export const dynamic = "force-dynamic"; // 🔥 REQUIRED

export async function GET() {
  const cookieStore = cookies(); // get live cookies
  const user = getUserFromCookie(cookieStore);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
