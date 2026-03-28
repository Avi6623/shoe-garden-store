import { createHash } from "node:crypto";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const allowOpenSignup = process.env.ALLOW_OPEN_SIGNUP === "true";
const enableAdminBootstrap = process.env.ENABLE_ADMIN_BOOTSTRAP === "true";
const bootstrapAdminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.toLowerCase().trim();
const bootstrapAdminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const fallbackAuthSecret = createHash("sha256")
  .update(
    [
      process.env.NEXTAUTH_URL,
      process.env.VERCEL_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      "shoe-garden-store",
    ]
      .filter(Boolean)
      .join("|")
  )
  .digest("hex");
const authSecret = process.env.NEXTAUTH_SECRET || fallbackAuthSecret;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@shoegarden.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Optional one-time admin bootstrap for initial deployment setup.
          if (
            enableAdminBootstrap &&
            bootstrapAdminEmail &&
            bootstrapAdminPassword &&
            email === bootstrapAdminEmail &&
            password === bootstrapAdminPassword
          ) {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newAdmin = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                role: "ADMIN",
              },
            });
            return { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role };
          }

          if (allowOpenSignup) {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                role: "USER",
              },
            });
            return { id: newUser.id, email: newUser.email, role: newUser.role };
          }

          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: authSecret,
};
