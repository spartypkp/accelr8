/**
 * Simplified authentication utilities for server-side auth functionality
 */

import { redirect } from 'next/navigation';
import { UserProfile, UserRole } from './auth/types';
import { createClient } from './supabase/server';

/**
 * Get the current user with basic profile data
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
	const supabase = await createClient();

	try {
		// Get authenticated user
		const { data: { user }, error } = await supabase.auth.getUser();

		if (error || !user) {
			return null;
		}

		// Get user role from metadata or use default
		const role = (user.user_metadata?.role || 'resident') as UserRole;

		// Construct a standardized user object
		return {
			id: user.id,
			email: user.email || '',
			name: user.user_metadata?.name || 'Unknown User',
			role: role,
			profile: {
				image: {
					url: user.user_metadata?.avatar_url || '',
				},
			},
		};
	} catch (error) {
		console.error('Error getting current user:', error);
		return null;
	}
}

/**
 * Check if the current user is authenticated
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo = '/login') {
	const user = await getCurrentUser();

	if (!user) {
		redirect(redirectTo);
	}

	return user;
}

/**
 * Check if the current user has admin role
 * Redirects to fallback URL if not authorized
 */
export async function requireAdmin(fallbackUrl = '/dashboard') {
	const user = await requireAuth('/login');

	if (user.role !== 'admin' && user.role !== 'super_admin') {
		redirect(fallbackUrl);
	}

	return user;
}

/**
 * Check if a user has access to a specific house
 */
export async function checkHouseAccess(userId: string, houseId: string): Promise<boolean> {
	if (!userId || !houseId) return false;

	const supabase = await createClient();
	const user = await getCurrentUser();

	// Super admins have access to all houses
	if (user?.role === 'super_admin') return true;

	// Determine the correct table based on user role
	const table = user?.role === 'admin' ? 'house_admins' : 'residencies';

	const { data, error } = await supabase
		.from(table)
		.select('id')
		.eq('user_id', userId)
		.eq('sanity_house_id', houseId)
		.maybeSingle();

	if (error || !data) return false;

	return true;
}

/**
 * Sign in with Supabase
 */
export async function signIn(email: string, password: string) {
	const supabase = await createClient();
	return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign out
 */
export async function signOut() {
	const supabase = await createClient();
	return supabase.auth.signOut();
} 