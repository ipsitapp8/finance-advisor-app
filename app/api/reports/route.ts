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

    // Policy type distribution
    const policyTypes = await prisma.policy.groupBy({
      by: ["policyType"],
      _count: { id: true },
      _sum: { premiumAmount: true, sumAssured: true },
    });

    const policyTypeStats = policyTypes.map((item) => ({
      type: item.policyType,
      count: item._count.id,
      totalPremium: item._sum.premiumAmount || 0,
      totalSumAssured: item._sum.sumAssured || 0,
    }));

    // Policy status distribution
    const policyStatuses = await prisma.policy.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusStats = policyStatuses.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // Premium frequency distribution
    const premiumFreqs = await prisma.policy.groupBy({
      by: ["premiumFreq"],
      _count: { id: true },
    });

    const freqStats = premiumFreqs.map((item) => ({
      frequency: item.premiumFreq,
      count: item._count.id,
    }));

    return NextResponse.json({
      policyTypeStats,
      statusStats,
      freqStats,
    });
  } catch (error: any) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Failed to generate report data" }, { status: 500 });
  }
}
