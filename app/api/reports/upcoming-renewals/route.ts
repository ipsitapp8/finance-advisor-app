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
    const startStr = searchParams.get("startDate") || "";
    const endStr = searchParams.get("endDate") || "";

    if (!startStr || !endStr) {
      return NextResponse.json(
        { error: "startDate and endDate parameters are required" },
        { status: 400 }
      );
    }

    const start = new Date(startStr);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999); // set to end of day

    const policies = await prisma.policy.findMany({
      where: {
        dueDate: {
          gte: start,
          lte: end,
        },
        status: "ACTIVE",
      },
      include: {
        client: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    const reportData = policies.map((p) => ({
      id: p.id,
      clientName: p.client.name,
      clientPhone: p.client.phone,
      clientEmail: p.client.email,
      policyNumber: p.policyNumber,
      policyName: p.policyName,
      premiumAmount: p.premiumAmount,
      premiumFreq: p.premiumFreq,
      dueDate: p.dueDate,
    }));

    return NextResponse.json(reportData);
  } catch (error: any) {
    console.error("Upcoming Renewals Report API error:", error);
    return NextResponse.json(
      { error: "Failed to generate renewals report" },
      { status: 500 }
    );
  }
}
