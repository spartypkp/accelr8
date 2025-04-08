import { Person as SanityPerson } from '../sanity/sanity.types';
import { SupabaseAuthUser, SupabaseExtendedUser, UserProfile } from '../types';

/**
 * Enhances a Supabase user with Sanity person data
 */
export function enhanceUserWithSanityData(
	extendedUser: SupabaseExtendedUser,
	sanityPerson?: SanityPerson | null
): UserProfile {
	// Start with the base user (which already has all SupabaseExtendedUser properties)
	const enhancedUser: UserProfile = {
		...extendedUser,

		// Add Sanity data if available
		sanityPerson: sanityPerson || undefined
	};

	return enhancedUser;
}

/**
 * Calculate user-specific metrics and properties
 */
export function calculateUserMetrics(user: UserProfile): {
	isResident: boolean;
	isActive: boolean;
	hasEmergencyContact: boolean;
	lastActiveTimestamp?: number;
	daysSinceLastActive?: number;
	hasFullProfile: boolean;
} {
	const now = new Date();

	// Check if user is a resident
	const isResident = user.sanityPerson?.isResident || false;

	// Calculate activity information
	let lastActiveTimestamp: number | undefined;
	let daysSinceLastActive: number | undefined;

	if (user.last_active) {
		const lastActiveDate = new Date(user.last_active);
		lastActiveTimestamp = lastActiveDate.getTime();
		daysSinceLastActive = Math.ceil((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
	}

	// Check if user has been active in the last 7 days
	const isActive = daysSinceLastActive !== undefined && daysSinceLastActive <= 7;

	// Check if user has emergency contact information
	const hasEmergencyContact = !!(user.emergency_contact_name && user.emergency_contact_phone);

	// Check if user has a full profile
	const hasFullProfile = isResident &&
		!!user.sanityPerson?.profileImage &&
		!!user.sanityPerson?.bio;

	return {
		isResident,
		isActive,
		hasEmergencyContact,
		lastActiveTimestamp,
		daysSinceLastActive,
		hasFullProfile
	};
}

/**
 * User with house information
 */
export interface UserWithHouseInfo extends UserProfile {
	houseName?: string;
	houseId?: string;
	roomNumber?: string;
}

/**
 * Creates a Supabase extended user from auth user
 */
export function createExtendedUserFromAuth(
	authUser: SupabaseAuthUser,
	data?: {
		phone_number?: string;
		emergency_contact_name?: string;
		emergency_contact_phone?: string;
	}
): Partial<SupabaseExtendedUser> {
	return {
		id: authUser.id,
		...data,
		last_active: new Date().toISOString()
	};
} 