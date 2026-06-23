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

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    // 1. Total Clients count
    const totalClients = await prisma.client.count();

    // 2. Active Policies
    const activePolicies = await prisma.policy.count({
      where: { status: "ACTIVE" },
    });

    // 3. Premiums Due This Month
    const policiesDueThisMonth = await prisma.policy.findMany({
      where: {
        dueDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: "ACTIVE",
      },
      select: {
        premiumAmount: true,
      },
    });
    const premiumsDueThisMonth = policiesDueThisMonth.reduce(
      (sum, p) => sum + p.premiumAmount,
      0
    );

    // 4. Overdue Premiums (dueDate in the past and status is ACTIVE/LAPSED/PENDING)
    const overduePoliciesList = await prisma.policy.findMany({
      where: {
        dueDate: {
          lt: today,
        },
        status: {
          in: ["ACTIVE", "LAPSED", "PENDING"],
        },
      },
      select: {
        premiumAmount: true,
      },
    });
    const overduePremiums = overduePoliciesList.reduce(
      (sum, p) => sum + p.premiumAmount,
      0
    );

    // 5. Recent Clients (last 5 added)
    const recentClients = await prisma.client.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    // 6. Upcoming Reminders (next 5)
    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        isRead: false,
        dueDate: {
          gte: today,
        },
      },
      take: 5,
      orderBy: { dueDate: "asc" },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    // 7. Birthdays This Month
    // SQLite doesn't have an easy EXTRACT(MONTH from dateOfBirth) function without raw queries,
    // so we can query clients and filter in JavaScript for robust SQLite portability.
    const allClientsWithDob = await prisma.client.findMany({
      where: {
        dateOfBirth: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        dateOfBirth: true,
      },
    });
    const currentMonthNum = today.getMonth(); // 0-indexed
    const birthdaysThisMonth = allClientsWithDob
      .filter((client) => {
        if (!client.dateOfBirth) return false;
        return new Date(client.dateOfBirth).getMonth() === currentMonthNum;
      })
      .map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        dateOfBirth: c.dateOfBirth,
      }));

    // 8. Policy Type Distribution (Donut Chart: LIC vs MF vs Insurance vs Others)
    const allPolicies = await prisma.policy.findMany({
      select: {
        policyType: true,
      },
    });
    const counts = {
      LIC: 0,
      MF: 0,
      Insurance: 0,
      Others: 0,
    };
    allPolicies.forEach((p) => {
      if (p.policyType === "LIC") {
        counts.LIC++;
      } else if (p.policyType === "MUTUAL_FUND") {
        counts.MF++;
      } else if (
        p.policyType === "HEALTH_INSURANCE" ||
        p.policyType === "TERM_INSURANCE"
      ) {
        counts.Insurance++;
      } else {
        counts.Others++;
      }
    });
    const policyTypeStats = [
      { name: "LIC", value: counts.LIC },
      { name: "MF", value: counts.MF },
      { name: "Insurance", value: counts.Insurance },
      { name: "Others", value: counts.Others },
    ].filter((item) => item.value > 0);

    // 9. Monthly Premium Collection (Recharts Line chart: last 12 months)
    // We will build a trend of premiums due over the past 6 months and future 6 months
    const monthlyPremiumCollection: Array<{ name: string; value: number }> = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = -6; i <= 5; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const monthPolicies = await prisma.policy.findMany({
        where: {
          dueDate: {
            gte: mStart,
            lte: mEnd,
          },
        },
        select: {
          premiumAmount: true,
        },
      });
      
      const totalPremium = monthPolicies.reduce((sum, p) => sum + p.premiumAmount, 0);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyPremiumCollection.push({
        name: label,
        value: totalPremium,
      });
    }

    return NextResponse.json({
      totalClients,
      activePolicies,
      premiumsDueThisMonth,
      overduePremiums,
      recentClients,
      upcomingReminders,
      birthdaysThisMonth,
      policyTypeStats,
      monthlyPremiumCollection,
    });
  } catch (error: any) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
