'use client';

import { createSanityClient } from '@/lib/sanity/client';
import { Person as SanityPerson } from '@/lib/sanity/sanity.types';
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
	const isAdmin = userProfile?.isAdmin || false;
	const isSuperAdmin = userProfile?.isSuperAdmin || false;
	const isResident = userProfile?.isResident || false;

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

	// Helper to convert portable text to plain text for bio
	const portableTextToString = (blocks: any[]): string => {
		if (!blocks || !Array.isArray(blocks)) return '';
		return blocks
			.map(block => {
				if (!block.children) return '';
				return block.children.map((child: any) => child.text || '').join('');
			})
			.join('\n\n');
	};

	// Unified function to fetch the complete user profile
	const fetchUserProfile = async (): Promise<UserProfile | null> => {
		if (!user) return null;

		setIsLoadingProfile(true);
		try {
			// 1. Get the basic auth user and metadata
			const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

			if (authError || !authUser) {
				console.error('Error fetching auth user:', authError?.message);
				return null;
			}

			// 2. Get extended data from accelr8_users table
			const { data: extendedData, error: extendedError } = await supabase
				.from('accelr8_users')
				.select('*')
				.eq('id', authUser.id)
				.single();

			if (extendedError) {
				console.error('Error fetching extended data:', extendedError.message);
			}

			// 3. Get Sanity profile if there's a sanity_person_id
			let sanityProfile: SanityPerson | null = null;
			const sanityPersonId = authUser.user_metadata?.sanity_person_id;

			if (sanityPersonId) {
				try {
					sanityProfile = await sanityClient.fetch<SanityPerson>(
						`*[_type == "person" && _id == $id][0]`,
						{ id: sanityPersonId }
					);
				} catch (sanityError) {
					console.error('Error fetching Sanity profile:', sanityError);
				}
			}

			// 4. Build the combined profile
			const profile: UserProfile = {
				// Base auth data
				id: authUser.id,
				email: authUser.email || undefined,
				role: (authUser.user_metadata?.role as 'resident' | 'admin' | 'super_admin') || 'resident',
				onboarding_completed: !!authUser.user_metadata?.onboarding_completed,

				// Extended data if available
				extendedData: extendedData ? {
					emergency_contact_name: extendedData.emergency_contact_name,
					emergency_contact_phone: extendedData.emergency_contact_phone,
					phone_number: extendedData.phone_number,
					last_active: extendedData.last_active
				} : undefined,

				// Sanity profile if available - properly mapping between types
				sanityProfile: sanityProfile ? {
					id: sanityProfile._id,
					name: sanityProfile.name || '',
					slug: sanityProfile.slug?.current,
					profileImage: sanityProfile.profileImage,
					bio: sanityProfile.bio || '',
					fullBio: sanityProfile.fullBio ? portableTextToString(sanityProfile.fullBio) : undefined,
					isTeamMember: sanityProfile.isTeamMember,
					isResident: sanityProfile.isResident,
					houseId: sanityProfile.house?._ref,
					socialLinks: sanityProfile.socialLinks,
					skills: sanityProfile.skills,
					company: sanityProfile.company
				} : undefined,

				// Computed properties
				isAdmin: authUser.user_metadata?.role === 'admin' || authUser.user_metadata?.role === 'super_admin',
				isSuperAdmin: authUser.user_metadata?.role === 'super_admin',
				isResident: authUser.user_metadata?.role === 'resident' || !authUser.user_metadata?.role
			};

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

			// Separate metadata fields from extended data
			const metadataUpdates: Record<string, unknown> = {};
			const extendedDataUpdates: Record<string, unknown> = {};

			// Determine which fields go where
			if (data.role !== undefined) metadataUpdates.role = data.role;
			if (data.onboarding_completed !== undefined) metadataUpdates.onboarding_completed = data.onboarding_completed;

			// Handle extended data if present
			if (data.extendedData) {
				if (data.extendedData.emergency_contact_name !== undefined)
					extendedDataUpdates.emergency_contact_name = data.extendedData.emergency_contact_name;
				if (data.extendedData.emergency_contact_phone !== undefined)
					extendedDataUpdates.emergency_contact_phone = data.extendedData.emergency_contact_phone;
				if (data.extendedData.phone_number !== undefined)
					extendedDataUpdates.phone_number = data.extendedData.phone_number;
			}

			// Update auth metadata if needed
			if (Object.keys(metadataUpdates).length > 0) {
				const { error: metadataError } = await supabase.auth.updateUser({
					data: metadataUpdates
				});

				if (metadataError) {
					setError(metadataError.message);
					return { error: metadataError };
				}
			}

			// Update extended data if needed
			if (Object.keys(extendedDataUpdates).length > 0) {
				const { error: extendedError } = await supabase
					.from('accelr8_users')
					.update(extendedDataUpdates)
					.eq('id', user.id);

				if (extendedError) {
					setError(extendedError.message);
					return { error: extendedError };
				}
			}

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