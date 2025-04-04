'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from './routes-config';

// Define context interface
interface AuthContextType {
	user: any | null;
	isLoading: boolean;
	userRole: UserRole;
	isAdmin: boolean;
	isSuperAdmin: boolean;
	signIn: (email: string, password: string) => Promise<any>;
	signOut: () => Promise<void>;
	signUp: (email: string, password: string) => Promise<any>;
	resetPassword: (email: string) => Promise<any>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoading: true,
	userRole: 'resident',
	isAdmin: false,
	isSuperAdmin: false,
	signIn: () => Promise.resolve({}),
	signOut: () => Promise.resolve(),
	signUp: () => Promise.resolve({}),
	resetPassword: () => Promise.resolve({})
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode; }) {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		// Function to get and set the user
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setUser(user || null);
			setIsLoading(false);
		};

		// Get initial user
		getUser();

		// Listen for auth state changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				setUser(session?.user || null);
				setIsLoading(false);
			}
		);

		// Cleanup subscription
		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	// Auth methods
	const signIn = async (email: string, password: string) => {
		return supabase.auth.signInWithPassword({ email, password });
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		router.push('/login');
	};

	const signUp = async (email: string, password: string) => {
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
	};

	const resetPassword = async (email: string) => {
		return supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`
		});
	};

	// Get user role from metadata
	const userRole = (user?.user_metadata?.role || 'resident') as UserRole;

	// Derived values
	const isAdmin = userRole === 'admin' || userRole === 'super_admin';
	const isSuperAdmin = userRole === 'super_admin';

	const value = {
		user,
		isLoading,
		userRole,
		isAdmin,
		isSuperAdmin,
		signIn,
		signOut,
		signUp,
		resetPassword
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 