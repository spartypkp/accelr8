import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { extractParams, getRouteConfig } from '../auth/routes-config';

export async function updateSession(request: NextRequest) {
	// Create response we'll modify as needed
	let response = NextResponse.next({
		request,
	});

	// Create Supabase client with proper cookie handling
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// Automatic session handling by Supabase
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const pathname = request.nextUrl.pathname;

	// Skip auth for static files and API routes
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/images') ||
		pathname.startsWith('/fonts') ||
		pathname.includes('.') ||
		pathname.startsWith('/api/')
	) {
		return response;
	}

	// Get route configuration
	const routeConfig = getRouteConfig(pathname);

	// Allow public routes
	if (!routeConfig || routeConfig.public) {
		return response;
	}

	// If no user and route requires auth, redirect to login
	if (!user) {
		const url = new URL('/login', request.url);
		url.searchParams.set('redirectTo', pathname);
		return NextResponse.redirect(url);
	}

	// Enhanced handling for dashboard entry point
	if (pathname === '/dashboard') {
		const url = new URL(request.url);
		const userRole = user.user_metadata?.role || 'resident';

		// For residents, redirect to their house dashboard
		if (userRole === 'resident') {
			try {
				// Get user's active residency
				const { data: residency } = await supabase
					.from('residencies')
					.select('sanity_house_id')
					.eq('user_id', user.id)
					.eq('status', 'active')
					.maybeSingle();

				if (residency?.sanity_house_id) {
					url.pathname = `/dashboard/${residency.sanity_house_id}`;
				} else {
					// Resident without active house - redirect to houses page with message
					url.pathname = '/houses';
					url.searchParams.set('status', 'no_active_house');
				}
				return NextResponse.redirect(url);
			} catch (error) {
				console.error('Error fetching residency:', error);
			}
		}

		// For admins, redirect to admin dashboard (either first house or global)
		else if (userRole === 'admin') {
			try {
				// Get houses managed by admin
				const { data: houses } = await supabase
					.from('house_admins')
					.select('sanity_house_id')
					.eq('user_id', user.id)
					.limit(1);

				if (houses && houses.length > 0) {
					url.pathname = `/admin/${houses[0].sanity_house_id}`;
				} else {
					url.pathname = '/admin';
				}
				return NextResponse.redirect(url);
			} catch (error) {
				console.error('Error fetching admin houses:', error);
			}
		}

		// For super_admins, redirect to admin overview
		else if (userRole === 'super_admin') {
			url.pathname = '/admin';
			return NextResponse.redirect(url);
		}
	}

	// For protected routes, check role permissions
	if (routeConfig.role) {
		const userRole = user.user_metadata?.role || 'resident';
		const roleHierarchy = { resident: 1, admin: 2, super_admin: 3 };

		if (roleHierarchy[userRole] < roleHierarchy[routeConfig.role]) {
			return NextResponse.redirect(
				new URL(routeConfig.fallbackUrl || '/dashboard', request.url)
			);
		}
	}

	// Check house access if needed
	if (routeConfig.checkHouseAccess) {
		const params = extractParams(routeConfig.path, pathname);
		const houseId = params.houseId;

		if (houseId) {
			// Super admins have access to all houses
			const userRole = user.user_metadata?.role || 'resident';
			if (userRole === 'super_admin') {
				return response;
			}

			// Cache the access check in a cookie for 5 minutes to avoid db queries on every page
			const cacheKey = `house_access:${user.id}:${houseId}`;
			const cachedAccess = request.cookies.get(cacheKey)?.value;

			if (cachedAccess === 'true') {
				return response;
			}

			try {
				// Determine the correct table based on user role
				const table = userRole === 'admin' ? 'house_admins' : 'residencies';

				// Minimal query - just get ID for efficiency
				const { data, error } = await supabase
					.from(table)
					.select('id')
					.eq('user_id', user.id)
					.eq('sanity_house_id', houseId)
					.maybeSingle();

				if (!data) {
					return NextResponse.redirect(
						new URL(routeConfig.fallbackUrl || '/dashboard', request.url)
					);
				}

				// Cache the positive result
				response.cookies.set(cacheKey, 'true', {
					maxAge: 300, // 5 minutes
					path: '/',
				});
			} catch (error) {
				console.error('Error checking house access:', error);
				return NextResponse.redirect(
					new URL(routeConfig.fallbackUrl || '/dashboard', request.url)
				);
			}
		}
	}

	return response;
}