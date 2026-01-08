import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gymId = searchParams.get("gymId");

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/status?gymId=${gymId}`,
    {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  );

  const data = await backendRes.json();

  return NextResponse.json(data, { status: backendRes.status });
}
