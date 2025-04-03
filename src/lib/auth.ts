import { redirect } from 'next/navigation';
import { createClient } from './supabase/client';

export type UserRole = 'resident' | 'admin' | 'super_admin';

/**
 * Get the current session and user
 */
export async function getSession() {
	const supabase = await createClient();
	return supabase.auth.getSession();
}

/**
 * Get the current user with profile data
 */
export async function getCurrentUser() {
	const supabase = createClient();

	try {
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			return null;
		}

		// Get additional user info from database
		const { data: userProfile } = await supabase
			.from('accelr8_users')
			.select('*')
			.eq('id', user.id)
			.single();

		return {
			id: user.id,
			email: user.email || '',
			name: userProfile?.name || user.user_metadata?.name,
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
 * Check if the current user has the required role
 * Redirects to dashboard if not authorized
 */
export async function requireRole(requiredRoles: UserRole[], redirectTo = '/dashboard') {
	const user = await getCurrentUser();

	if (!user || !user.role || !requiredRoles.includes(user.role as UserRole)) {
		redirect(redirectTo);
	}

	return user;
}

/**
 * Check if the current user has admin access to a specific house
 */
export async function requireHouseAccess(houseId: string, redirectTo = '/dashboard') {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	// Super admins have access to all houses
	if (user.role === 'super_admin') {
		return user;
	}

	// Check if user is house admin for this specific house
	if (user.role === 'admin') {
		const supabase = await createClient();
		const { data } = await supabase
			.from('house_admins')
			.select('*')
			.eq('user_id', user.id)
			.eq('sanity_house_id', houseId)
			.single();

		if (data) {
			return user;
		}
	}

	// Check if resident belongs to this house
	if (user.role === 'resident') {
		const supabase = await createClient();
		const { data } = await supabase
			.from('residencies')
			.select('*')
			.eq('user_id', user.id)
			.eq('sanity_house_id', houseId)
			.eq('status', 'active')
			.single();

		if (data) {
			return user;
		}
	}

	redirect(redirectTo);
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
	const supabase = createClient();
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 * Sign out
 */
export async function signOut() {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw new Error(error.message);
	}

	return true;
}

/**
 * Get user profile data
 */
export async function getUserProfileById(userId: string) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();

	if (error) {
		console.error('Error fetching user profile:', error);
		return null;
	}

	return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, profileData: any) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('profiles')
		.update(profileData)
		.eq('id', userId)
		.select();

	if (error) {
		throw new Error(`Failed to update profile: ${error.message}`);
	}

	return data?.[0];
} 