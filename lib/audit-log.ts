import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE_CLIENT"
  | "UPDATE_CLIENT"
  | "DELETE_CLIENT"
  | "VIEW_CLIENT"
  | "CREATE_POLICY"
  | "UPDATE_POLICY"
  | "DELETE_POLICY"
  | "UPLOAD_DOCUMENT"
  | "DELETE_DOCUMENT"
  | "CREATE_REMINDER"
  | "UPDATE_REMINDER"
  | "DELETE_REMINDER";

export interface AuditLogEntry {
  userId: string;
  userEmail: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 * For now, we'll log to console. In production, you'd store in database.
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    ...entry,
  };

  // Console logging for development
  console.log("[AUDIT]", JSON.stringify(logEntry, null, 2));

  // TODO: Store in database when AuditLog model is added to schema
  // await prisma.auditLog.create({ data: logEntry });
}

/**
 * Helper to extract audit info from request
 */
export function getAuditInfo(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") || "unknown";

  let ipAddress = "unknown";
  if (forwarded) {
    ipAddress = forwarded.split(",")[0].trim();
  } else if (realIp) {
    ipAddress = realIp;
  }

  return { ipAddress, userAgent };
}

/**
 * Sanitize data for audit logs (remove sensitive fields)
 */
export function sanitizeForAudit(data: any): any {
  if (!data || typeof data !== "object") {
    return data;
  }

  const sensitiveFields = ["password", "token", "secret", "apiKey", "creditCard"];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
}
