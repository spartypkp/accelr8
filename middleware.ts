// import { extractParams, getRouteConfig } from '@/lib/auth/config';
// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
// 	// Create a response object that we'll modify as needed
// 	let response = NextResponse.next();

// 	// Create Supabase client
// 	const supabase = createServerClient(
// 		process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// 		{
// 			cookies: {
// 				get(name) {
// 					return request.cookies.get(name)?.value;
// 				},
// 				set(name, value, options) {
// 					// Convert Supabase cookie options to NextResponse format
// 					response.cookies.set({
// 						name,
// 						value,
// 						...options,
// 					});
// 				},
// 				remove(name, options) {
// 					response.cookies.delete({
// 						name,
// 						...options,
// 					});
// 				},
// 			},
// 		}
// 	);

// 	const pathname = request.nextUrl.pathname;

// 	// Allow public static files
// 	if (
// 		pathname.startsWith('/_next') ||
// 		pathname.startsWith('/images') ||
// 		pathname.startsWith('/fonts') ||
// 		pathname.includes('.')
// 	) {
// 		return response;
// 	}

// 	// Get route configuration
// 	const routeConfig = getRouteConfig(pathname);

// 	// If no route config found, or route is public, allow access
// 	if (!routeConfig || routeConfig.public) {
// 		return response;
// 	}

// 	// Get session and user
// 	const { data: { session } } = await supabase.auth.getSession();

// 	// If no session and route requires auth, redirect to login
// 	if (!session) {
// 		const redirectUrl = new URL('/login', request.url);
// 		// Store the original URL to redirect back after login
// 		redirectUrl.searchParams.set('redirectTo', pathname);
// 		return NextResponse.redirect(redirectUrl);
// 	}

// 	// If we have a session, get the user and their role
// 	const { data: { user } } = await supabase.auth.getUser();

// 	// Get user role from database if missing from metadata
// 	let userRole = user?.user_metadata?.role as string;

// 	if (!userRole) {
// 		try {
// 			const { data: userData, error } = await supabase
// 				.from('accelr8_users')
// 				.select('role')
// 				.eq('id', user?.id)
// 				.single();

// 			if (!error && userData) {
// 				userRole = userData.role;
// 			}
// 		} catch (error) {
// 			console.error('Error fetching user role:', error);
// 		}
// 	}

// 	// Default to resident role if none found
// 	if (!userRole) {
// 		userRole = 'resident';
// 	}

// 	// Check permission required for this route
// 	if (routeConfig.permission) {
// 		// Super admin has all permissions
// 		if (userRole === 'super_admin') {
// 			return response;
// 		}

// 		// For admin permissions, check if user is admin
// 		if (routeConfig.permission.startsWith('access_admin') ||
// 			routeConfig.permission.startsWith('manage_')) {
// 			if (userRole !== 'admin' && userRole !== 'super_admin') {
// 				// Redirect to fallback or dashboard if no permission
// 				return NextResponse.redirect(
// 					new URL(routeConfig.fallbackUrl || '/dashboard', request.url)
// 				);
// 			}
// 		}

// 		// If the route requires a resource check (e.g., for a specific house)
// 		if (routeConfig.requiresResourceCheck && routeConfig.resourceType === 'house') {
// 			// Extract the house ID from the path
// 			const params = extractParams(routeConfig.path, pathname);
// 			const houseId = params.houseId;

// 			if (houseId) {
// 				// Skip for super admins, they have access to all houses
// 				if (userRole === 'super_admin') {
// 					return response;
// 				}

// 				// For residents and admins, check house access
// 				try {
// 					// Determine the correct table based on user role
// 					const table = userRole === 'admin' ? 'house_admins' : 'residencies';

// 					const query = supabase
// 						.from(table)
// 						.select('*')
// 						.eq('user_id', user?.id)
// 						.eq('sanity_house_id', houseId);

// 					// Add status check for residents
// 					if (userRole === 'resident') {
// 						query.eq('status', 'active');
// 					}

// 					const { data, error } = await query.single();

// 					if (error || !data) {
// 						// User doesn't have access to this house
// 						return NextResponse.redirect(
// 							new URL(routeConfig.fallbackUrl || '/dashboard', request.url)
// 						);
// 					}
// 				} catch (error) {
// 					console.error('Error checking house access:', error);
// 					// On error, redirect to safe route
// 					return NextResponse.redirect(
// 						new URL(routeConfig.fallbackUrl || '/dashboard', request.url)
// 					);
// 				}
// 			}
// 		}
// 	}

// 	return response;
// } 


import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};