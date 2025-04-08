'use client';

import { getAuthenticatedUser, updateUser } from '@/lib/api/users';
import { createSanityClient } from '@/lib/sanity/client';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

// Define the context type
export type UserContextType = {
	// Auth state
	user: User | null;
	isLoading: boolean;
	error: string | null;

	// User profile
	userProfile: UserProfile | null;
	isLoadingProfile: boolean;

	// Functions
	fetchUserProfile: () => Promise<UserProfile | null>;

	// Auth operations
	signIn: (email: string, password: string) => Promise<{ error: Error | null; }>;
	signUp: (email: string, password: string) => Promise<{ error: Error | null; }>;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Promise<{ error: Error | null; }>;
	updateUserProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null; }>;

	// Computed properties
	isAdmin: boolean;
	isSuperAdmin: boolean;
	isResident: boolean;
};

// Create the context
const UserContext = createContext<UserContextType>({
	user: null,
	isLoading: false,
	error: null,
	userProfile: null,
	isLoadingProfile: false,
	fetchUserProfile: async () => null,
	signIn: async () => ({ error: new Error('Not implemented') }),
	signUp: async () => ({ error: new Error('Not implemented') }),
	signOut: async () => { },
	resetPassword: async () => ({ error: new Error('Not implemented') }),
	updateUserProfile: async () => ({ error: new Error('Not implemented') }),
	isAdmin: false,
	isSuperAdmin: false,
	isResident: false
});

// Provider component
export function UserProvider({ children }: { children: React.ReactNode; }) {
	const [user, setUser] = useState<User | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const pathname = usePathname();
	const supabase = createClient();
	const sanityClient = createSanityClient();

	// Computed properties based on user profile
	const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin' || false;
	const isSuperAdmin = userProfile?.role === 'super_admin' || false;
	const isResident = userProfile?.role === 'resident' || false;

	// Function to update last_active timestamp
	const updateLastActive = async (userId: string) => {
		try {
			await supabase
				.from('accelr8_users')
				.update({ last_active: new Date().toISOString() })
				.eq('id', userId);
		} catch (err) {
			console.error('Error updating last_active:', err);
		}
	};

	// Unified function to fetch the complete user profile
	const fetchUserProfile = async (): Promise<UserProfile | null> => {
		if (!user) return null;

		setIsLoadingProfile(true);
		try {
			const profile = await getAuthenticatedUser(user);

			// Update the state
			setUserProfile(profile);
			return profile;
		} catch (err) {
			console.error('Unexpected error fetching user profile:', err);
			return null;
		} finally {
			setIsLoadingProfile(false);
		}
	};

	// Initialize user and profile on mount
	useEffect(() => {
		const initializeUser = async () => {
			setIsLoading(true);
			try {
				// Check for an existing session
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();

				if (sessionError) {
					console.error('Error getting session:', sessionError.message);
				} else if (session) {
					// Set the auth user
					setUser(session.user);

					// Fetch the complete profile
					await fetchUserProfile();

					// Update last_active
					updateLastActive(session.user.id);
				}

				// Set up auth state change listener
				const { data: { subscription } } = await supabase.auth.onAuthStateChange(
					async (event, session) => {
						if (session?.user) {
							setUser(session.user);
							await fetchUserProfile();
							updateLastActive(session.user.id);
						} else {
							setUser(null);
							setUserProfile(null);
						}

						// Handle sign out
						if (event === 'SIGNED_OUT') {
							if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
								router.push('/login');
							}
						}
					}
				);

				return () => {
					subscription.unsubscribe();
				};
			} catch (err) {
				console.error('Unexpected error initializing user:', err);
			} finally {
				setIsLoading(false);
			}
		};

		initializeUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Auth functions
	const signIn = async (email: string, password: string) => {
		setError(null);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setError(error.message);
				return { error };
			}

			return { error: null };
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			return { error };
		}
	};

	const signUp = async (email: string, password: string) => {
		setError(null);
		try {
			// Create auth user with metadata
			const { error, data } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						role: 'resident', // Default role
						onboarding_completed: false
					}
				}
			});

			if (error) {
				setError(error.message);
				return { error };
			}

			// Still create entry in accelr8_users for extended data
			if (data.user?.id) {
				const { error: insertError } = await supabase
					.from('accelr8_users')
					.insert([
						{
							id: data.user.id,
							// Any other extended fields
						}
					]);

				if (insertError) {
					console.error('Error creating extended profile:', insertError.message);
				}
			}

			return { error: null };
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			return { error };
		}
	};

	// Update user profile function
	const updateUserProfile = async (data: Partial<UserProfile>) => {
		setError(null);
		try {
			if (!user) {
				const error = new Error('User not authenticated');
				setError(error.message);
				return { error };
			}

			// Call the server action directly
			await updateUser(user.id, data);

			// Refresh the profile to get the latest data
			await fetchUserProfile();

			return { error: null };
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			return { error };
		}
	};

	// Sign out function
	const signOut = async () => {
		setError(null);
		try {
			await supabase.auth.signOut();
			router.push('/login');
		} catch (err) {
			const error = err as Error;
			setError(error.message);
		}
	};

	// Reset password function
	const resetPassword = async (email: string) => {
		setError(null);
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (error) {
				setError(error.message);
				return { error };
			}

			return { error: null };
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			return { error };
		}
	};

	const value: UserContextType = {
		user,
		userProfile,
		isLoading,
		isLoadingProfile,
		error,
		fetchUserProfile,
		signIn,
		signUp,
		signOut,
		resetPassword,
		updateUserProfile,
		isAdmin,
		isSuperAdmin,
		isResident
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook
export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}