import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limiter';
import { hasRole } from '@/lib/rbac';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Security Headers Configuration
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    media-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. Rate Limiting for API routes
  if (pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const isAuthEndpoint = pathname.startsWith('/api/auth');
    const limit = isAuthEndpoint ? 20 : 150;
    const windowSecs = 60;

    const rateResult = await rateLimit(`${ip}:${isAuthEndpoint ? 'auth' : 'api'}`, limit, windowSecs);

    response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateResult.reset.toString());

    if (!rateResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down and try again later.' },
        { status: 429, headers: response.headers }
      );
    }
  }

  // 3. Authentication & Authorization Checks
  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  const accessToken = request.cookies.get('access_token')?.value;
  const session = accessToken ? await verifyToken(accessToken) : null;

  // Protect Dashboard & Admin routes
  if ((isDashboardRoute || isAdminRoute) && !session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from Auth login/register pages
  if (isAuthRoute && session && !pathname.includes('logout') && !pathname.includes('reset-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Enforce RBAC for Admin routes
  if (isAdminRoute && session) {
    if (!hasRole(session.role, 'admin') && !hasRole(session.role, 'super_admin')) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse('HTTP 403 Forbidden', { status: 403 });
      }
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }
  }

  // 4. CSRF Protection for mutating state API calls (POST, PUT, DELETE, PATCH)
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    const isPublicAuth = pathname.includes('/api/auth/login') || pathname.includes('/api/auth/register') || pathname.includes('/api/auth/forgot-password');

    if (!isPublicAuth && origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: 'CSRF validation failed: Invalid request origin' }, { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
