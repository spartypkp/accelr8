import { createClient } from './supabase/client';

export type ApplicationData = {
	user_id?: string; // May be null for non-authenticated users
	house_id: string; // Now using a direct house ID instead of a Sanity reference
	preferred_move_in: string;
	preferred_duration: string;
	status: 'draft' | 'submitted' | 'reviewing' | 'interview' | 'approved' | 'rejected' | 'waitlisted';
	responses: {
		personalInfo: {
			firstName: string;
			lastName: string;
			email: string;
			phone: string;
			dob: string;
		};
		preferences: {
			roomType: string;
		};
		background: {
			role: string;
			company: string;
			linkedin?: string;
			github?: string;
			website?: string;
			workDescription: string;
			goals: string;
		};
		additional: {
			howHeard: string;
			referredBy?: string;
			knownResidents?: string;
			dietaryRestrictions?: string;
			additionalInfo?: string;
		};
	};
	rejection_reason?: string;
	admin_notes?: string;
};

/**
 * Submit an application to Supabase
 */
export async function submitApplication(applicationData: ApplicationData) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('applications')
		.insert([applicationData])
		.select();

	if (error) {
		console.error('Error submitting application:', error);
		throw new Error(`Failed to submit application: ${error.message}`);
	}

	return data?.[0];
}

/**
 * Get house ID from slug - now using a hardcoded mapping without Sanity
 */
export async function getHouseIdFromSlug(slug: string) {
	// Map slug to house ID using a hardcoded mapping
	const houseMapping: Record<string, string> = {
		'sf-nob-hill': 'house-sf-1',
		'sf-mission': 'house-sf-2',
		'nyc-brooklyn': 'house-nyc-1',
		'la-venice': 'house-la-1',
	};

	return houseMapping[slug] || 'default-house-id';
}

/**
 * Save draft application
 */
export async function saveDraftApplication(applicationData: ApplicationData) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('applications')
		.insert([{ ...applicationData, status: 'draft' }])
		.select();

	if (error) {
		console.error('Error saving draft application:', error);
		throw new Error(`Failed to save draft: ${error.message}`);
	}

	return data?.[0];
}

/**
 * Get application by ID
 */
export async function getApplicationById(id: string) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('applications')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error getting application:', error);
		return null;
	}

	return data;
} 