import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { JWT } from "jsonwebtoken";

// For simplicity in the demo, using clear text passwords that match the login form
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@projectpulse.com",
    password: "demo1234",
    role: "user"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@projectpulse.com",
    password: "admin1234",
    role: "admin"
  },
  {
    id: "3",
    name: "Team Member",
    email: "team@projectpulse.com",
    password: "team1234",
    role: "team"
  },
  {
    id: "4",
    name: "Client User",
    email: "client@projectpulse.com",
    password: "client1234",
    role: "client"
  }
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find(user => user.email === credentials.email);
        
        if (!user) {
          return null;
        }

        // For demo purposes, directly compare passwords instead of hashing
        const isPasswordValid = user.password === credentials.password;

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    // Proper session management: sessions last for 30 days and update every 24 hours
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    updateAge: 24 * 60 * 60    // 24 hours in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        // Include session expiry info for extra client-side security awareness
        session.expires = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString();
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    // Define custom page for password recovery/reset
    // (A separate reset-password route handles the actual flow)
    newUser: "/reset-password",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
});

export { handler as GET, handler as POST };