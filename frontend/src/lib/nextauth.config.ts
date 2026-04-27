import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001/api/v1";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            credentials: "include",
          });

          const data = await res.json();

          if (!res.ok) {
            // Check if error is due to unverified email (403 with EMAIL_NOT_VERIFIED)
            if (res.status === 403 && data.error?.code === "EMAIL_NOT_VERIFIED") {
              // Throw special error with email for frontend to handle
              throw new Error(`EMAIL_NOT_VERIFIED:${credentials.email}`);
            }
            
            throw new Error(data.error?.message || "Authentication failed");
          }

          if (data.success && data.data?.user) {
            // Return user object with all necessary data
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.fullName,
              role: data.data.user.role,
              phone: data.data.user.phone,
              isEmailVerified: data.data.user.isEmailVerified,
              // Add more fields as needed from backend response
              // avatar: data.data.user.avatar,
              // bio: data.data.user.bio,
            };
          }

          return null;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token on sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "student" | "college" | "employer" | "mentor";
        session.user.phone = token.phone as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after sign in (GC-41)
      // This will be used for role-based redirects
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login/student", // Default login page
    error: "/login/student", // Error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug logs in production
};
