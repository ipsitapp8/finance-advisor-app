import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  dateOfBirth: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const policySchema = z.object({
  policyNumber: z.string().min(1, "Policy number is required"),
  policyType: z.enum([
    "LIC",
    "MUTUAL_FUND",
    "HEALTH_INSURANCE",
    "TERM_INSURANCE",
    "ULIP",
    "PENSION",
    "CHILD_PLAN",
    "OTHER",
  ]),
  policyName: z.string().min(2, "Policy name is required"),
  premiumAmount: z.preprocess((val) => Number(val), z.number().positive("Premium amount must be positive")),
  premiumFreq: z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "ANNUAL", "ONE_TIME"]),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  maturityDate: z.string().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "LAPSED", "MATURED", "SURRENDERED", "PENDING"]).default("ACTIVE"),
  sumAssured: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().positive("Sum assured must be positive").optional()
  ),
  notes: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});
