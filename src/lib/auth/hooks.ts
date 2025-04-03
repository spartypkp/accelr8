'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAdminUser } from '../auth';
import { useAuth } from './context';

// Hook to check if user is authenticated
export function useRequireAuth(redirectTo = '/login') {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			router.push(redirectTo);
		}
	}, [user, isLoading, router, redirectTo]);

	return { user, isLoading };
}

// Hook to check if user is admin
export function useRequireAdmin(redirectTo = '/dashboard') {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	// Use the isAdminUser utility function for consistent role checking
	const isAdmin = isAdminUser(user);

	useEffect(() => {
		if (!isLoading && (!user || !isAdmin)) {
			router.push(redirectTo);
		}
	}, [user, isLoading, isAdmin, router, redirectTo]);

	return { user, isLoading, isAdmin };
}

// Hook for handling authentication redirects
export function useAuthRedirect(onAuthenticatedPath = '/dashboard') {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Only redirect on auth pages when user is already authenticated
		if (
			!isLoading &&
			user &&
			(pathname.startsWith('/login') ||
				pathname.startsWith('/register') ||
				pathname.startsWith('/forgot-password'))
		) {
			router.push(onAuthenticatedPath);
		}
	}, [user, isLoading, router, pathname, onAuthenticatedPath]);

	return { user, isLoading };
} 