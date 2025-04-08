import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { UserRole } from '../types';

// Role hierarchy for permission checks
// Higher number = more permissions
const roleHierarchy: Record<UserRole, number> = {
	applicant: 0,
	resident: 1,
	admin: 2,
	super_admin: 3
};

// Check if user has sufficient permissions
function hasRolePermission(userRole: UserRole, requiredRole?: UserRole): boolean {
	if (!requiredRole) return true;
	return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function updateSession(request: NextRequest) {
	// Create a response object that we'll modify
	const response = NextResponse.next({
		request,
	});

	// Create Supabase client with cookies
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name) {
					return request.cookies.get(name)?.value;
				},
				set(name, value, options) {
					// Set cookie for both the request and response
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name, options) {
					// Remove cookie by setting empty value with expiration
					response.cookies.set({
						name,
						value: '',
						...options,
					});
				},
			},
		}
	);

	// Get user session data
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const pathname = request.nextUrl.pathname;

	// Skip auth checks for static files and API routes
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/images') ||
		pathname.startsWith('/fonts') ||
		pathname.includes('.') ||
		pathname.startsWith('/api/')
	) {
		return response;
	}

	// Allow public routes (anything not under /dashboard)
	if (!pathname.startsWith('/dashboard')) {
		return response;
	}

	// If no user and trying to access dashboard, redirect to login
	if (!user) {
		const redirectUrl = new URL('/login', request.url);
		redirectUrl.searchParams.set('redirectTo', pathname);
		return NextResponse.redirect(redirectUrl);
	}

	// Get user role with default as applicant
	const userRole = (user.user_metadata?.role || 'applicant') as UserRole;

	// Handle application-specific routes
	if (pathname.startsWith('/dashboard/applications')) {
		// Everyone can access applications routes
		return response;
	}

	// Handle profile and settings routes
	if (pathname === '/dashboard/profile' || pathname === '/dashboard/settings') {
		// All authenticated users can access profile and settings
		return response;
	}

	// Check for house-specific routes
	const dashboardPathRegex = /\/dashboard\/([^\/]+)(\/.*)?/;
	const match = pathname.match(dashboardPathRegex);

	// Just the main dashboard route
	if (!match) {
		return response;
	}

	const houseId = match[1];

	if (!houseId) {
		return response;
	}

	// Super admins can access everything
	if (userRole === 'super_admin') {
		return response;
	}

	// Check if this is an admin route
	const isAdminRoute = pathname.includes(`/dashboard/${houseId}/admin`);

	// Admin routes - only accessible by admins
	if (isAdminRoute && !hasRolePermission(userRole, 'admin')) {
		return NextResponse.redirect(new URL(`/dashboard/${houseId}/resident`, request.url));
	}

	// Applicants cannot access house-specific routes except in read-only mode
	if (userRole === 'applicant') {
		// For now, redirect applicants back to the main dashboard
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Check if user has access to this specific house
	let userHasAccess = false;

	try {
		if (userRole === 'resident') {
			// Check residency record
			const { data: residency } = await supabase
				.from('residencies')
				.select('id')
				.eq('user_id', user.id)
				.eq('sanity_house_id', houseId)
				.eq('status', 'active')
				.maybeSingle();

			userHasAccess = !!residency;
		} else if (userRole === 'admin') {
			// Check admin access record
			const { data: adminAccess } = await supabase
				.from('house_admins')
				.select('id')
				.eq('user_id', user.id)
				.eq('sanity_house_id', houseId)
				.maybeSingle();

			userHasAccess = !!adminAccess;
		}
	} catch (error) {
		console.error('Error checking house access:', error);
	}

	// If no access, redirect to houses selection page
	if (!userHasAccess) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return response;
}