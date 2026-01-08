import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // <- Ensure you have prisma client here

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    const subject = form.get("subject")?.toString() ?? "";
    const message = form.get("message")?.toString() ?? "";
    const file = form.get("file") as unknown as File | null;

    let fileUrl: string | null = null;

    // TODO later: Upload to Cloudinary or S3
    if (file && file.name) {
      fileUrl = `/contact/${file.name}`; // temporary stub
    }

    // Save to database
    const saved = await prisma.ContactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        fileUrl,
        status: "new",
      },
    });

    return NextResponse.json({ ok: true, saved });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
