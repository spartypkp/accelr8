import { Permission, Resource, UserProfile, can } from '@/lib/auth';
import { getCurrentUser } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthGuardProps {
	children: ReactNode;
	requiredPermission?: Permission;
	resource?: Resource;
	fallbackUrl?: string;
}

/**
 * Server-side auth guard component that redirects users without required permission
 * 
 * Usage:
 * <AuthGuard requiredPermission="manage_house" resource={{ id: "house-id", type: "house" }}>
 *   <ProtectedServerComponent />
 * </AuthGuard>
 */
export default async function AuthGuard({
	children,
	requiredPermission,
	resource,
	fallbackUrl = '/dashboard',
}: AuthGuardProps) {
	// Get the current user
	const user = await getCurrentUser();

	// If no user, redirect to login
	if (!user) {
		redirect('/login');
	}

	// If permission is required, check it
	if (requiredPermission) {
		const hasAccess = can(user, requiredPermission, resource);

		if (!hasAccess) {
			redirect(fallbackUrl);
		}
	}

	// User is authenticated and authorized
	return <>{children}</>;
}

/**
 * Function version of AuthGuard for use within server components
 * Returns the user if authorized, or redirects
 * 
 * Usage:
 * const user = await requirePermission('manage_house', { id: "house-id", type: "house" });
 */
export async function requirePermission(
	permission: Permission,
	resource?: Resource,
	fallbackUrl = '/dashboard'
): Promise<UserProfile> {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	const hasAccess = can(user, permission, resource);

	if (!hasAccess) {
		redirect(fallbackUrl);
	}

	return user;
} 