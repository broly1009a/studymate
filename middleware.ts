import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/pricing'];


const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isAuthenticated = !!token;
  
 
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));
  
 
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  

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

