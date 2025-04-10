'use server';
import { User } from '@supabase/supabase-js';
import {
	enhanceUserWithSanityData
} from '../enhancers/users';
import { createSanityClient } from '../sanity/client';
import { createClient } from '../supabase/server';
import { SupabaseAuthUser, SupabaseExtendedUser, UserProfile, UserRole } from '../types';
import { ApiError } from './shared/error';
/**
 * Input type for creating/updating a user
 */
export type UserProfileInput = Partial<UserProfile>;

/**
 * Query options for filtering users
 */
export interface UserQueryOptions {
	role?: UserRole | 'all';
	houseId?: string;
	search?: string;
	limit?: number;
	offset?: number;
	active?: boolean;
}

/**
 * Get a user by ID with complete profile data
 */
export async function getAuthenticatedUser(user: User): Promise<UserProfile | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();


		// Extract auth metadata
		const authUser: SupabaseAuthUser = {
			id: user.id,
			email: user.email,
			role: (user.user_metadata?.role) as UserRole,
			sanity_person_id: user.user_metadata?.sanity_person_id,
			onboarding_completed: user.user_metadata?.onboarding_completed || false
		};

		// 2. Fetch extended user data and Sanity profile in parallel
		const [extendedUserResult, sanityPerson] = await Promise.all([
			supabase
				.from('accelr8_users')
				.select('*')
				.eq('id', user.id)
				.single(),
			authUser.sanity_person_id ?
				sanityClient.fetch(
					`*[_type == "person" && _id == $id][0]`,
					{ id: authUser.sanity_person_id }
				) :
				null
		]);

		// Create extended user combining auth and profile data
		const extendedUser: SupabaseExtendedUser = {
			...authUser,
			...extendedUserResult.data
		};

		// 3. Enhance and return combined profile
		return enhanceUserWithSanityData(extendedUser, sanityPerson);
	} catch (error) {
		console.error('Error fetching user:', error);
		throw new ApiError(
			'Failed to fetch user profile',
			500,
			error
		);
	}
}

/**
 * Get a user by ID with complete profile data
 */
export async function getUser(id: string): Promise<UserProfile | null> {
	try {
		console.log('🔍 getUser called with id:', id);

		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Get user auth data
		const { data: { user } } = await supabase.auth.getUser();


		if (!user) {
			console.error('❌ No user found with id:', id);
			return null;
		}

		console.log('✅ Auth user found:', user.id);

		// Extract auth metadata
		const authUser: SupabaseAuthUser = {
			id: user.id,
			email: user.email,
			role: (user.user_metadata?.role || 'applicant') as UserRole,
			sanity_person_id: user.user_metadata?.sanity_person_id,
			onboarding_completed: user.user_metadata?.onboarding_completed || false
		};

		console.log('🔍 Auth user metadata:', JSON.stringify(authUser, null, 2));

		// 2. Fetch extended user data and Sanity profile in parallel
		try {
			const [extendedUserResult, sanityPerson] = await Promise.all([
				supabase
					.from('accelr8_users')
					.select('*')
					.eq('id', id)
					.single(),
				authUser.sanity_person_id ?
					sanityClient.fetch(
						`*[_type == "person" && _id == $id][0]`,
						{ id: authUser.sanity_person_id }
					) :
					null
			]);

			if (extendedUserResult.error) {
				console.error('❌ Error fetching extended user data:', extendedUserResult.error);
				throw extendedUserResult.error;
			}

			console.log('✅ Extended user data found:', extendedUserResult.data ? 'yes' : 'no');
			console.log('✅ Sanity person found:', sanityPerson ? 'yes' : 'no');

			// Create extended user combining auth and profile data
			const extendedUser: SupabaseExtendedUser = {
				...authUser,
				...extendedUserResult.data
			};

			// 3. Enhance and return combined profile
			return enhanceUserWithSanityData(extendedUser, sanityPerson);
		} catch (fetchError) {
			console.error('❌ Error fetching user data:', fetchError);
			throw fetchError;
		}
	} catch (error) {
		console.error('❌ Error in getUser:', error);
		throw new ApiError(
			'Failed to fetch user profile',
			500,
			error
		);
	}
}

/**
 * Get all users with optional filtering
 */
export async function getUsers(options: UserQueryOptions = {}): Promise<UserProfile[]> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Instead of admin.listUsers, we'll need to fetch users from the accelr8_users table
		// and rely on RLS policies to restrict access
		const { data: extendedUsers, error } = await supabase
			.from('accelr8_users')
			.select('*');

		if (error) throw error;

		if (!extendedUsers) {
			return [];
		}

		// Get the current authenticated user
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (!currentUser) {
			throw new ApiError('Not authenticated', 401);
		}

		// We'll only have access to users in accelr8_users
		let filteredUserIds = extendedUsers.map(user => user.id);

		// Apply role filter if specified (using the data we have)
		if (options.role && options.role !== 'all') {
			filteredUserIds = extendedUsers
				.filter(user => user.role === options.role)
				.map(user => user.id);
		}

		// Apply search filter if specified
		if (options.search) {
			const searchTerm = options.search.toLowerCase();
			filteredUserIds = extendedUsers
				.filter(user =>
					user.email?.toLowerCase().includes(searchTerm) ||
					user.name?.toLowerCase().includes(searchTerm)
				)
				.map(user => user.id);
		}

		// Apply pagination if specified
		let paginatedUsers = extendedUsers;
		if (options.limit) {
			const offset = options.offset || 0;
			paginatedUsers = extendedUsers.slice(offset, offset + options.limit);
			filteredUserIds = paginatedUsers.map(user => user.id);
		}

		// 3. Fetch all Sanity person documents for these users
		const sanityPersonIds = extendedUsers
			.filter(user => user.sanity_person_id)
			.map(user => user.sanity_person_id) as string[];

		let sanityPersons: any[] = [];
		if (sanityPersonIds.length > 0) {
			sanityPersons = await sanityClient.fetch(
				`*[_type == "person" && _id in $ids]`,
				{ ids: sanityPersonIds }
			);
		}

		// Create a map for quick lookup
		const sanityPersonMap = sanityPersons.reduce((map, person) => {
			map[person._id] = person;
			return map;
		}, {} as Record<string, any>);

		// 4. Filter by house if specified
		if (options.houseId) {
			sanityPersons = sanityPersons.filter(person =>
				person.house && person.house._ref === options.houseId
			);

			// Only include users with sanity profiles in this house
			const housePersonIds = new Set(sanityPersons.map(person => person._id));
			filteredUserIds = extendedUsers
				.filter(user => user.sanity_person_id && housePersonIds.has(user.sanity_person_id))
				.map(user => user.id);
		}

		// 5. Build and return user profiles
		return extendedUsers
			.filter(user => filteredUserIds.includes(user.id))
			.map(user => {
				const authUser: SupabaseAuthUser = {
					id: user.id,
					email: user.email,
					role: user.role as UserRole,
					sanity_person_id: user.sanity_person_id,
					onboarding_completed: user.onboarding_completed || false
				};

				const sanityPerson = user.sanity_person_id ?
					sanityPersonMap[user.sanity_person_id] :
					null;

				return enhanceUserWithSanityData(user, sanityPerson);
			});
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new ApiError(
			'Failed to fetch users',
			500,
			error
		);
	}
}

/**
 * Get users by house ID
 */
export async function getUsersByHouse(houseId: string): Promise<UserProfile[]> {
	return getUsers({ houseId, role: 'resident' });
}

/**
 * Create a new user with profile
 */
export async function createUser(data: UserProfileInput): Promise<UserProfile> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Validate required fields
		if (!data.email) {
			throw new ApiError('Email is required', 400);
		}

		// Generate a random password for the new user
		const temporaryPassword = Math.random().toString(36).slice(-8);

		// 1. Create Sanity person document if needed
		let sanityPersonId: string | undefined = undefined;

		if (data.sanityPerson) {
			const sanityResult = await sanityClient.create({
				_type: 'person',
				name: data.sanityPerson.name || data.email?.split('@')[0],
				email: data.email,
				role: data.sanityPerson.role,
				bio: data.sanityPerson.bio,
				isResident: data.sanityPerson.isResident || (data.role === 'resident'),
				isTeamMember: data.sanityPerson.isTeamMember || false,
				house: data.sanityPerson.house ? { _type: 'reference', _ref: data.sanityPerson.house?._ref } : undefined,
				company: data.sanityPerson.company,
				socialLinks: data.sanityPerson.socialLinks
			});
			sanityPersonId = sanityResult._id;
		}

		// 2. Create Supabase auth user via signup
		// Note: This requires a sign-up function that's publicly accessible
		// For admin purposes, this should be moved to a secure server endpoint
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: data.email,
			password: temporaryPassword,
			options: {
				data: {
					role: data.role || 'applicant',
					onboarding_completed: data.onboarding_completed || false,
					...(sanityPersonId && { sanity_person_id: sanityPersonId })
				}
			}
		});

		if (authError) throw authError;
		if (!authData.user) {
			throw new ApiError('Failed to create user', 500);
		}

		// 3. Create extended user data
		const extendedUserData = {
			id: authData.user.id,
			email: data.email,
			role: data.role || 'applicant',
			onboarding_completed: data.onboarding_completed || false,
			sanity_person_id: sanityPersonId,
			phone_number: data.phone_number,
			emergency_contact_name: data.emergency_contact_name,
			emergency_contact_phone: data.emergency_contact_phone
		};

		const { error: extendedError } = await supabase
			.from('accelr8_users')
			.insert(extendedUserData);

		if (extendedError) throw extendedError;

		// 4. Return the complete user profile
		return getUser(authData.user.id) as Promise<UserProfile>;
	} catch (error) {
		console.error('Error creating user:', error);
		throw new ApiError(
			'Failed to create user',
			500,
			error
		);
	}
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, data: UserProfileInput): Promise<UserProfile> {
	try {
		console.log('🔍 updateUser called with id:', id);
		console.log('🔍 updateUser data:', JSON.stringify(data, null, 2));

		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Get current user for permission check
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (!currentUser) {
			throw new ApiError('Not authenticated', 401);
		}

		// Only allow users to update their own profiles unless they're admins
		if (id !== currentUser.id &&
			currentUser.user_metadata?.role !== 'admin' &&
			currentUser.user_metadata?.role !== 'super_admin') {
			throw new ApiError('Not authorized to update other users', 403);
		}

		// Check if the user exists
		const existingUser = await getUser(id);
		console.log('🔍 existingUser found:', existingUser ? 'yes' : 'no');

		if (!existingUser) {
			console.error('❌ User not found with id:', id);
			throw new ApiError('User not found', 404);
		}

		// 1. Update Sanity person if it exists and changes were provided
		if (existingUser.sanity_person_id && data.sanityPerson) {
			console.log('🔍 Updating Sanity person with id:', existingUser.sanity_person_id);
			// Prepare Sanity updates
			const sanityUpdates: Record<string, any> = {
				_id: existingUser.sanity_person_id,
				_type: 'person'
			};

			// Add all provided fields
			if (data.sanityPerson.name) sanityUpdates.name = data.sanityPerson.name;
			if (data.sanityPerson.bio) sanityUpdates.bio = data.sanityPerson.bio;
			if (data.sanityPerson.role) sanityUpdates.role = data.sanityPerson.role;
			if (data.sanityPerson.company) sanityUpdates.company = data.sanityPerson.company;
			if (data.sanityPerson.isResident !== undefined) sanityUpdates.isResident = data.sanityPerson.isResident;
			if (data.sanityPerson.isTeamMember !== undefined) sanityUpdates.isTeamMember = data.sanityPerson.isTeamMember;
			if (data.sanityPerson.house) {
				sanityUpdates.house = {
					_type: 'reference',
					_ref: data.sanityPerson.house._ref
				};
			}
			if (data.sanityPerson.socialLinks) {
				sanityUpdates.socialLinks = data.sanityPerson.socialLinks;
			}

			console.log('🔍 Sanity updates:', JSON.stringify(sanityUpdates, null, 2));

			// Only update if there are changes
			if (Object.keys(sanityUpdates).length > 2) {
				try {
					await sanityClient.patch(existingUser.sanity_person_id).set(sanityUpdates).commit();
					console.log('✅ Sanity person updated successfully');
				} catch (error) {
					console.error('❌ Error updating Sanity person:', error);
					throw error;
				}
			}
		}

		// 2. Update auth user metadata if changes were provided
		if (data.role || data.onboarding_completed !== undefined) {
			console.log('🔍 Updating auth user metadata');
			const updates = {
				...(data.role && { role: data.role }),
				...(data.onboarding_completed !== undefined && { onboarding_completed: data.onboarding_completed })
			};

			if (Object.keys(updates).length > 0) {
				try {
					// Update via updateUser (current user only)
					if (id === currentUser.id) {
						await supabase.auth.updateUser({
							data: updates
						});
					} else {
						// This is an admin operation - move to admin-only API endpoint
						console.log('⚠️ Skipping auth metadata update - requires admin rights');
						// Alternatively, update just the accelr8_users table with this info
						await supabase
							.from('accelr8_users')
							.update({
								role: data.role,
								onboarding_completed: data.onboarding_completed
							})
							.eq('id', id);
					}
					console.log('✅ User metadata updated successfully');
				} catch (error) {
					console.error('❌ Error updating auth user metadata:', error);
					throw error;
				}
			}
		}

		// 3. Update extended user data if changes were provided
		const extendedUpdates = {
			...(data.phone_number !== undefined && { phone_number: data.phone_number }),
			...(data.emergency_contact_name !== undefined && { emergency_contact_name: data.emergency_contact_name }),
			...(data.emergency_contact_phone !== undefined && { emergency_contact_phone: data.emergency_contact_phone })
		};

		console.log('🔍 Extended updates:', JSON.stringify(extendedUpdates, null, 2));

		if (Object.keys(extendedUpdates).length > 0) {
			try {
				await supabase
					.from('accelr8_users')
					.update(extendedUpdates)
					.eq('id', id);
				console.log('✅ Extended user data updated successfully');
			} catch (error) {
				console.error('❌ Error updating extended user data:', error);
				throw error;
			}
		}

		// 4. Return the updated user
		console.log('✅ Update completed, fetching updated user');
		return getUser(id) as Promise<UserProfile>;
	} catch (error) {
		console.error('❌ Error updating user:', error);
		throw new ApiError(
			'Failed to update user',
			500,
			error
		);
	}
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Get the current user for permission check
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (!currentUser) {
			throw new ApiError('Not authenticated', 401);
		}

		// Only allow users to delete their own accounts unless they're admins
		if (id !== currentUser.id &&
			currentUser.user_metadata?.role !== 'admin' &&
			currentUser.user_metadata?.role !== 'super_admin') {
			throw new ApiError('Not authorized to delete other users', 403);
		}

		// 1. Get the user to check Sanity ID
		const user = await getUser(id);
		if (!user) {
			throw new ApiError('User not found', 404);
		}

		// 2. Delete Sanity person if exists
		if (user.sanity_person_id) {
			await sanityClient.delete(user.sanity_person_id);
		}

		// 3. Delete from accelr8_users table first
		const { error: deleteUserError } = await supabase
			.from('accelr8_users')
			.delete()
			.eq('id', id);

		if (deleteUserError) throw deleteUserError;

		// 4. For self-deletion, use auth.signOut()
		if (id === currentUser.id) {
			await supabase.auth.signOut();
		} else {
			// This is an admin operation that should be moved to a secure server endpoint
			console.log('⚠️ Admin user deletion not supported through client API');
		}

		return true;
	} catch (error) {
		console.error('Error deleting user:', error);
		throw new ApiError(
			'Failed to delete user',
			500,
			error
		);
	}
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(supabaseServerClient: any): Promise<UserProfile | null> {
	try {
		// 1. Get session data
		const { data: { session } } = await supabaseServerClient.auth.getSession();

		if (!session?.user) return null;

		// 2. Get the complete user profile
		return getUser(session.user.id);
	} catch (error) {
		console.error('Error fetching current user:', error);
		return null;
	}
} 