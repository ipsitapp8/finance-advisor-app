import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const next30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
    const next7Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const next60Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);

    let generatedCount = 0;

    // 1. Policies due in the next 30 days
    const activePoliciesDueSoon = await prisma.policy.findMany({
      where: {
        status: "ACTIVE",
        dueDate: {
          gte: today,
          lte: next30Days,
        },
      },
      include: { client: true },
    });

    for (const policy of activePoliciesDueSoon) {
      const title = `Premium Due: ${policy.policyName} (${policy.policyNumber})`;
      const existing = await prisma.reminder.findFirst({
        where: {
          clientId: policy.clientId,
          type: "PREMIUM_DUE",
          dueDate: policy.dueDate,
        },
      });

      if (!existing) {
        await prisma.reminder.create({
          data: {
            clientId: policy.clientId,
            type: "PREMIUM_DUE",
            title,
            description: `Premium of ${policy.premiumAmount} is due on ${new Date(policy.dueDate).toDateString()} for client ${policy.client.name}.`,
            dueDate: policy.dueDate,
            isRead: false,
          },
        });
        generatedCount++;
      }
    }

    // 2. Overdue premiums (dueDate in the past, status is ACTIVE or LAPSED)
    const overduePolicies = await prisma.policy.findMany({
      where: {
        dueDate: {
          lt: today,
        },
        status: {
          in: ["ACTIVE", "LAPSED"],
        },
      },
      include: { client: true },
    });

    for (const policy of overduePolicies) {
      const title = `OVERDUE: ${policy.policyName} (${policy.policyNumber})`;
      const existing = await prisma.reminder.findFirst({
        where: {
          clientId: policy.clientId,
          type: "PREMIUM_OVERDUE",
          dueDate: policy.dueDate,
        },
      });

      if (!existing) {
        await prisma.reminder.create({
          data: {
            clientId: policy.clientId,
            type: "PREMIUM_OVERDUE",
            title,
            description: `OVERDUE premium of ${policy.premiumAmount} was due on ${new Date(policy.dueDate).toDateString()} for client ${policy.client.name}.`,
            dueDate: policy.dueDate,
            isRead: false,
          },
        });
        generatedCount++;
      }
    }

    // 3. Birthdays in the next 7 days
    const allClients = await prisma.client.findMany({
      where: {
        dateOfBirth: {
          not: null,
        },
      },
    });

    for (const client of allClients) {
      if (!client.dateOfBirth) continue;
      const dob = new Date(client.dateOfBirth);
      const bdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      
      // Check if birthday falls in [today, next7Days]
      if (bdayThisYear >= today && bdayThisYear <= next7Days) {
        const title = `Birthday: ${client.name}`;
        const existing = await prisma.reminder.findFirst({
          where: {
            clientId: client.id,
            type: "BIRTHDAY",
            dueDate: bdayThisYear,
          },
        });

        if (!existing) {
          await prisma.reminder.create({
            data: {
              clientId: client.id,
              type: "BIRTHDAY",
              title,
              description: `Wish ${client.name} a Happy Birthday on +91 ${client.phone}!`,
              dueDate: bdayThisYear,
              isRead: false,
            },
          });
          generatedCount++;
        }
      }
    }

    // 4. Maturities in next 60 days
    const activePoliciesMatureSoon = await prisma.policy.findMany({
      where: {
        status: "ACTIVE",
        maturityDate: {
          gte: today,
          lte: next60Days,
        },
      },
      include: { client: true },
    });

    for (const policy of activePoliciesMatureSoon) {
      if (!policy.maturityDate) continue;
      const title = `Policy Maturity: ${policy.policyName} (${policy.policyNumber})`;
      const existing = await prisma.reminder.findFirst({
        where: {
          clientId: policy.clientId,
          type: "POLICY_MATURITY",
          dueDate: policy.maturityDate,
        },
      });

      if (!existing) {
        await prisma.reminder.create({
          data: {
            clientId: policy.clientId,
            type: "POLICY_MATURITY",
            title,
            description: `Policy ${policy.policyName} (${policy.policyNumber}) is maturing on ${new Date(policy.maturityDate).toDateString()}! Check payouts.`,
            dueDate: policy.maturityDate,
            isRead: false,
          },
        });
        generatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully auto-generated ${generatedCount} reminders.`,
      generatedCount,
    });
  } catch (error: any) {
    console.error("Auto-generate reminders API error:", error);
    return NextResponse.json(
      { error: "Failed to generate reminders" },
      { status: 500 }
    );
  }
}
