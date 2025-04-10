'use client';

import { createUser, getAuthenticatedUser, updateUser } from '@/lib/api/users';
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
	isApplicant: boolean;
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
	isResident: false,
	isApplicant: false
});

// Provider component
export function UserProvider({
	children,

}: {
	children: React.ReactNode;

}) {
	const [user, setUser] = useState<User | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);
	const [isResident, setIsResident] = useState(false);
	const [isApplicant, setIsApplicant] = useState(false);

	const router = useRouter();
	const pathname = usePathname();
	const supabase = createClient();
	const sanityClient = createSanityClient();

	// Unified function to fetch the complete user profile
	const fetchUserProfile = async (): Promise<UserProfile | null> => {
		if (!user) return null;

		setIsLoadingProfile(true);
		try {
			const profile = await getAuthenticatedUser(user);

			if (profile) {
				// Update the state
				setUserProfile(profile);

				// Set role flags
				setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin' || false);
				setIsSuperAdmin(profile.role === 'super_admin' || false);
				setIsResident(profile.role === 'resident' || false);
				setIsApplicant(profile.role === 'applicant' || false);

				return profile;
			}
			return null;
		} catch (err) {
			console.error('Unexpected error fetching user profile:', err);
			return null;
		} finally {
			setIsLoadingProfile(false);
		}
	};

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
							setIsAdmin(false);
							setIsSuperAdmin(false);
							setIsResident(false);
							setIsApplicant(false);
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
	}, [pathname]); // Only re-run when the pathname changes, not on every render

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
						role: 'applicant', // New default role
						onboarding_completed: false
					}
				}
			});

			if (error) {
				setError(error.message);
				return { error };
			}

			// Create user profile using the API if sign up was successful
			if (data.user?.id) {
				try {
					await createUser({
						id: data.user.id,
						email,
						role: 'applicant',
						onboarding_completed: false
					});
				} catch (apiError) {
					console.error('Error creating user profile:', apiError);
					// Continue even if there's an API error as the auth user was created
				}
			}

			return { error: null };
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			return { error };
		}
	};

	const updateUserProfile = async (data: Partial<UserProfile>) => {
		setError(null);
		try {
			console.log('🔍 updateUserProfile called with data:', JSON.stringify(data, null, 2));

			if (!user) {
				console.error('❌ No user logged in');
				return { error: new Error('No user logged in') };
			}

			console.log('🔍 Current user ID:', user.id);

			// Call API to update user
			try {
				const updatedUser = await updateUser(user.id, data);
				console.log('✅ User updated successfully:', updatedUser ? 'yes' : 'no');

				if (updatedUser) {
					// Update local state
					setUserProfile(updatedUser);
					setIsAdmin(updatedUser.role === 'admin' || updatedUser.role === 'super_admin' || false);
					setIsSuperAdmin(updatedUser.role === 'super_admin' || false);
					setIsResident(updatedUser.role === 'resident' || false);
					setIsApplicant(updatedUser.role === 'applicant' || false);
				}

				return { error: null };
			} catch (apiErr) {
				console.error('❌ API error updating user:', apiErr);
				throw apiErr;
			}
		} catch (err) {
			const error = err as Error;
			console.error('❌ Error in updateUserProfile:', error.message);
			setError(error.message);
			return { error };
		}
	};

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			setUser(null);
			setUserProfile(null);
			setIsAdmin(false);
			setIsSuperAdmin(false);
			setIsResident(false);
			setIsApplicant(false);
		} catch (err) {
			console.error('Error signing out:', err);
		}
	};

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

	return (
		<UserContext.Provider
			value={{
				user,
				isLoading,
				error,
				userProfile,
				isLoadingProfile,
				fetchUserProfile,
				signIn,
				signUp,
				signOut,
				resetPassword,
				updateUserProfile,
				isAdmin,
				isSuperAdmin,
				isResident,
				isApplicant
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}