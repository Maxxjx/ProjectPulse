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
    role: "USER"  // Updated to uppercase
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@projectpulse.com",
    password: "admin1234",
    role: "ADMIN"  // Updated to uppercase
  },
  {
    id: "3",
    name: "Team Member",
    email: "team@projectpulse.com",
    password: "team1234",
    role: "TEAM"  // Updated to uppercase
  },
  {
    id: "4",
    name: "Client User",
    email: "client@projectpulse.com",
    password: "client1234",
    role: "CLIENT"  // Updated to uppercase
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
          const isDbConnected = await testDatabaseConnection();
          console.log('Database connection:', isDbConnected);
          
          if (isDbConnected) {
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            });
            console.log('User found:', user ? 'yes' : 'no');
            
            if (!user || !user.password) {
              return null;
            }

            // Add debug logging to see the password comparison
            console.log('Attempting to validate password');
            console.log('Input password:', credentials.password);
            console.log('Stored password hash:', user.password);
            
            const isPasswordValid = await compare(credentials.password, user.password);
            console.log('Password validation result:', isPasswordValid);
            
            if (!isPasswordValid) {
              console.log('Password validation failed');
              return null;
            }
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role.toUpperCase() // Make sure role is uppercase
            };
          } else {
            // For mock users, use plain text comparison
            const user = mockUsers.find(user => user.email === credentials.email);
            
            if (!user || user.password !== credentials.password) {
              return null;
            }
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role.toUpperCase() // Make sure role is uppercase
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
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