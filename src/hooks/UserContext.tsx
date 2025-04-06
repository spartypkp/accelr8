'use client';

import { createSanityClient } from '@/lib/sanity';
import type { Person as SanityPerson } from '@/lib/sanity.types';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

// Type for extended data from accelr8_users table
type ExtendedUserData = {
	emergency_contact_name?: string;
	emergency_contact_phone?: string;
	phone_number?: string;
	last_active?: string;
	// Other fields that don't need to be in auth metadata
};

// Complete user profile combining auth, extended data, and Sanity
type UserProfile = {
	// Base auth data
	id: string;
	email?: string;

	// Auth metadata (fast access)
	role: 'resident' | 'admin' | 'super_admin';
	sanity_person_id?: string;
	onboarding_completed: boolean;

	// Extended data (loaded when needed)
	extendedData?: ExtendedUserData;

	// Sanity profile (loaded when needed)
	sanityProfile?: Partial<SanityPerson>;
};

// Define the context type
export type UserContextType = {
	// Auth state
	user: User | null;
	isLoading: boolean;
	error: string | null;

	// Derived profile
	userProfile: UserProfile | null;
	isLoadingExtendedData: boolean;
	isLoadingSanityProfile: boolean;

	// House access (kept from your original)
	// houses: HouseAccess[];
	// loadingHouses: boolean;

	// Functions
	// fetchUserHouses: () => Promise<HouseAccess[]>;
	fetchExtendedData: () => Promise<ExtendedUserData | null>;
	fetchSanityProfile: () => Promise<Partial<SanityPerson> | null>;

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
	isLoadingExtendedData: false,
	isLoadingSanityProfile: false,
	// houses: [],
	// loadingHouses: false,
	fetchExtendedData: async () => null,
	fetchSanityProfile: async () => null,
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
	const [isLoadingExtendedData, setIsLoadingExtendedData] = useState(false);
	const [isLoadingSanityProfile, setIsLoadingSanityProfile] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// House access state (from your original)
	// const [houses, setHouses] = useState<HouseAccess[]>([]);
	const [loadingHouses, setLoadingHouses] = useState<boolean>(false);

	const router = useRouter();
	const pathname = usePathname();
	const supabase = createClient();

	// Computed properties based on user metadata
	const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
	const isSuperAdmin = userProfile?.role === 'super_admin';
	const isResident = userProfile?.role === 'resident';

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

	// Function to fetch extended user data
	const fetchExtendedData = async (): Promise<ExtendedUserData | null> => {
		if (!user) return null;

		setIsLoadingExtendedData(true);
		try {
			const { data, error } = await supabase
				.from('accelr8_users')
				.select('emergency_contact_name, emergency_contact_phone, phone_number, last_active')
				.eq('id', user.id)
				.single();

			if (error) {
				console.error('Error fetching extended data:', error.message);
				return null;
			}

			if (data) {
				// Update the profile with extended data
				setUserProfile(prev => prev ? { ...prev, extendedData: data } : null);
				return data;
			}

			return null;
		} catch (err) {
			console.error('Unexpected error:', err);
			return null;
		} finally {
			setIsLoadingExtendedData(false);
		}
	};

	// Function to fetch Sanity profile
	const fetchSanityProfile = async (): Promise<Partial<SanityPerson> | null> => {
		if (!userProfile?.sanity_person_id) return null;

		setIsLoadingSanityProfile(true);
		try {
			// Use your Sanity client to fetch the person

			const sanityClient = createSanityClient(); // You'll need to implement this
			const profile = await sanityClient.fetch(
				`*[_type == "person" && _id == $id][0]`,
				{ id: userProfile.sanity_person_id }
			);

			if (profile) {
				// Update the profile with Sanity data
				setUserProfile(prev => prev ? { ...prev, sanityProfile: profile } : null);
				return profile;
			}

			return null;
		} catch (err) {
			console.error('Error fetching Sanity profile:', err);
			return null;
		} finally {
			setIsLoadingSanityProfile(false);
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

					// Create the initial user profile from auth metadata
					const metadata = session.user.user_metadata || {};
					setUserProfile({
						id: session.user.id,
						email: session.user.email,
						role: metadata.role || 'resident', // Default to resident if not set
						sanity_person_id: metadata.sanity_person_id,
						onboarding_completed: metadata.onboarding_completed || false
					});

					// Update last_active
					updateLastActive(session.user.id);

					// Load houses for the user
					//.fetchUserHouses();

					// Optionally fetch extended data if needed on initial load
					// You might want to defer this based on the current route
					if (pathname.startsWith('/dashboard') || pathname.includes('/profile')) {
						fetchExtendedData();
					}
				}

				// Set up auth state change listener
				const { data: { subscription } } = await supabase.auth.onAuthStateChange(
					async (event, session) => {
						if (session?.user) {
							setUser(session.user);

							// Create the user profile from auth metadata
							const metadata = session.user.user_metadata || {};
							setUserProfile({
								id: session.user.id,
								email: session.user.email,
								role: metadata.role || 'resident',
								sanity_person_id: metadata.sanity_person_id,
								onboarding_completed: metadata.onboarding_completed || false
							});

							updateLastActive(session.user.id);
							//fetchUserHouses();
						} else {
							setUser(null);
							setUserProfile(null);
							//setHouses([]);
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

	// Revised fetchUserHouses function using role from metadata
	// const fetchUserHouses = async (): Promise<HouseAccess[]> => {
	// 	if (!user || !userProfile) return [];

	// 	setLoadingHouses(true);
	// 	try {
	// 		const userRole = userProfile.role;
	// 		let houseAccess: HouseAccess[] = [];

	// 		if (userRole === 'super_admin') {
	// 			// Super admins see all houses
	// 			const { data: allHouses, error } = await supabase
	// 				.from('houses')
	// 				.select('id, name, address, image_url');

	// 			if (error) throw error;

	// 			if (allHouses) {
	// 				houseAccess = allHouses.map((house: any) => ({
	// 					id: house.id,
	// 					name: house.name,
	// 					address: house.address,
	// 					image_url: house.image_url,
	// 					accessType: 'admin' as const
	// 				}));
	// 			}
	// 		} else if (userRole === 'admin') {
	// 			// Same admin house access code as before
	// 			// ...
	// 		}

	// 		// Rest of your house fetching logic
	// 		// ...

	// 		setHouses(houseAccess);
	// 		return houseAccess;
	// 	} catch (err) {
	// 		console.error('Error fetching houses:', err);
	// 		return [];
	// 	} finally {
	// 		setLoadingHouses(false);
	// 	}
	// };

	// Auth functions (revised to use metadata)
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
							email: email,
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

	// Update user profile function (handles both metadata and extended data)
	const updateUserProfile = async (data: Partial<UserProfile>) => {
		setError(null);
		try {
			if (!user) {
				const error = new Error('User not authenticated');
				setError(error.message);
				return { error };
			}

			// Separate metadata fields from extended data
			const metadataUpdates: any = {};
			const extendedDataUpdates: any = {};

			// Determine which fields go where
			if (data.role !== undefined) metadataUpdates.role = data.role;
			if (data.sanity_person_id !== undefined) metadataUpdates.sanity_person_id = data.sanity_person_id;
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

			// Update local state immediately for better UX
			if (Object.keys(metadataUpdates).length > 0) {
				setUserProfile(prev => {
					if (!prev) return null;
					return {
						...prev,
						...metadataUpdates
					};
				});
			}

			if (Object.keys(extendedDataUpdates).length > 0) {
				setUserProfile(prev => {
					if (!prev) return null;
					return {
						...prev,
						extendedData: {
							...prev.extendedData,
							...extendedDataUpdates
						}
					};
				});
			}

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
		isLoadingExtendedData,
		isLoadingSanityProfile,
		error,
		// houses,
		// loadingHouses,
		// fetchUserHouses,
		fetchExtendedData,
		fetchSanityProfile,
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