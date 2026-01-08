import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos`,
      {
        headers: {
          // forward cookies if needed later
          cookie: req.headers.get("cookie") || "",
        },
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (err) {
    console.error("VIDEOS PROXY ERROR:", err);
    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
