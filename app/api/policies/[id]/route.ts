import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const policy = await prisma.policy.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: { id: true, name: true, phone: true, email: true },
        },
      },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    return NextResponse.json(policy);
  } catch (error: any) {
    console.error("Policy GET ID error:", error);
    return NextResponse.json({ error: "Failed to load policy file" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const policy = await prisma.policy.findUnique({
      where: { id: params.id },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    await prisma.policy.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Policy deleted successfully" });
  } catch (error: any) {
    console.error("Policy DELETE ID error:", error);
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 });
  }
}
