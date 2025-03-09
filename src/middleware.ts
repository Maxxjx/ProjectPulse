import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login';
  
  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  });
  
  // Redirect authenticated users away from public paths
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect unauthenticated users to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // (Ensure role-based rules remain enforced by checking session data in your dashboard pages)
  // For example, you can later extend this middleware to validate token.role before allowing access.
  
  return NextResponse.next();
}

// Apply the middleware to specific paths
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};