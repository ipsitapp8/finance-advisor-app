import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export type UserRole = "ADMIN" | "VIEWER";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Check if user is authenticated
 */
export async function requireAuth(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return null;
  }

  return session.user as SessionUser;
}

/**
 * Check if user has required role
 */
export function hasRole(user: SessionUser, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(user.role);
}

/**
 * Require specific role(s) - returns error response if not authorized
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const user = await requireAuth();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      ),
    };
  }

  if (!hasRole(user, allowedRoles)) {
    return {
      error: NextResponse.json(
        { error: "Forbidden. You don't have permission to perform this action." },
        { status: 403 }
      ),
    };
  }

  return { user };
}

/**
 * Check if user can perform write operations
 */
export function canWrite(user: SessionUser): boolean {
  return user.role === "ADMIN";
}

/**
 * Check if user can only read
 */
export function canOnlyRead(user: SessionUser): boolean {
  return user.role === "VIEWER";
}

/**
 * Unauthorized response helper
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized. Please login." },
    { status: 401 }
  );
}

/**
 * Forbidden response helper
 */
export function forbiddenResponse() {
  return NextResponse.json(
    { error: "Forbidden. You don't have permission to perform this action." },
    { status: 403 }
  );
}
