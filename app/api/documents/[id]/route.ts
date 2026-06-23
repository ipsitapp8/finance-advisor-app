import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Try deleting from local filesystem
    try {
      if (document.fileUrl.startsWith("/uploads/")) {
        const filepath = path.join(
          process.cwd(),
          "public",
          document.fileUrl.substring(1) // remove leading slash
        );
        await unlink(filepath);
      }
    } catch (fsErr) {
      console.warn("Could not delete physical file from storage, proceeding with DB deletion", fsErr);
    }

    // Delete DB record
    await prisma.document.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Document DELETE API error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
