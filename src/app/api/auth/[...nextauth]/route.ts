import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { testDatabaseConnection } from "@/lib/prisma";
import { userService } from "@/lib/data/dataService";

// For fallback if database is not available
const mockUsers = [
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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if database is available
          const isDbConnected = await testDatabaseConnection();
          
          if (isDbConnected) {
            // Use database for authentication
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            });
            
            if (!user || !user.password) {
              return null;
            }
            
            const isPasswordValid = await compare(credentials.password, user.password);
            
            if (!isPasswordValid) {
              return null;
            }
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          } else {
            // Use mock users as fallback
            const user = mockUsers.find(user => user.email === credentials.email);
            
            if (!user || user.password !== credentials.password) {
              return null;
            }
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
          // Use mock users as fallback if there's an error
          const user = mockUsers.find(user => user.email === credentials.email);
          
          if (!user || user.password !== credentials.password) {
            return null;
          }
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
      }
    })
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
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };