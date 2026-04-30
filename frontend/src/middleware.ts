import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/courses',
  '/bootcamps',
  '/partnerships',
];

// Define auth routes (login, register, etc.)
const authRoutes = [
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

// Define role-based route access
const roleRoutes = {
  student: ['/student'],
  mentor: ['/mentor'],
  college: ['/college'],
  employer: ['/employer'],
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api/v1';
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication status
  const { isAuthenticated, user } = await checkAuth(request);
  const userRole = user?.role as keyof typeof roleRoutes | undefined;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';  // Exact match for home
    }
    return pathname.startsWith(route);
  });
  
  // Check if route is auth route (login, register, etc.)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated && userRole) {
    const dashboardRoute = roleRoutes[userRole]?.[0] || '/';
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
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

      const loginUrl = new URL(loginRoute, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Must have user role to access dashboard
    if (!userRole) {
      // No user role - redirect to login
      const loginUrl = new URL('/login/student', request.url);
      return NextResponse.redirect(loginUrl);
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
