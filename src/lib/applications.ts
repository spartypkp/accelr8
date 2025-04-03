import { createClient } from './supabase/client';

export type ApplicationData = {
	user_id?: string; // May be null for non-authenticated users
	sanity_house_id: string;
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
 * Get Sanity house ID from slug
 */
export async function getHouseIdFromSlug(slug: string) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('houses_lookup')
		.select('sanity_id')
		.eq('slug', slug)
		.single();

	if (error) {
		console.error('Error getting house ID:', error);
		// Return default ID if lookup fails
		return 'default-house-id';
	}

	return data?.sanity_id;
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