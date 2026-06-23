import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || "") || new Date().getMonth() + 1; // 1-12
    const year = parseInt(searchParams.get("year") || "") || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // last day of month

    const policies = await prisma.policy.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    const reportData = policies.map((p) => ({
      id: p.id,
      clientName: p.client.name,
      clientPhone: p.client.phone,
      policyNumber: p.policyNumber,
      policyName: p.policyName,
      premiumAmount: p.premiumAmount,
      premiumFreq: p.premiumFreq,
      dueDate: p.dueDate,
      status: p.status, // ACTIVE = Paid (or we can assume ACTIVE as Due / LAPSED as Overdue / paid status flag)
    }));

    return NextResponse.json(reportData);
  } catch (error: any) {
    console.error("Premium Summary Report API error:", error);
    return NextResponse.json(
      { error: "Failed to generate premium summary" },
      { status: 500 }
    );
  }
}
