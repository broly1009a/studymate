import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/api/auth';

/**
 * Middleware to verify authentication for protected API routes
 * Usage: Add this to route handlers that require authentication
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const token = extractTokenFromHeader(request.headers.get('authorization'));

      if (!token) {
        return NextResponse.json(
          { error: 'Missing authorization token' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Add decoded token to request for use in handler
      // Note: In a real implementation, you'd extend the NextRequest type
      (request as any).user = decoded;

      return handler(request);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware to check user role
 */
export function withRole(...roles: string[]) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      try {
        const token = extractTokenFromHeader(request.headers.get('authorization'));

        if (!token) {
          return NextResponse.json(
            { error: 'Missing authorization token' },
            { status: 401 }
          );
        }

        const decoded = verifyToken(token);

        if (!decoded) {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          );
        }

        if (!roles.includes(decoded.role)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }

        (request as any).user = decoded;

        return handler(request);
      } catch (error) {
        console.error('Role middleware error:', error);
        return NextResponse.json(
          { error: 'Authorization failed' },
          { status: 403 }
        );
      }
    };
  };
}
