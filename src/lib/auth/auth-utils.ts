import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserRole } from './routes-config';

/**
 * Get the current user
 */
export async function getCurrentUser() {
	const supabase = await createClient();

	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return null;

		return user;
	} catch (error) {
		console.error('Error getting current user:', error);
		return null;
	}
}

/**
 * Require authentication for server components
 * 
 * @param role Minimum required role
 * @param redirectTo Redirect URL if auth fails
 */
export async function requireAuth(role?: UserRole, redirectTo: string = '/login') {
	const user = await getCurrentUser();

	if (!user) {
		redirect(redirectTo);
	}

	if (role) {
		const userRole = user.user_metadata?.role || 'resident';
		const roleHierarchy = { resident: 1, admin: 2, super_admin: 3 };

		if (roleHierarchy[userRole as UserRole] < roleHierarchy[role]) {
			redirect('/dashboard');
		}
	}

	return user;
}

/**
 * Check if a user has access to a specific house
 * 
 * @param userId User ID
 * @param houseId House ID
 */
export async function checkHouseAccess(userId: string, houseId: string) {
	if (!userId || !houseId) return false;

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	// Super admins have access to all houses
	if (user?.user_metadata?.role === 'super_admin') return true;

	// Determine the correct table based on user role
	const table = user?.user_metadata?.role === 'admin' ? 'house_admins' : 'residencies';

	const { data } = await supabase
		.from(table)
		.select('id')
		.eq('user_id', userId)
		.eq('sanity_house_id', houseId)
		.maybeSingle();

	return !!data;
}

/**
 * Require house access for server components
 * 
 * @param houseId House ID
 * @param redirectTo Redirect URL if access check fails
 */
export async function requireHouseAccess(houseId: string, redirectTo: string = '/dashboard') {
	const user = await requireAuth();

	// Super admins have access to all houses
	if (user.user_metadata?.role === 'super_admin') return user;

	const hasAccess = await checkHouseAccess(user.id, houseId);

	if (!hasAccess) {
		redirect(redirectTo);
	}

	return user;
} 