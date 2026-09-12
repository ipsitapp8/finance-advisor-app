import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export function rateLimit(options: RateLimitOptions) {
  return {
    check: (limit: number, token: string): boolean => {
      const now = Date.now();
      const tokenData = rateLimitMap.get(token);

      if (!tokenData || now > tokenData.resetTime) {
        // First request or reset time passed
        rateLimitMap.set(token, {
          count: 1,
          resetTime: now + options.interval,
        });
        return true;
      }

      if (tokenData.count >= limit) {
        // Rate limit exceeded
        return false;
      }

      // Increment count
      tokenData.count++;
      return true;
    },
  };
}

// Login rate limiter: 5 attempts per 15 minutes per IP
export const loginRateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

// API rate limiter: 100 requests per minute per IP
export const apiRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// Helper to get client IP
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return "unknown";
}

// Helper to create rate limit error response
export function rateLimitError(retryAfter: number = 900) {
  return NextResponse.json(
    { 
      error: "Too many requests. Please try again later.",
      retryAfter 
    },
    { 
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
      }
    }
  );
}
