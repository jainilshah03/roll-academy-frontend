import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gymId = url.searchParams.get("gymId");

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/by-gym?gymId=${gymId}`,
    {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  const data = await backendRes.json();

  return NextResponse.json(data, {
    status: backendRes.status,
  });
}
