import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { LAUNCH_CONFIG } from '@/config/launch.config';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/coming-soon',
  '/about',
  '/courses',
  '/bootcamps',
  '/partnerships',
];

// Define auth routes (login, register, etc.)
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Routes that should be accessible even when authenticated
const alwaysAccessibleAuthRoutes = [
  '/verify-email',
];

// Define role-based route access
const roleRoutes = {
  student: ['/student'],
  mentor: ['/mentor'],
  college: ['/college'],
  employer: ['/employer'],
  ops: ['/admin'],
  super_admin: ['/admin'],
} as const;

/**
 * Check if user is authenticated
 * Only call backend if we have both cookies
 */
async function checkAuth(request: NextRequest): Promise<{ isAuthenticated: boolean; user: any | null }> {
  try {
    // Check if we have the necessary cookies
    const refreshToken = request.cookies.get('refreshToken');
    const accessToken = request.cookies.get('access_token');

    // If no cookies at all, definitely not authenticated
    if (!refreshToken && !accessToken) {
      return { isAuthenticated: false, user: null };
    }

    // Try to get user profile from backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002/api/v1';
    const cookies = request.cookies.toString();

    const response = await fetch(`${backendUrl}${API_ENDPOINTS.auth.profile}`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.user) {
        return {
          isAuthenticated: true,
          user: data.data.user,
        };
      }
    }

    // Profile fetch failed - not authenticated
    return { isAuthenticated: false, user: null };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}

function getTargetRoleFromPath(pathname: string): string | null {
  if (pathname.includes('/student')) return 'student';
  if (pathname.includes('/mentor')) return 'mentor';
  if (pathname.includes('/college')) return 'college';
  if (pathname.includes('/employer')) return 'employer';
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Coming Soon Strict Mode: Redirect all pages to / when in coming-soon mode
  if (
    LAUNCH_CONFIG.IS_COMING_SOON_MODE &&
    pathname !== '/' &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api') &&
    !pathname.includes('.')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check authentication status
  const { isAuthenticated, user } = await checkAuth(request);
  const userRole = user?.role as keyof typeof roleRoutes | undefined;
  const isEmailVerified = user?.isEmailVerified ?? false;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';  // Exact match for home
    }
    return pathname.startsWith(route);
  });

  // Check if route is auth route (login, register, etc.)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isAlwaysAccessibleAuthRoute = alwaysAccessibleAuthRoutes.some(route => pathname.startsWith(route));

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow verify-email page even for authenticated users (they may not have verified yet)
  if (isAlwaysAccessibleAuthRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated but unverified users away from REGISTER pages to verify-email
  // But allow them to access LOGIN pages (they might want to logout or use a different account)
  if (pathname.startsWith('/register') && isAuthenticated && !isEmailVerified) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  // For authenticated + verified users visiting an auth page:
  // - If visiting their OWN role's login page → redirect to their dashboard (or callbackUrl)
  // - If visiting a DIFFERENT role's login page → ALLOW the page to render so that
  //   AuthPageLayout can show the "Account Conflict" modal with Logout & Switch option.
  if (isAuthRoute && isAuthenticated && isEmailVerified && userRole) {
    const targetRole = getTargetRoleFromPath(pathname);

    // Only auto-redirect for their own portal or generic auth routes (no role in path)
    if (targetRole === null || targetRole === userRole) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');

      if (callbackUrl && callbackUrl !== '/') {
        return NextResponse.redirect(new URL(callbackUrl, request.url));
      }

      const dashboardRoute = roleRoutes[userRole]?.[0] || '/';
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }
    // Different role portal → fall through and let the page render (conflict modal will show)
  }

  // Allow auth routes for non-authenticated users
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Protect all dashboard routes - require authentication
  const isDashboardRoute = Object.values(roleRoutes).some(routes =>
    routes.some(route => pathname.startsWith(route))
  );

  if (isDashboardRoute) {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      // Determine which login page based on the route
      let loginRoute = '/login/student'; // default

      if (pathname.startsWith('/student')) loginRoute = '/login/student';
      else if (pathname.startsWith('/mentor')) loginRoute = '/login/mentor';
      else if (pathname.startsWith('/college')) loginRoute = '/login/college';
      else if (pathname.startsWith('/employer')) loginRoute = '/login/employer';
      else if (pathname.startsWith('/admin')) loginRoute = '/login/super_admin';

      const loginUrl = new URL(loginRoute, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but email not verified - redirect to verify-email
    if (!isEmailVerified) {
      const verifyUrl = new URL('/verify-email', request.url);
      if (user?.email) {
        verifyUrl.searchParams.set('email', user.email);
      }
      return NextResponse.redirect(verifyUrl);
    }

    // Must have user role to access dashboard
    if (!userRole) {
      // No user role - redirect to login
      const loginUrl = new URL('/login/student', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Special check for ambassador routes under student dashboard
    if (pathname.startsWith('/student/ambassador')) {
      if (userRole !== 'student') {
        const userDashboard = roleRoutes[userRole]?.[0] || '/';
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
      if (!user?.isAmbassador) {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
      }
    }

    // Check if user has access to this dashboard
    const allowedRoutes = roleRoutes[userRole];
    const hasAccess = allowedRoutes?.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      // User trying to access wrong dashboard - redirect to their own
      const userDashboard = allowedRoutes?.[0] || '/';
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
