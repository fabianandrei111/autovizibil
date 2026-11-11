import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Credentials from environment variables
// WARNING: In production, ALWAYS set ADMIN_EMAIL and ADMIN_PASSWORD env vars
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? '' : 'admin@autovizibil.ro');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'admin123');
const SESSION_COOKIE = 'av_session';

// Session tokens store (in production, use Redis or DB)
const validSessions = new Set<string>();

export function generateSessionToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  validSessions.add(token);
  return token;
}

export function invalidateSession(token: string): void {
  validSessions.delete(token);
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return validSessions.has(token);
}

export function validateCredentials(email: string, password: string): boolean {
  // Constant-time comparison to prevent timing attacks
  const emailMatch = crypto.timingSafeEqual(
    Buffer.from(email.toLowerCase()),
    Buffer.from(ADMIN_EMAIL.toLowerCase())
  );
  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password),
    Buffer.from(ADMIN_PASSWORD)
  );
  return emailMatch && passMatch;
}

// --- Rate limiter (in-memory, per-IP) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }
  entry.count++;
  if (entry.count > maxRequests) {
    return false; // blocked
  }
  return true; // allowed
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Prea multe incercari. Te rugam sa astepti un minut.' },
    { status: 429 }
  );
}

// --- Admin auth guard for API routes ---
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !validSessions.has(token)) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }
  return null; // authorized
}

// --- Input sanitization ---
export function sanitizeString(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export function sanitizeHtml(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Strip dangerous tags/attributes for blog content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*\S+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '');
}

export { SESSION_COOKIE };
