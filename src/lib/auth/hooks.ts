'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { isAdminUser } from '../auth-utils';
import { useAuth } from './context';
import { Permission, can } from './permissions';
import { Resource } from './types';

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

/**
 * Hook to check permission for a specific action with resource
 * For simple permission checks without resources, use context.hasPermission
 * 
 * Usage:
 * const canEditHouse = usePermission('manage_house', { id: 'house-123', type: 'house' });
 */
export function usePermission(permission: Permission, resource?: Resource): boolean {
	const { user, hasPermission } = useAuth();

	// If no resource, use the simpler hasPermission
	if (!resource) {
		return hasPermission(permission);
	}

	// Convert Supabase user to UserProfile format for resource checks
	const userProfile = useMemo(() => {
		if (!user) return null;

		return {
			id: user.id,
			email: user.email || '',
			name: user.user_metadata?.name || '',
			role: (user.user_metadata?.role || 'resident') as any,
			profile: {
				image: {
					url: user.user_metadata?.avatar_url || '',
				}
			}
		};
	}, [user]);

	// Check permission using can helper
	return useMemo(() => {
		return can(userProfile, permission, resource);
	}, [userProfile, permission, resource]);
}

/**
 * Hook to get all permissions for the current user
 */
export function useUserPermissions(): Permission[] {
	const { permissions } = useAuth();
	return permissions;
} 