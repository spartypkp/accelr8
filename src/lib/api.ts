import { sanityClient } from './sanity';
import { House, Person, Resource } from './sanity.types';
import { createClient } from './supabase/server';

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
export interface HouseWithRooms extends House {
	rooms: SupabaseRoom[];
}

export interface UserProfile extends SupabaseUser {
	profile?: Person;
}

export interface ResourceWithBookings {
	resources: (Resource & { availableNow: boolean; })[];
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
	try {
		// Fetch house data from our API route
		const houseResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/houses/${houseId}`, {
			cache: 'no-store',
			next: { revalidate: 60 } // Revalidate every minute
		});

		if (!houseResponse.ok) {
			if (houseResponse.status === 404) {
				return null;
			}
			throw new Error(`Failed to fetch house: ${houseResponse.status}`);
		}

		const house = await houseResponse.json();

		// For now, let's mock the rooms data since we don't have a database for it yet
		// In a real application, you would fetch this from your database
		const mockRooms: SupabaseRoom[] = [
			{
				id: '1',
				sanity_house_id: house._id,
				room_number: '101',
				room_type: 'single',
				capacity: 1,
				price_monthly: 1900,
				is_available: true,
				status: 'available',
				monthly_rate: 1900
			},
			{
				id: '2',
				sanity_house_id: house._id,
				room_number: '102',
				room_type: 'double',
				capacity: 2,
				price_monthly: 1500,
				is_available: false,
				status: 'occupied',
				monthly_rate: 1500
			},
			{
				id: '3',
				sanity_house_id: house._id,
				room_number: '103',
				room_type: 'single',
				capacity: 1,
				price_monthly: 2000,
				is_available: true,
				status: 'available',
				monthly_rate: 2000
			}
		];

		return {
			...house,
			rooms: mockRooms
		};
	} catch (error) {
		console.error('Error fetching house details:', error);
		return null;
	}
}

/**
 * Fetch houses overview
 */
export async function getHouses(): Promise<House[]> {
	try {
		// Fetch houses data from our API route
		const housesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/houses`, {
			cache: 'no-store',
			next: { revalidate: 60 } // Revalidate every minute
		});

		if (!housesResponse.ok) {
			throw new Error(`Failed to fetch houses: ${housesResponse.status}`);
		}

		const houses = await housesResponse.json();
		return houses;
	} catch (error) {
		console.error('Error fetching houses:', error);
		return [];
	}
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
	const sanityProfile = await sanityClient.fetch<Person>(
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
	// Get resources from Sanity using the generated Resource type
	const resources = await sanityClient.fetch<Resource[]>(`
    *[_type == "resource" && references($houseId)]{
      _id,
      name,
      description,
      resourceType,
      location,
      capacity,
      tags,
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