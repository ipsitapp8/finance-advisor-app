import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Demo/fallback credentials that work without a database
const DEMO_USERS = [
  {
    id: "demo-admin-001",
    email: "admin@pratikfinance.com",
    name: "Pratik Shah",
    password: "Admin@123",
    role: "ADMIN",
  },
  {
    id: "demo-viewer-001",
    email: "viewer@example.com",
    name: "Guest Viewer",
    password: "viewer123",
    role: "VIEWER",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Try database authentication first
        try {
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
            throw new Error("Invalid email address or password");
          }
        } catch (dbError: any) {
          // If it's an explicit invalid credentials error, re-throw it
          if (dbError?.message === "Invalid email address or password") {
            throw dbError;
          }
          // Otherwise DB is unavailable — fall through to demo login
          console.warn("Database unavailable, falling back to demo login");
        }

        // Fallback: check demo credentials
        const demoUser = DEMO_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (demoUser) {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          };
        }

        throw new Error("Invalid email address or password. Please try again.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
