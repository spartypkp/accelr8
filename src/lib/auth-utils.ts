/**
 * Consolidated authentication utilities
 * This file provides server-side auth functionality
 */

import { redirect } from 'next/navigation';
import { Permission, Resource, UserProfile, can } from './auth';
import { createClient } from './supabase/server';

/**
 * Get the current session
 */
export async function getSession() {
	const supabase = await createClient();
	return supabase.auth.getSession();
}

/**
 * Get the current user with profile data
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
	const supabase = await createClient();

	try {
		const { data: { session }, error } = await supabase.auth.getSession();

		if (error || !session?.user) {
			return null;
		}

		const user = session.user;

		// Get user profile data including role
		const { data: userProfile } = await supabase
			.from('accelr8_users')
			.select('name, role, avatar_url')
			.eq('id', user.id)
			.single();

		// Construct a standardized user object
		return {
			id: user.id,
			email: user.email || '',
			name: userProfile?.name || user.user_metadata?.name || 'Unknown User',
			role: userProfile?.role || 'resident',
			profile: {
				image: {
					url: userProfile?.avatar_url || user.user_metadata?.avatar_url || '',
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
 * Check if the current user has a specific permission
 * Redirects to fallback URL if not authorized
 */
export async function requirePermission(
	permission: Permission,
	resource?: Resource,
	fallbackUrl = '/dashboard'
) {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	const hasPermission = can(user, permission, resource);

	if (!hasPermission) {
		redirect(fallbackUrl);
	}

	return user;
}

/**
 * Sign in with Supabase
 */
export async function signIn(email: string, password: string) {
	const supabase = await createClient();
	return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with Supabase
 */
export async function signUp(email: string, password: string) {
	const supabase = await createClient();
	return supabase.auth.signUp({ email, password });
}

/**
 * Sign out
 */
export async function signOut() {
	const supabase = await createClient();
	return supabase.auth.signOut();
}

/**
 * Check if a user has admin privileges
 */
export function isAdminUser(user: any): boolean {
	if (!user) return false;

	// Check role directly
	if (user.role === 'admin' || user.role === 'super_admin') {
		return true;
	}

	// Check role in user_metadata
	if (user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'super_admin') {
		return true;
	}

	return false;
} 