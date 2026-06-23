import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { policySchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const dueThisMonth = searchParams.get("dueThisMonth") === "true";

    // Setup query filters
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { policyNumber: { contains: search } },
        { policyName: { contains: search } },
        { client: { name: { contains: search } } },
      ];
    }

    if (type !== "ALL") {
      whereClause.policyType = type;
    }

    if (status !== "ALL") {
      whereClause.status = status;
    }

    if (dueThisMonth) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      whereClause.dueDate = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    const policies = await prisma.policy.findMany({
      where: whereClause,
      include: {
        client: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(policies);
  } catch (error: any) {
    console.error("Policies GET API error:", error);
    return NextResponse.json({ error: "Failed to load policies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = policySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid policy fields", details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      policyNumber,
      policyType,
      policyName,
      premiumAmount,
      premiumFreq,
      startDate,
      dueDate,
      maturityDate,
      status,
      sumAssured,
      notes,
      clientId,
    } = result.data;

    // Create policy and auto-reminder in a transaction
    const newPolicy = await prisma.$transaction(async (tx) => {
      const pol = await tx.policy.create({
        data: {
          policyNumber,
          policyType,
          policyName,
          premiumAmount,
          premiumFreq,
          startDate: new Date(startDate),
          dueDate: new Date(dueDate),
          maturityDate: maturityDate ? new Date(maturityDate) : null,
          status,
          sumAssured: sumAssured || null,
          notes: notes || null,
          clientId,
        },
      });

      // Automatically generate a reminder if the policy status is ACTIVE or PENDING
      if (status === "ACTIVE" || status === "PENDING") {
        await tx.reminder.create({
          data: {
            clientId,
            type: "PREMIUM_DUE",
            title: `Premium Due: ${policyName} (${policyNumber})`,
            description: `Premium of ${premiumAmount} is due on ${new Date(dueDate).toDateString()}.`,
            dueDate: new Date(dueDate),
            isRead: false,
          },
        });
      }

      return pol;
    });

    return NextResponse.json(newPolicy, { status: 201 });
  } catch (error: any) {
    console.error("Policies POST API error:", error);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}
