import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();

  return NextResponse.json(data, { status: backendRes.status });
}
