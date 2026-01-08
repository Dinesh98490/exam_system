import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import { Role, hasRole } from '@/lib/rbac-definitions';

const PROTECTED_ROUTES = [
  { path: '/admin', role: Role.ADMIN },
  { path: '/dashboard/admin', role: Role.ADMIN },
  { path: '/dashboard/lecturer', role: Role.LECTURER },
  { path: '/dashboard/student', role: Role.STUDENT },
  { path: '/api/exams', role: Role.STUDENT },
];

const PUBLIC_ROUTES = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/webhooks'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
const isPublic = path === '/' || PUBLIC_ROUTES.some(r => path.startsWith(r));

  if (isPublic) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    return response;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  try {
    const payload = await decrypt(sessionToken);

    const protectedRoute = PROTECTED_ROUTES.find(r => path.startsWith(r.path));
    if (protectedRoute) {
        if (!hasRole(payload.role as Role, protectedRoute.role)) {
            // Redirect to login or unauthorized page to prevent loop
            const url = new URL('/login', req.nextUrl);
            url.searchParams.set('error', 'Unauthorized');
            return NextResponse.redirect(url);
        }
    }
    
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    return response;
  } catch {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
