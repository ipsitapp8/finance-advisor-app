import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validations";
import { requireAuth, requireRole } from "@/lib/rbac";
import { apiRateLimiter, getClientIp, rateLimitError } from "@/lib/rate-limit";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const rateLimitOk = apiRateLimiter.check(100, ip);
    if (!rateLimitOk) {
      return rateLimitError(60);
    }

    // Authentication check
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        policies: {
          orderBy: { startDate: "desc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
        reminders: {
          orderBy: { dueDate: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error: any) {
    console.error("Client GET ID error:", error);
    return NextResponse.json({ error: "Failed to load client profile" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const rateLimitOk = apiRateLimiter.check(20, ip);
    if (!rateLimitOk) {
      return rateLimitError(60);
    }

    // Role-based access control - only ADMIN can update clients
    const authResult = await requireRole(["ADMIN"]);
    if ("error" in authResult) {
      return authResult.error;
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

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error: any) {
    console.error("Client PUT ID error:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const rateLimitOk = apiRateLimiter.check(10, ip);
    if (!rateLimitOk) {
      return rateLimitError(60);
    }

    // Role-based access control - only ADMIN can delete clients
    const authResult = await requireRole(["ADMIN"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Delete client (policies, reminders, and documents will cascade delete)
    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error: any) {
    console.error("Client DELETE ID error:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
