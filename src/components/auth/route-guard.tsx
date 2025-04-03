'use client';

import { Permission, Resource, UserProfile, can, useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';

interface RouteGuardProps {
	children: ReactNode;
	requiredPermission?: Permission;
	resource?: Resource;
	fallbackUrl?: string;
	loadingComponent?: ReactNode;
}

/**
 * Client-side route guard component that redirects users without required permission
 * Usage:
 * <RouteGuard requiredPermission="manage_house" resource={{ id: "house-id", type: "house" }}>
 *   <ProtectedComponent />
 * </RouteGuard>
 */
export default function RouteGuard({
	children,
	requiredPermission,
	resource,
	fallbackUrl = '/dashboard',
	loadingComponent = <div>Loading...</div>,
}: RouteGuardProps) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	// Convert Supabase user to UserProfile format
	const userProfile = useMemo<UserProfile | null>(() => {
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

	useEffect(() => {
		// Don't do anything while still loading
		if (isLoading) return;

		// If there's no required permission, only check authentication
		if (!requiredPermission) {
			if (!user) {
				router.push('/login');
			}
			return;
		}

		// Check permission with the can() helper
		const hasAccess = can(userProfile, requiredPermission, resource);

		if (!hasAccess) {
			router.push(fallbackUrl);
		}
	}, [user, isLoading, requiredPermission, resource, router, fallbackUrl, userProfile]);

	if (isLoading) {
		return <>{loadingComponent}</>;
	}

	// Check if user is authenticated
	if (!user) {
		// This handles race condition where router hasn't redirected yet
		return <>{loadingComponent}</>;
	}

	// If we require permissions, check them
	if (requiredPermission) {
		const hasAccess = can(userProfile, requiredPermission, resource);

		if (!hasAccess) {
			// This handles race condition where router hasn't redirected yet
			return <>{loadingComponent}</>;
		}
	}

	return <>{children}</>;
} 