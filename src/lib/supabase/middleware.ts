import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});
	const requestUrl = new URL(request.url);

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
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// IMPORTANT: Avoid writing any logic between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const isAuthRoute = requestUrl.pathname.startsWith('/auth');

	if (user) {
		// If user is signed in and tries to access auth routes, redirect to home
		if (isAuthRoute) {
			// Let the user access the reset-password route
			if (requestUrl.pathname.startsWith('/auth/reset-password')) {
				return supabaseResponse;
			}
			const redirectUrl = new URL('/', requestUrl.origin);
			return NextResponse.redirect(redirectUrl);
		}
		const { data, error } = await supabase.from('contoural_users').select('access_level').eq('id', user.id).single();
		if (error) {
			console.error(error);
		}

		// If the user has an acces_level of "contractor", only let them access any routes that start with "/citations/citationHelper"
		if (data?.access_level === "contractor") {
			const allowedRoutes = ["/citations/citationHelper", "docs"];
			// Check if the current route is not in the allowedRoutes array. If it is, allow acces. If not, redirect to /citations/citationHelper
			if (!allowedRoutes.some(route => requestUrl.pathname.startsWith(route))) {
				const redirectUrl = new URL('/citations/citationHelper', requestUrl.origin);
				return NextResponse.redirect(redirectUrl);
			}
		}
	} else {
		// If no user and not on auth route, redirect to login
		if (!isAuthRoute) {
			const redirectUrl = new URL('/auth/login', requestUrl.origin);
			// Preserve the original URL to redirect back after login
			redirectUrl.searchParams.set('redirectTo', requestUrl.pathname);
			return NextResponse.redirect(redirectUrl);
		}
	}

	// IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
	// creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse;
}