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

	// Define common route patterns for easier classification
	const isMainDashboard = pathname === '/dashboard';
	const isProfileRoute = pathname === '/dashboard/profile' || pathname === '/dashboard/settings';
	const isSuperAdminRoute = pathname.startsWith('/dashboard/superAdmin');
	const isApplicationRoute = pathname.startsWith('/dashboard/applications');

	// Main dashboard and profile routes accessible to all authenticated users
	if (isMainDashboard || isProfileRoute || isApplicationRoute) {
		return response;
	}

	// Super admin routes require super_admin role
	if (isSuperAdminRoute) {
		if (userRole !== 'super_admin') {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
		return response;
	}

	// Check for house-specific routes
	// We need to match patterns like /dashboard/[houseId]/admin or /dashboard/[houseId]/resident
	const dashboardPathRegex = /^\/dashboard\/([^\/]+)(\/.*)?$/;
	const match = pathname.match(dashboardPathRegex);

	if (!match) {
		// Unknown dashboard route - redirect to main dashboard
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	const houseId = match[1];
	const housePath = match[2] || '';

	// Ensure "superAdmin" is not treated as a houseId (although this should be caught by isSuperAdminRoute)
	if (houseId === 'superAdmin') {
		// Already handled by the earlier condition, but just in case
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Super admins can access all house routes
	if (userRole === 'super_admin') {
		return response;
	}

	// Check if this is an admin route for a house
	const isAdminRoute = housePath.startsWith('/admin');

	// Admin routes are only accessible by admins
	if (isAdminRoute && !hasRolePermission(userRole, 'admin')) {
		// Redirect non-admins to resident view
		return NextResponse.redirect(new URL(`/dashboard/${houseId}/resident`, request.url));
	}

	// Applicants cannot access house-specific routes
	if (userRole === 'applicant') {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// For residents and admins, check if they have access to this specific house
	let userHasAccess = false;

	try {
		// Debug logging
		console.log(`Checking house access: user=${user.id}, houseId=${houseId}, role=${userRole}`);

		if (userRole === 'resident') {
			// Check if user is a resident by looking at the rooms table
			const { data: roomAssignment, error } = await supabase
				.from('rooms')
				.select('id')
				.eq('current_resident_id', user.id)
				.eq('sanity_house_id', houseId)
				.maybeSingle();

			if (error) console.error('Error checking room assignment:', error);
			userHasAccess = !!roomAssignment;
			console.log(`Resident access check result: ${userHasAccess}`);
		} else if (userRole === 'admin' || userRole === 'super_admin') {
			// Admins and super admins have access to all houses
			userHasAccess = true;
			console.log(`Admin/SuperAdmin access granted automatically`);
		}
	} catch (error) {
		console.error('Error checking house access:', error);
	}

	// If no access, redirect to houses selection page
	if (!userHasAccess) {
		console.log(`Access denied to ${houseId} for user ${user.id}, redirecting to dashboard`);
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return response;
}