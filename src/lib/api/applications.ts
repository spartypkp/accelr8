"use server";
import {
	EnhancedApplication,
	addApplicationStatusInfo,
	enhanceApplication
} from '../enhancers/applications';
import { createSanityClient } from '../sanity/client';
import { createClient } from '../supabase/server';
import { ApplicationStatus, SupabaseApplication } from '../types';
import { ApiError } from './shared/error';

/**
 * Interface for application query options
 */
export interface ApplicationQueryOptions {
	houseId?: string;
	status?: ApplicationStatus | 'all';
	search?: string;
	limit?: number;
	offset?: number;
	fromDate?: string;
	toDate?: string;
}

/**
 * Interface for application input data
 */
export interface ApplicationInput {
	house_id: string;
	preferred_move_in: string;
	preferred_duration: string;
	status: string;
	responses: {
		personalInfo: {
			firstName: string;
			lastName: string;
			email: string;
			phone: string;
			dob: string;
		};
		preferences: {
			location: string;
			roomType: string;
			moveInDate: string;
			duration: string;
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
}

/**
 * Interface for application data
 */
export interface Application extends ApplicationInput {
	id: string;
	created_at: string;
	updated_at: string;
}

/**
 * Get applications with optional filtering
 */
export async function getApplications(options: ApplicationQueryOptions = {}): Promise<EnhancedApplication[]> {
	try {
		const supabase = await createClient();
		const sanityClient = createSanityClient();

		// Start with a base query
		let query = supabase
			.from('applications')
			.select('*');

		// Apply filters
		if (options.status && options.status !== 'all') {
			query = query.eq('status', options.status);
		}

		if (options.houseId) {
			query = query.contains('preferred_houses', [options.houseId]);
		}

		if (options.search) {
			query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
		}

		// Apply date filters
		if (options.fromDate) {
			query = query.gte('created_at', options.fromDate);
		}

		if (options.toDate) {
			query = query.lte('created_at', options.toDate);
		}

		// Apply pagination
		if (options.limit) {
			query = query.limit(options.limit);
		}

		if (options.offset) {
			query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
		}

		// Execute the query
		const { data: applications, error } = await query;

		if (error) throw error;
		if (!applications || applications.length === 0) return [];

		// Get Sanity person IDs if available
		const sanityPersonIds = applications
			.filter(app => app.sanity_person_id)
			.map(app => app.sanity_person_id as string);

		// Fetch related Sanity persons in bulk if any
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

		// Fetch interviews for the applications
		const applicationsIds = applications.map(app => app.id);
		const { data: interviews } = await supabase
			.from('application_interviews')
			.select('*')
			.in('application_id', applicationsIds);

		// Group interviews by application id
		const interviewsByApplication = interviews?.reduce((map, interview) => {
			if (!map[interview.application_id]) {
				map[interview.application_id] = [];
			}
			map[interview.application_id].push(interview);
			return map;
		}, {} as Record<string, any[]>) || {};

		// Enhance and return applications
		return applications.map(app => {
			return enhanceApplication(
				app,
				{
					sanityPerson: app.sanity_person_id ? sanityPersonMap[app.sanity_person_id] : undefined,
					interviews: interviewsByApplication[app.id]
				}
			);
		});
	} catch (error) {
		console.error('Error fetching applications:', error);
		throw new ApiError('Failed to fetch applications', 500, error);
	}
}

/**
 * Get a specific application by ID
 */
export async function getApplicationById(id: string): Promise<EnhancedApplication | null> {
	try {
		const supabase = await createClient();
		const sanityClient = createSanityClient();

		// Fetch the application
		const { data: application, error } = await supabase
			.from('applications')
			.select('*')
			.eq('id', id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') return null; // Not found
			throw error;
		}

		// Fetch Sanity person if available
		let sanityPerson = null;
		if (application.sanity_person_id) {
			sanityPerson = await sanityClient.fetch(
				`*[_type == "person" && _id == $id][0]`,
				{ id: application.sanity_person_id }
			);
		}

		// Fetch interviews for this application
		const { data: interviews } = await supabase
			.from('application_interviews')
			.select('*')
			.eq('application_id', id);

		// Enhance and return the application
		return enhanceApplication(
			application,
			{
				sanityPerson,
				interviews: interviews || []
			}
		);
	} catch (error) {
		console.error(`Error fetching application with ID ${id}:`, error);
		throw new ApiError('Failed to fetch application', 500, error);
	}
}

/**
 * Create a new application
 */
export async function createApplication(data: Partial<SupabaseApplication>): Promise<EnhancedApplication> {
	try {
		const supabase = await createClient();

		// Validate required fields
		if (!data.email) {
			throw new ApiError('Email is required', 400);
		}

		if (!data.name) {
			throw new ApiError('Name is required', 400);
		}

		// Insert into Supabase
		const { data: newApplication, error } = await supabase
			.from('applications')
			.insert({
				email: data.email,
				name: data.name,
				phone: data.phone,
				status: data.status || 'draft',
				preferred_move_in: data.preferred_move_in,
				preferred_duration: data.preferred_duration,
				preferred_houses: data.preferred_houses,
				bio: data.bio,
				responses: data.responses,
				referral_source: data.referral_source
			})
			.select('*')
			.single();

		if (error) throw error;

		// Return the enhanced application
		return enhanceApplication(newApplication);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		console.error('Error creating application:', error);
		throw new ApiError('Failed to create application', 500, error);
	}
}

/**
 * Update an application's status
 */
export async function updateApplicationStatus(
	id: string,
	status: Exclude<ApplicationStatus, ApplicationStatus.Draft>
): Promise<EnhancedApplication> {
	try {
		const supabase = await createClient();

		// Update status in database
		const { data: updatedApplication, error } = await supabase
			.from('applications')
			.update({
				status,
				...(status === ApplicationStatus.Reviewing ? { reviewed_at: new Date().toISOString() } : {}),
				...(status === ApplicationStatus.Submitted && !status ? { submitted_at: new Date().toISOString() } : {})
			})
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw error;
		if (!updatedApplication) throw new ApiError('Application not found', 404);

		// Get the enhanced application with all associated data
		return getApplicationById(id) as Promise<EnhancedApplication>;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		console.error(`Error updating application ${id} status:`, error);
		throw new ApiError('Failed to update application status', 500, error);
	}
}

/**
 * Get application with status info
 */
export async function getApplicationWithStatusInfo(id: string) {
	const application = await getApplicationById(id);
	if (!application) return null;

	return addApplicationStatusInfo(application);
}

/**
 * Get a house ID from a slug
 */
export async function getHouseIdFromSlug(slug: string): Promise<string> {
	try {
		// This is a placeholder implementation
		// In a real application, this would query the database or CMS

		// For now, just return the slug as if it were an ID
		return slug;
	} catch (error) {
		console.error(`Error fetching house ID for slug ${slug}:`, error);
		throw new ApiError('Failed to find house for the given location', 400);
	}
} 