// Simple JWT-like token implementation
// In production, use a proper JWT library like 'jsonwebtoken'

import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface TokenPayload {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Create a simple token (in production, use proper JWT)
 */
export function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 hours expiration
  };
  const body = btoa(JSON.stringify(tokenPayload));
  const signature = btoa(SECRET_KEY + body); // Simplified - not real HMAC

  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode a token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash using bcrypt
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random token for verification or password reset
 */
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
