'use server';
import { User } from '@supabase/supabase-js';
import {
	enhanceUserWithSanityData
} from '../enhancers/users';
import { createSanityClient } from '../sanity/client';
import { createClient } from '../supabase/server';
import { SupabaseAuthUser, SupabaseExtendedUser, UserProfile } from '../types';
import { ApiError } from './shared/error';
/**
 * Input type for creating/updating a user
 */
export type UserProfileInput = Partial<UserProfile>;

/**
 * Query options for filtering users
 */
export interface UserQueryOptions {
	role?: 'resident' | 'admin' | 'super_admin' | 'all';
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
			role: (user.user_metadata?.role) as 'resident' | 'admin' | 'super_admin',
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
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Get user auth data
		const { data: authData } = await supabase.auth.admin.getUserById(id);

		if (!authData?.user) {
			return null;
		}

		// Extract auth metadata
		const authUser: SupabaseAuthUser = {
			id: authData.user.id,
			email: authData.user.email,
			role: (authData.user.user_metadata?.role || 'resident') as 'resident' | 'admin' | 'super_admin',
			sanity_person_id: authData.user.user_metadata?.sanity_person_id,
			onboarding_completed: authData.user.user_metadata?.onboarding_completed || false
		};

		// 2. Fetch extended user data and Sanity profile in parallel
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
 * Get all users with optional filtering
 */
export async function getUsers(options: UserQueryOptions = {}): Promise<UserProfile[]> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Fetch users from Supabase Auth (may need to implement pagination)
		const { data: authUsers, error } = await supabase.auth.admin.listUsers();

		if (error) throw error;

		// Apply role filter if specified
		let filteredUsers = authUsers.users;
		if (options.role && options.role !== 'all') {
			filteredUsers = filteredUsers.filter(user =>
				user.user_metadata?.role === options.role
			);
		}

		// Apply search filter if specified
		if (options.search) {
			const searchTerm = options.search.toLowerCase();
			filteredUsers = filteredUsers.filter(user =>
				user.email?.toLowerCase().includes(searchTerm) ||
				user.user_metadata?.name?.toLowerCase().includes(searchTerm)
			);
		}

		// Apply pagination if specified
		if (options.limit) {
			const offset = options.offset || 0;
			filteredUsers = filteredUsers.slice(offset, offset + options.limit);
		}

		// 2. Fetch all extended user data
		const { data: extendedUsers } = await supabase
			.from('accelr8_users')
			.select('*');

		// Create a map for quick lookup
		const extendedUserMap = extendedUsers ?
			extendedUsers.reduce((map, user) => {
				map[user.id] = user;
				return map;
			}, {} as Record<string, SupabaseExtendedUser>) :
			{};

		// 3. Fetch all Sanity person documents for these users
		const sanityPersonIds = filteredUsers
			.map(user => user.user_metadata?.sanity_person_id)
			.filter(Boolean) as string[];

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
			filteredUsers = filteredUsers.filter(user =>
				housePersonIds.has(user.user_metadata?.sanity_person_id)
			);
		}

		// 5. Enhance and return profiles
		return filteredUsers.map(user => {
			const authUser: SupabaseAuthUser = {
				id: user.id,
				email: user.email,
				role: (user.user_metadata?.role || 'resident') as 'resident' | 'admin' | 'super_admin',
				sanity_person_id: user.user_metadata?.sanity_person_id,
				onboarding_completed: user.user_metadata?.onboarding_completed || false
			};

			const extendedUser: SupabaseExtendedUser = {
				...authUser,
				...extendedUserMap[user.id]
			};

			const sanityPerson = authUser.sanity_person_id ?
				sanityPersonMap[authUser.sanity_person_id] :
				null;

			return enhanceUserWithSanityData(extendedUser, sanityPerson);
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

		// 2. Create Supabase auth user with metadata
		const { data: authData, error: authError } = await supabase.auth.admin.createUser({
			email: data.email,
			password: temporaryPassword,
			email_confirm: true,
			user_metadata: {
				role: data.role || 'resident',
				onboarding_completed: data.onboarding_completed || false,
				...(sanityPersonId && { sanity_person_id: sanityPersonId })
			}
		});

		if (authError) throw authError;

		// 3. Create extended user data
		const extendedUserData = {
			id: authData.user.id,
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
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Check if the user exists
		const existingUser = await getUser(id);
		if (!existingUser) {
			throw new ApiError('User not found', 404);
		}

		// 1. Update Sanity person if it exists and changes were provided
		if (existingUser.sanity_person_id && data.sanityPerson) {
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

			// Only update if there are changes
			if (Object.keys(sanityUpdates).length > 2) {
				await sanityClient.patch(existingUser.sanity_person_id).set(sanityUpdates).commit();
			}
		}

		// 2. Update auth user metadata if changes were provided
		if (data.role || data.onboarding_completed !== undefined) {
			const updates = {
				...(data.role && { role: data.role }),
				...(data.onboarding_completed !== undefined && { onboarding_completed: data.onboarding_completed })
			};

			if (Object.keys(updates).length > 0) {
				await supabase.auth.admin.updateUserById(id, {
					user_metadata: {
						...existingUser,
						...updates
					}
				});
			}
		}

		// 3. Update extended user data if changes were provided
		const extendedUpdates = {
			...(data.phone_number !== undefined && { phone_number: data.phone_number }),
			...(data.emergency_contact_name !== undefined && { emergency_contact_name: data.emergency_contact_name }),
			...(data.emergency_contact_phone !== undefined && { emergency_contact_phone: data.emergency_contact_phone })
		};

		if (Object.keys(extendedUpdates).length > 0) {
			await supabase
				.from('accelr8_users')
				.update(extendedUpdates)
				.eq('id', id);
		}

		// 4. Return the updated user
		return getUser(id) as Promise<UserProfile>;
	} catch (error) {
		console.error('Error updating user:', error);
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

		// 1. Get the user to check Sanity ID
		const user = await getUser(id);
		if (!user) {
			throw new ApiError('User not found', 404);
		}

		// 2. Delete Sanity person if exists
		if (user.sanity_person_id) {
			await sanityClient.delete(user.sanity_person_id);
		}

		// 3. Delete from Supabase Auth
		const { error } = await supabase.auth.admin.deleteUser(id);

		if (error) throw error;

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