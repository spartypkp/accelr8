import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { UserRole } from './routes-config';

/**
 * Simple auth hook for client components
 */
export function useAuth() {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		// Get initial session
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setUser(user || null);
			setIsLoading(false);
		};

		getUser();

		// Setup auth state change listener
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user || null);
				setIsLoading(false);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	const signIn = useCallback(async (email: string, password: string) => {
		return supabase.auth.signInWithPassword({ email, password });
	}, [supabase.auth]);

	const signOut = useCallback(async () => {
		await supabase.auth.signOut();
		router.push('/login');
	}, [supabase.auth, router]);

	const signUp = useCallback(async (email: string, password: string) => {
		return supabase.auth.signUp({
			email,
			password,
			options: {
				// Set default role for new users
				data: {
					role: 'resident'
				}
			}
		});
	}, [supabase.auth]);

	const resetPassword = useCallback(async (email: string) => {
		return supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`
		});
	}, [supabase.auth]);

	// Get user role from metadata
	const userRole = user?.user_metadata?.role || 'resident';

	// Helper functions
	const isAdmin = userRole === 'admin' || userRole === 'super_admin';
	const isSuperAdmin = userRole === 'super_admin';

	return {
		user,
		isLoading,
		isAdmin,
		isSuperAdmin,
		userRole,
		signIn,
		signOut,
		signUp,
		resetPassword
	};
}

/**
 * Hook to require authentication
 */
export function useRequireAuth(role?: UserRole) {
	const { user, isLoading, userRole } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			router.push('/login');
			return;
		}

		if (role) {
			const roleHierarchy = { resident: 1, admin: 2, super_admin: 3 };
			if (roleHierarchy[userRole] < roleHierarchy[role]) {
				router.push('/dashboard');
			}
		}
	}, [user, isLoading, role, userRole, router]);

	return { user, isLoading };
} 