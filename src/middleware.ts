import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { UserProfile, can, extractParams, getRouteConfig } from './lib/auth';

export async function middleware(request: NextRequest) {
	// Initialize response
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	// Get URL info
	const requestUrl = new URL(request.url);
	const path = requestUrl.pathname;

	// Create Supabase client
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						request.cookies.set({ name, value, ...options });
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					cookiesToSet.forEach(({ name, value, options }) => {
						response.cookies.set({ name, value, ...options });
					});
				},
			},
		}
	);

	// Get current session and user
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Get route configuration
	const routeConfig = getRouteConfig(path);

	// Handle auth routes (login, register, etc.)
	const isAuthRoute = path.startsWith('/login') ||
		path.startsWith('/register') ||
		path.startsWith('/forgot-password') ||
		path.startsWith('/reset-password');

	// If user is signed in and tries to access auth routes, redirect to dashboard
	if (session && isAuthRoute) {
		const redirectUrl = new URL('/dashboard', requestUrl.origin);
		return NextResponse.redirect(redirectUrl);
	}

	// If it's a public route or we have no config, proceed
	if (!routeConfig || routeConfig.public) {
		return response;
	}

	// From here on, authentication is required
	if (!session) {
		const redirectUrl = new URL('/login', requestUrl.origin);
		redirectUrl.searchParams.set('redirectTo', path);
		return NextResponse.redirect(redirectUrl);
	}

	// If no permission required, just authentication, proceed
	if (!routeConfig.permission) {
		return response;
	}

	// Get user profile data for permission check
	const { data: userProfile } = await supabase
		.from('accelr8_users')
		.select('id, name, role, avatar_url')
		.eq('id', session.user.id)
		.single();

	if (!userProfile) {
		// User exists in auth but not in profiles table
		// Could redirect to profile completion page
		return response;
	}

	// Create user object for permission check
	const user: UserProfile = {
		id: session.user.id,
		email: session.user.email || '',
		name: userProfile.name || session.user.user_metadata?.name || '',
		role: userProfile.role || 'resident',
		profile: {
			image: {
				url: userProfile.avatar_url || session.user.user_metadata?.avatar_url || '',
			},
		},
	};

	// Check for resource-based permissions
	if (routeConfig.requiresResourceCheck && routeConfig.resourceType) {
		const params = extractParams(routeConfig.path, path);

		// Check permission with resource
		const resource = {
			id: params[`${routeConfig.resourceType}Id`] || '',
			type: routeConfig.resourceType,
		};

		const hasPermission = can(user, routeConfig.permission, resource);

		if (!hasPermission) {
			const fallbackUrl = new URL(routeConfig.fallbackUrl || '/dashboard', requestUrl.origin);
			return NextResponse.redirect(fallbackUrl);
		}
	} else {
		// Check general permission
		const hasPermission = can(user, routeConfig.permission);

		if (!hasPermission) {
			const fallbackUrl = new URL(routeConfig.fallbackUrl || '/dashboard', requestUrl.origin);
			return NextResponse.redirect(fallbackUrl);
		}
	}

	// User has permission, proceed
	return response;
} 