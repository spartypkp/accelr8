import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './sanity';
import { createClient } from './supabase/server';

// Sanity Content Types
export interface SanityHouse {
	_id: string;
	name: string;
	description?: string;
	location?: {
		address?: string;
		city?: string;
		state?: string;
		zip?: string;
		country?: string;
		neighborhood?: string;
		coordinates?: {
			lat: number;
			lng: number;
		};
	};
	amenities?: SanityAmenity[];
	mainImage?: SanityImageSource;
	gallery?: SanityImageSource[];
	slug?: { current: string; };
	featured?: boolean;
}

export interface SanityAmenity {
	_id: string;
	name: string;
	description?: string;
	icon?: string;
	category?: string;
}

export interface SanityPerson {
	_id: string;
	name: string;
	bio?: string;
	skills?: string[];
	profileImage?: SanityImageSource;
	socialLinks?: {
		twitter?: string;
		linkedin?: string;
		github?: string;
		website?: string;
	};
	role?: string;
}

export interface SanityResource {
	_id: string;
	name: string;
	description?: string;
	type?: string;
	location?: string;
	capacity?: number;
	bookingCost?: number;
	amenities?: string[];
	image?: SanityImageSource;
	availableNow?: boolean;
}

// Supabase Data Types
export interface SupabaseUser {
	id: string;
	display_name?: string;
	email?: string;
	phone?: string;
	created_at?: string;
	updated_at?: string;
	sanity_person_id?: string;
	house_id?: string;
	role?: string;
	status?: string;
	[key: string]: any; // For additional fields
}

export interface SupabaseRoom {
	id: string;
	sanity_house_id: string;
	room_number?: string;
	room_type?: string;
	capacity?: number;
	price_monthly?: number;
	is_available?: boolean;
	floor?: number;
	square_footage?: number;
	created_at?: string;
	updated_at?: string;
	status?: 'available' | 'occupied' | 'maintenance';
	monthly_rate?: number;
}

export interface ResourceBooking {
	id: string;
	sanity_resource_id: string;
	sanity_house_id: string;
	user_id: string;
	title: string;
	description?: string;
	start_time: string;
	end_time: string;
	guests?: number;
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
	created_at?: string;
	updated_at?: string;
	user?: {
		id: string;
		display_name?: string;
		email?: string;
	};
}

export interface MaintenanceRequest {
	id: string;
	sanity_house_id: string;
	room_id?: string;
	requested_by: string;
	title: string;
	description: string;
	priority: 'low' | 'medium' | 'high' | 'emergency';
	status: 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
	location?: string;
	room_details?: string;
	assigned_to?: string;
	resolution_notes?: string;
	estimated_completion?: string;
	actual_completion?: string;
	created_at?: string;
	updated_at?: string;
	requested_by_user?: SupabaseUser;
}

export interface MaintenanceComment {
	id: string;
	maintenance_request_id: string;
	user_id: string;
	comment: string;
	is_internal: boolean;
	created_at?: string;
	updated_at?: string;
	user?: SupabaseUser;
}

// Combined Types
export interface HouseWithRooms extends SanityHouse {
	rooms: SupabaseRoom[];
}

export interface UserProfile extends SupabaseUser {
	profile?: SanityPerson;
}

export interface ResourceWithBookings {
	resources: (SanityResource & { availableNow: boolean; })[];
	bookings: ResourceBooking[];
}

export interface ResourceAvailability {
	available: boolean;
	conflictingBookings: ResourceBooking[];
}

/**
 * Fetch house data from both Sanity CMS and Supabase
 */
export async function getHouse(houseId: string): Promise<HouseWithRooms | null> {
	// Get content data from Sanity
	const houseContent = await sanityClient.fetch<SanityHouse>(
		`*[_type == "house" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      description,
      location,
      amenities[]->,
      mainImage,
      gallery
    }`,
		{ slug: houseId }
	);

	if (!houseContent) {
		return null;
	}

	// Get operational data from Supabase
	const supabase = await createClient();

	const { data: roomsData } = await supabase
		.from('rooms')
		.select('*')
		.eq('sanity_house_id', houseContent._id);

	// Combine the data
	return {
		...houseContent,
		rooms: roomsData || []
	};
}

/**
 * Fetch houses overview
 */
export async function getHouses(): Promise<SanityHouse[]> {
	return sanityClient.fetch<SanityHouse[]>(
		`*[_type == "house" && defined(slug.current)]{
      _id,
      name,
      slug,
      location,
      mainImage,
      featured
    }`
	);
}

/**
 * Get user profile combining data from Supabase and Sanity
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
	if (!userId) return null;

	const supabase = await createClient();

	// Get user from Supabase
	const { data: userData } = await supabase
		.from('accelr8_users')
		.select('*')
		.eq('id', userId)
		.single();

	if (!userData || !userData.sanity_person_id) {
		return userData;
	}

	// Get public profile from Sanity
	const sanityProfile = await sanityClient.fetch<SanityPerson>(
		`*[_type == "person" && _id == $personId][0]{
      _id,
      name,
      bio,
      skills,
      profileImage as image,
      socialLinks
    }`,
		{ personId: userData.sanity_person_id }
	);

	// Return combined profile
	return {
		...userData,
		profile: sanityProfile
	};
}

/**
 * Get homepage content from Sanity
 */
export async function getHomepage(): Promise<{
	title: string;
	description: string;
	content: any[];
}> {
	console.log('Homepage data now managed directly by Next.js in page.tsx');

	// Return a mock homepage object for any components that might still use this function
	return {
		title: "Accelr8 - Accelerate Your Startup Journey",
		description: "Join a community of founders, builders, and innovators in a high-talent-density living environment designed to help you succeed.",
		content: []
	};
}

/**
 * Get resource bookings for a house
 */
export async function getResourceBookings(houseId: string, userId?: string): Promise<ResourceWithBookings> {
	// Get resources from Sanity
	const resources = await sanityClient.fetch<SanityResource[]>(`
    *[_type == "resource" && references($houseId)]{
      _id,
      name,
      description,
      type,
      location,
      capacity,
      bookingCost,
      amenities,
      image
    }
  `, { houseId });

	// Get bookings from Supabase
	const supabase = await createClient();

	let query = supabase
		.from('resource_bookings')
		.select(`
      *,
      user:user_id (
        id, 
        display_name, 
        email
      )
    `)
		.eq('sanity_house_id', houseId)
		.gte('end_time', new Date().toISOString())
		.order('start_time', { ascending: true });

	// If userId is provided, filter to show only that user's bookings
	if (userId) {
		query = query.eq('user_id', userId);
	}

	const { data: bookings, error } = await query;

	if (error) {
		console.error('Error fetching resource bookings:', error);
		throw error;
	}

	// Check which resources are currently available
	const now = new Date();
	const availableResourceIds = new Set(resources.map(r => r._id));

	// Remove resources that have ongoing bookings
	bookings?.forEach(booking => {
		const startTime = new Date(booking.start_time);
		const endTime = new Date(booking.end_time);

		if (now >= startTime && now <= endTime && booking.status === 'confirmed') {
			availableResourceIds.delete(booking.sanity_resource_id);
		}
	});

	// Add availability flag to resources
	const resourcesWithAvailability = resources.map(resource => ({
		...resource,
		availableNow: availableResourceIds.has(resource._id)
	}));

	return {
		resources: resourcesWithAvailability,
		bookings: bookings || []
	};
}

/**
 * Get a specific user's resource bookings
 */
export async function getUserResourceBookings(userId: string): Promise<ResourceBooking[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('resource_bookings')
		.select(`
      *,
      user:user_id (
        id, 
        display_name, 
        email
      )
    `)
		.eq('user_id', userId)
		.gte('end_time', new Date().toISOString())
		.order('start_time', { ascending: true });

	if (error) {
		console.error('Error fetching user resource bookings:', error);
		throw error;
	}

	return data || [];
}

/**
 * Get bookings for a specific resource
 */
export async function getResourceBookingsById(resourceId: string): Promise<ResourceBooking[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('resource_bookings')
		.select(`
      *,
      user:user_id (
        id, 
        display_name, 
        email
      )
    `)
		.eq('sanity_resource_id', resourceId)
		.gte('start_time', new Date().toISOString())
		.order('start_time', { ascending: true });

	if (error) {
		console.error('Error fetching resource bookings by ID:', error);
		throw error;
	}

	return data || [];
}

/**
 * Check if a resource is available during a specific time
 */
export async function checkResourceAvailability(
	resourceId: string,
	startTime: string,
	endTime: string
): Promise<ResourceAvailability> {
	const supabase = await createClient();

	// Find any bookings that overlap with the requested time
	const { data: conflictingBookings, error } = await supabase
		.from('resource_bookings')
		.select('*')
		.eq('sanity_resource_id', resourceId)
		.eq('status', 'confirmed')
		.or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

	if (error) {
		console.error('Error checking resource availability:', error);
		throw error;
	}

	return {
		available: (conflictingBookings?.length || 0) === 0,
		conflictingBookings: conflictingBookings || []
	};
}

/**
 * Create a new resource booking
 */
export async function createResourceBooking(bookingData: {
	sanity_resource_id: string;
	user_id: string;
	sanity_house_id: string;
	title: string;
	description?: string;
	start_time: string;
	end_time: string;
	guests?: number;
}): Promise<ResourceBooking> {
	const supabase = await createClient();

	// First check for availability
	const { available } = await checkResourceAvailability(
		bookingData.sanity_resource_id,
		bookingData.start_time,
		bookingData.end_time
	);

	if (!available) {
		throw new Error('Resource is not available during the requested time');
	}

	const { data, error } = await supabase
		.from('resource_bookings')
		.insert([{
			...bookingData,
			status: 'confirmed' // Auto-confirm for now, could be 'pending' if approvals are needed
		}])
		.select();

	if (error) {
		console.error('Error creating resource booking:', error);
		throw error;
	}

	if (!data || data.length === 0) {
		throw new Error('Failed to create resource booking');
	}

	return data[0];
}

/**
 * Update an existing resource booking
 */
export async function updateResourceBooking(
	bookingId: string,
	updates: Partial<{
		title: string;
		description: string;
		start_time: string;
		end_time: string;
		status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
		guests: number;
	}>
): Promise<ResourceBooking> {
	const supabase = await createClient();

	// If updating time, check for conflicts
	if (updates.start_time || updates.end_time) {
		// Get the current booking
		const { data: currentBooking } = await supabase
			.from('resource_bookings')
			.select('*')
			.eq('id', bookingId)
			.single();

		if (currentBooking) {
			const { available } = await checkResourceAvailability(
				currentBooking.sanity_resource_id,
				updates.start_time || currentBooking.start_time,
				updates.end_time || currentBooking.end_time
			);

			if (!available) {
				throw new Error('Resource is not available during the requested time');
			}
		}
	}

	const { data, error } = await supabase
		.from('resource_bookings')
		.update(updates)
		.eq('id', bookingId)
		.select();

	if (error) {
		console.error('Error updating resource booking:', error);
		throw error;
	}

	if (!data || data.length === 0) {
		throw new Error('Failed to update resource booking');
	}

	return data[0];
}

/**
 * Cancel a resource booking
 */
export async function cancelResourceBooking(bookingId: string): Promise<ResourceBooking> {
	return updateResourceBooking(bookingId, { status: 'cancelled' });
}

// Maintenance Requests API Functions
export async function getMaintenanceRequests(
	houseId: string,
	userId?: string,
	status?: string
): Promise<MaintenanceRequest[]> {
	const supabase = await createClient();

	let query = supabase
		.from('maintenance_requests')
		.select(`
      *,
      requested_by:requested_by (
        id,
        display_name,
        email,
        sanity_person_id
      )
    `)
		.eq('sanity_house_id', houseId);

	if (userId) {
		query = query.eq('requested_by', userId);
	}

	if (status && status !== 'All') {
		// Map UI-friendly status to database status
		const dbStatus =
			status === 'In Progress' ? 'in_progress' :
				status === 'Scheduled' ? 'assigned' :
					status === 'Completed' ? 'completed' :
						status.toLowerCase();

		query = query.eq('status', dbStatus);
	}

	query = query.order('created_at', { ascending: false });

	const { data, error } = await query;

	if (error) {
		console.error('Error fetching maintenance requests:', error);
		throw error;
	}

	return data || [];
}

export async function createMaintenanceRequest(requestData: {
	sanity_house_id: string;
	room_id?: string;
	requested_by: string;
	title: string;
	description: string;
	priority: 'low' | 'medium' | 'high' | 'emergency';
	location?: string;
	room_details?: string;
}): Promise<MaintenanceRequest> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('maintenance_requests')
		.insert([{
			...requestData,
			status: 'open' // New requests always start as open
		}])
		.select();

	if (error) {
		console.error('Error creating maintenance request:', error);
		throw error;
	}

	if (!data || data.length === 0) {
		throw new Error('Failed to create maintenance request');
	}

	return data[0];
}

export async function updateMaintenanceRequest(
	requestId: string,
	updates: Partial<{
		status: 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
		priority: 'low' | 'medium' | 'high' | 'emergency';
		description: string;
		assigned_to: string;
		resolution_notes: string;
		estimated_completion: string;
		actual_completion: string;
	}>
): Promise<MaintenanceRequest> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('maintenance_requests')
		.update(updates)
		.eq('id', requestId)
		.select();

	if (error) {
		console.error('Error updating maintenance request:', error);
		throw error;
	}

	if (!data || data.length === 0) {
		throw new Error('Failed to update maintenance request');
	}

	return data[0];
}

export async function getMaintenanceRequestComments(requestId: string): Promise<MaintenanceComment[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('maintenance_comments')
		.select(`
			*,
			user:user_id (
				id,
				display_name,
				email,
				sanity_person_id
			)
		`)
		.eq('maintenance_request_id', requestId)
		.order('created_at', { ascending: true });

	if (error) {
		console.error('Error fetching maintenance comments:', error);
		throw error;
	}

	return data || [];
}

export async function createMaintenanceComment(commentData: {
	maintenance_request_id: string;
	user_id: string;
	comment: string;
	is_internal?: boolean;
}): Promise<MaintenanceComment> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('maintenance_comments')
		.insert([{
			...commentData,
			is_internal: commentData.is_internal || false
		}])
		.select();

	if (error) {
		console.error('Error creating maintenance comment:', error);
		throw error;
	}

	if (!data || data.length === 0) {
		throw new Error('Failed to create maintenance comment');
	}

	return data[0];
} 