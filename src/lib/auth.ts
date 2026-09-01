import { cookies } from 'next/headers';

const DEMO_EMAIL = 'admin@autovizibil.demo';
const DEMO_PASSWORD = 'demo123';
const SESSION_COOKIE = 'av_session';

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === 'authenticated';
}

export function validateCredentials(email: string, password: string): boolean {
  return email === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export { SESSION_COOKIE };
