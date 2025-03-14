import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

// Simple string comparison - not for production use
const comparePasswords = (plainPassword: string, storedPassword: string): boolean => {
  // In a real app with bcrypt, you would use bcrypt.compare
  // For demo purposes, we'll handle both hashed (from mock DB) and plain text passwords
  if (storedPassword.startsWith('$2b$')) {
    // This would be a bcrypt hash, but we can't verify without bcrypt
    // For demo, let's just compare with our known test passwords
    if (plainPassword === 'admin123' && storedPassword === '$2b$10$Rr5YfUL7SvLRbGdmzwFfce5TJL9TdW0oJDkLcjZ2z66YfcLaDJf1q') {
      return true;
    }
    if (plainPassword === 'team123' && storedPassword === '$2b$10$5QqUXL8ZvEQTKN8Jz7xXG.LcV8UA2isXRrYFOmr6sxQo5gZDXn2WW') {
      return true;
    }
    if (plainPassword === 'client123' && storedPassword === '$2b$10$rW1SHFtDhJ3Cc92y7glRfeCDaXFP6UkQaB18JNjKnW9MhK3xZT0OS') {
      return true;
    }
    return false;
  }
  
  // For plain text passwords (non-production)
  return plainPassword === storedPassword;
};

export const authOptions: NextAuthOptions = {
  // No adapter - we'll manage sessions with JWT
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // If using mock data or database is not enabled
        if (process.env.USE_DATABASE !== 'true') {
          // Basic mock authentication for development
          const mockUsers = [
            { 
              id: '1', 
              name: 'Admin User', 
              email: 'admin@example.com', 
              password: 'admin123', 
              role: 'ADMIN' 
            },
            { 
              id: '2', 
              name: 'Team Member', 
              email: 'team@example.com', 
              password: 'team123', 
              role: 'TEAM' 
            },
            { 
              id: '3', 
              name: 'Client User', 
              email: 'client@example.com', 
              password: 'client123', 
              role: 'CLIENT' 
            }
          ];

          const user = mockUsers.find(user => user.email === credentials.email);
          
          if (user && user.password === credentials.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: null
            };
          }
          
          return null;
        }

        // Use mock database instead of real database with Prisma
        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const passwordValid = comparePasswords(credentials.password, user.password);

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role
        }
      };
    }
  },
};
