import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/pricing'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookie or header
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isAuthenticated = !!token;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // If authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

