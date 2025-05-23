'use server';
import { User } from '@supabase/supabase-js';
import {
	enhanceUserWithSanityData
} from '../enhancers/users';
import { createSanityClient } from '../sanity/client';
import { Person as SanityPerson } from '../sanity/sanity.types';
import { createClient } from '../supabase/server';
import { SupabaseAuthUser, SupabaseExtendedUser, UserProfile, UserRole } from '../types';
import { sendResidentInvitation } from './emails';
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
 * Invitation data for directly creating a resident
 */
export interface ResidentInviteData {
	email: string;
	name: string;
	houseId: string;
	moveInDate?: string;
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
 * @param houseId Supabase UUID of the house (house.id)
 * @returns Array of user profiles who are residents of the specified house
 */
export async function getUsersByHouse(houseId: string): Promise<UserProfile[]> {
	return getUsers({ houseId, role: 'resident' });
}

/**
 * Invite a user directly as a resident, bypassing the application process
 * Only admins or super_admins can use this function
 */
export async function inviteResident(data: ResidentInviteData): Promise<UserProfile> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Permission check - only admins can invite residents
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (!currentUser ||
			(currentUser.user_metadata?.role !== 'admin' &&
				currentUser.user_metadata?.role !== 'super_admin')) {
			throw new ApiError('Not authorized to invite residents', 403);
		}

		// Validate required fields
		if (!data.email || !data.name || !data.houseId) {
			throw new ApiError('Email, name, and houseId are required', 400);
		}

		// First, we need to fetch the house operation record to get the Sanity house ID
		const { data: houseData, error: houseError } = await supabase
			.from('house_operations')
			.select('sanity_house_id')
			.eq('id', data.houseId)
			.single();

		if (houseError || !houseData) {
			console.error('Error fetching house data:', houseError);
			throw new ApiError(`House with ID ${data.houseId} not found`, 404);
		}

		if (!houseData.sanity_house_id) {
			throw new ApiError(`House ${data.houseId} has no associated Sanity document`, 400);
		}

		// 1. Create Sanity person document with minimal info and the correct Sanity house ID
		const sanityPerson = await sanityClient.create({
			_type: 'person',
			name: data.name,
			email: data.email,
			role: 'Resident', // Default role
			isResident: true,
			isTeamMember: false,
			house: { _type: 'reference', _ref: houseData.sanity_house_id }, // Use Sanity ID, not Supabase UUID
			startDate: data.moveInDate || new Date().toISOString().split('T')[0]
		});

		// 2. Create an invitation token ID to identify this invite
		const inviteId = crypto.randomUUID();

		// 3. Store invitation metadata in a separate table for verification later
		const { error: inviteError } = await supabase
			.from('user_invitations')
			.insert({
				id: inviteId,
				email: data.email,
				sanity_person_id: sanityPerson._id,
				invited_by: currentUser.id,
				house_id: data.houseId,
				role: 'resident',
				status: 'pending',
				created_at: new Date().toISOString()
			});

		if (inviteError) {
			throw new ApiError(`Failed to create invitation record: ${inviteError.message}`, 500);
		}

		// 4. Get inviter's name
		const inviterProfile = await getUser(currentUser.id);
		const inviterName = inviterProfile?.sanityPerson?.name || 'Accelr8 Admin';

		// 5. Send invitation email using magic link
		const { success, error: emailError } = await sendResidentInvitation(
			data.email,
			data.name,
			inviteId, // We pass the inviteId as the temporaryPassword parameter for tracking
			inviterName
		);

		if (!success) {
			console.warn(`Warning: Invitation email to ${data.email} could not be sent: ${emailError}`);
		}

		// 6. Return a placeholder user profile with minimal information
		// The actual user will be created when they accept the invitation
		return {
			id: inviteId, // Temporary ID
			email: data.email,
			role: 'resident',
			onboarding_completed: false,
			sanity_person_id: sanityPerson._id,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			sanityPerson: {
				_id: sanityPerson._id,
				name: data.name,
				email: data.email,
				isResident: true
			} as Partial<SanityPerson>
		} as UserProfile;
	} catch (error) {
		console.error('Error inviting resident:', error);
		throw new ApiError(
			'Failed to invite resident',
			500,
			error
		);
	}
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

		// 3. Create extended user data (excluding auth metadata fields)
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

/**
 * Updates an invitation status to claimed when a user completes onboarding
 */
export async function claimInvitation(inviteId: string, userId: string): Promise<boolean> {
	try {
		const supabase = await createClient();

		// Update the invitation record
		const { error } = await supabase
			.from('user_invitations')
			.update({
				status: 'claimed',
				claimed_at: new Date().toISOString(),
				user_id: userId
			})
			.eq('id', inviteId);

		if (error) {
			console.error('Error claiming invitation:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Failed to claim invitation:', error);
		return false;
	}
} 