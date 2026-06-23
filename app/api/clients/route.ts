import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { clientSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all"; // all, active, overdue, birthday
    const sort = searchParams.get("sort") || "name-asc"; // name-asc, newest, oldest

    // 1. Fetch all clients matching search criteria
    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    let clients = await prisma.client.findMany({
      where: searchCondition,
      include: {
        policies: {
          select: {
            id: true,
            status: true,
            dueDate: true,
            policyNumber: true,
          },
        },
        _count: {
          select: { policies: true },
        },
      },
      orderBy:
        sort === "newest"
          ? { createdAt: "desc" }
          : sort === "oldest"
          ? { createdAt: "asc" }
          : { name: "asc" },
    });

    const today = new Date();
    const currentMonth = today.getMonth();

    // 2. Client-side filtering because of SQLite portability restrictions on date components
    if (filter === "active") {
      // Clients with at least 1 active policy
      clients = clients.filter((c) =>
        c.policies.some((p) => p.status === "ACTIVE")
      );
    } else if (filter === "overdue") {
      // Clients with at least 1 lapsed policy or past-due active policy
      clients = clients.filter((c) =>
        c.policies.some(
          (p) =>
            p.status === "LAPSED" ||
            ((p.status === "ACTIVE" || p.status === "PENDING") && new Date(p.dueDate) < today)
        )
      );
    } else if (filter === "birthday") {
      // Clients with birthdays in current month
      clients = clients.filter((c) => {
        if (!c.dateOfBirth) return false;
        return new Date(c.dateOfBirth).getMonth() === currentMonth;
      });
    }

    // 3. Map clients to add calculated fields like nextPremiumDue
    const formattedClients = clients.map((c) => {
      // Find the earliest future premium due date among active policies
      const activePolicies = c.policies.filter((p) => p.status === "ACTIVE");
      let nextPremiumDue: Date | null = null;
      if (activePolicies.length > 0) {
        const sortedDueDates = activePolicies
          .map((p) => new Date(p.dueDate))
          .sort((a, b) => a.getTime() - b.getTime());
        nextPremiumDue = sortedDueDates[0] || null;
      }

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        address: c.address,
        dateOfBirth: c.dateOfBirth,
        notes: c.notes,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        activePoliciesCount: activePolicies.length,
        nextPremiumDue,
        _count: c._count,
      };
    });

    return NextResponse.json(formattedClients);
  } catch (error: any) {
    console.error("Clients GET API error:", error);
    return NextResponse.json({ error: "Failed to load clients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = clientSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid client fields", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, address, dateOfBirth, notes } = result.data;

    // Create client
    const newClient = await prisma.client.create({
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error("Clients POST API error:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
