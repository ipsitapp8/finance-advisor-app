import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId") || "";

    const documents = await prisma.document.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: {
          select: { name: true },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error("Documents GET API error:", error);
    return NextResponse.json({ error: "Failed to list documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;
    const customName = formData.get("name") as string;

    if (!file || !clientId) {
      return NextResponse.json({ error: "File and Client ID are required" }, { status: 400 });
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Generate directory path: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Ignore if dir already exists
    }

    // Unique filename
    const bytes = await file.arrayBuffer();
    const textDecoder = new TextDecoder();
    const buffer = Buffer.from(bytes);
    const originalExt = path.extname(file.name);
    const uniqueFilename = `${clientId}-${Date.now()}${originalExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const fileUrl = `/uploads/${uniqueFilename}`;

    // Write file
    await writeFile(filePath, buffer);

    // Save in database
    const document = await prisma.document.create({
      data: {
        name: customName || file.name,
        fileUrl,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        clientId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error("Document upload API error:", error);
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
