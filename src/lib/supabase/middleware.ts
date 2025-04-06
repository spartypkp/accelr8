import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

	// All authentication checks passed for non-specific routes
	if (!pathname.match(/\/dashboard\/([^\/]+)(\/.*)?/)) {
		return response;
	}

	// Extract houseId from the path
	const dashboardPathRegex = /\/dashboard\/([^\/]+)(\/.*)?/;
	const match = pathname.match(dashboardPathRegex);
	const houseId = match ? match[1] : null;

	if (!houseId) {
		return response;
	}


	const userRole = user.user_metadata.role;

	// Super admins can access everything
	if (userRole === 'super_admin') {
		return response;
	}

	// Check if this is an admin route
	const isAdminRoute = pathname.includes(`/dashboard/${houseId}/admin`);

	// Admin routes - only accessible by admins
	if (isAdminRoute && userRole !== 'admin' && userRole !== 'super_admin') {
		return NextResponse.redirect(new URL(`/dashboard/${houseId}/resident`, request.url));
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
		return NextResponse.redirect(new URL('/houses', request.url));
	}

	return response;
}