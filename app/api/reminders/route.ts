import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reminders = await prisma.reminder.findMany({
      include: {
        client: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(reminders);
  } catch (error: any) {
    console.error("Reminders GET API error:", error);
    return NextResponse.json({ error: "Failed to load reminders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isRead } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Reminder ID is required" }, { status: 400 });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json(updatedReminder);
  } catch (error: any) {
    console.error("Reminders PATCH API error:", error);
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 });
  }
}
