import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";
import { validatePasswordStrength } from "@/lib/password-validator";
import { logAuditEvent, getAuditInfo } from "@/lib/audit-log";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate new password strength
    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        {
          error: "Password does not meet security requirements",
          feedback: passwordCheck.feedback,
        },
        { status: 400 }
      );
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      dbUser.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Audit log
    const auditInfo = getAuditInfo(req);
    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: "LOGOUT", // Consider password change as security event
      details: { reason: "password_changed" },
      ...auditInfo,
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
