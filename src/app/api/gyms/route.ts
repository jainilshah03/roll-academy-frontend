import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const gyms = await prisma.gym.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(gyms);
    } catch (err) {
        console.error("Error fetching gyms:", err);
        return NextResponse.json(
            { error: "Failed to fetch gyms" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
