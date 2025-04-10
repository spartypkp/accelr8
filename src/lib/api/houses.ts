"use server";
import { SanityDocument } from 'next-sanity';
import {
	addHouseLocationData,
	createHouseOperationsFromInput,
	enhanceHouseWithSanityData
} from '../enhancers/houses';
import { createSanityClient } from '../sanity/client';
import { House as SanityHouse } from '../sanity/sanity.types';
import { createClient } from '../supabase/server';
import {
	House,
	SupabaseHouseOperations
} from '../types';
import { ApiError } from './shared/error';
/**
 * Input type for creating/updating a house
 */
export type HouseInput = {
	name?: string;
	slug?: string;
	active?: boolean;
	shortDescription?: string;
	capacity?: number;
	location?: {
		address?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
	};
} & Partial<SupabaseHouseOperations>;

/**
 * Query options for filtering houses
 */
export interface HouseQueryOptions {
	status?: 'active' | 'all' | 'inactive';
	location?: {
		city?: string;
		state?: string;
	};
	limit?: number;
	offset?: number;
}

/**
 * Get a single house by ID with complete operational data
 */
export async function getHouse(id: string): Promise<House | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Fetch from both sources in parallel
		const [sanityHouse, operationsResult] = await Promise.all([
			sanityClient.fetch(`*[_type == "house" && _id == $id][0]`, { id }),
			supabase
				.from('house_operations')
				.select('*')
				.eq('sanity_house_id', id)
				.single()
		]);

		if (!sanityHouse) return null;

		// 2. Enhance house data with Sanity content
		const house = enhanceHouseWithSanityData(operationsResult.data, sanityHouse as unknown as SanityHouse);

		// 3. Add location data
		return addHouseLocationData(house);
	} catch (error) {
		console.error('Error fetching house:', error);
		throw new ApiError(
			'Failed to fetch house details',
			500,
			error
		);
	}
}

/**
 * Get all houses with optional filtering
 */
export async function getHouses(options: HouseQueryOptions = {}): Promise<House[]> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Build Sanity query based on options
		let query = '*[_type == "house"';

		// Handle active filter
		if (options.status === 'active') {
			query += ' && active == true';
		} else if (options.status === 'inactive') {
			query += ' && (active == false || !defined(active))';
		}

		// Handle location filter
		if (options.location) {
			if (options.location.city) {
				query += ` && location.city match "${options.location.city}"`;
			}
			if (options.location.state) {
				query += ` && location.state match "${options.location.state}"`;
			}
		}

		// Close query and add ordering
		query += '] | order(name asc)';

		// Add pagination if specified
		if (options.limit) {
			const offset = options.offset || 0;
			query += `[${offset}...${offset + options.limit}]`;
		}

		// Fetch houses from Sanity
		const sanityHouses = await sanityClient.fetch(query);

		// Fetch all operations data from Supabase
		const { data: operations } = await supabase
			.from('house_operations')
			.select('*');

		// Create a map for quick lookup
		const operationsMap = operations ?
			operations.reduce((map, op) => {
				map[op.sanity_house_id] = op;
				return map;
			}, {} as Record<string, SupabaseHouseOperations>) :
			{};

		// Map and enhance the houses
		return sanityHouses.map((house: any) => {
			const enhancedHouse = enhanceHouseWithSanityData(
				operationsMap[house._id],
				house as unknown as SanityHouse
			);
			return addHouseLocationData(enhancedHouse);
		});
	} catch (error) {
		console.error('Error fetching houses:', error);
		throw new ApiError(
			'Failed to fetch houses',
			500,
			error
		);
	}
}

/**
 * Get active houses only
 */
export async function getActiveHouses(): Promise<House[]> {
	return getHouses({ status: 'active' });
}

/**
 * Create a new house (requires data in both Sanity and Supabase)
 */
export async function createHouse(data: HouseInput): Promise<House | null> {
	let sanityHouseId: string | null = null;

	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Prepare Sanity document
		// Use type assertion to allow additional properties
		const sanityData: any = {
			_type: 'house',
			name: data.name || 'New House',
			active: data.active !== undefined ? data.active : true
		};

		// Add optional fields if provided
		if (data.slug) {
			sanityData.slug = {
				_type: 'slug',
				current: data.slug
			};
		}

		if (data.shortDescription) {
			sanityData.shortDescription = data.shortDescription;
		}

		if (data.capacity) {
			sanityData.capacity = data.capacity;
		}

		if (data.location) {
			sanityData.location = { ...data.location };
		}

		// Create the Sanity document
		const sanityHouse = await sanityClient.create(sanityData);
		sanityHouseId = sanityHouse._id;

		try {
			// 2. Create operations record in Supabase
			const operationsData = createHouseOperationsFromInput({
				...data,
				sanity_house_id: sanityHouseId
			});

			const { data: operationsResult, error } = await supabase
				.from('house_operations')
				.insert(operationsData)
				.select('*')
				.single();

			if (error) throw error;

			// 3. Return enhanced house object
			const house = enhanceHouseWithSanityData(operationsResult, sanityHouse as unknown as SanityHouse);
			return addHouseLocationData(house);
		} catch (supabaseError) {
			// Supabase failed, roll back Sanity
			if (sanityHouseId) {
				await sanityClient.delete(sanityHouseId)
					.catch(err => console.error('Rollback failed:', err));
			}
			throw supabaseError;
		}
	} catch (error) {
		console.error('Error creating house:', error);
		throw new ApiError(
			'Failed to create house',
			500,
			error
		);
	}
}

/**
 * Update an existing house
 */
export async function updateHouse(id: string, data: HouseInput): Promise<House | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Check if the house exists first
		const existingHouse = await getHouse(id);
		if (!existingHouse) {
			throw new ApiError('House not found', 404);
		}

		// Prepare Sanity update data - TODO: Use proper Sanity house update logic
		const sanityData: any = {};
		if (data.name) sanityData.name = data.name;

		// Prepare Supabase operations data
		const operationsData = createHouseOperationsFromInput({
			...data,
			sanity_house_id: id
		});

		// Update both systems in parallel
		const [sanityResult, supabaseResult] = await Promise.all([
			// Update Sanity document (only if we have data to update)
			Object.keys(sanityData).length > 0
				? sanityClient.patch(id).set(sanityData).commit()
				: (existingHouse.sanityHouse as unknown as SanityDocument<SanityHouse>),

			// Update Supabase operations
			supabase
				.from('house_operations')
				.update(operationsData)
				.eq('sanity_house_id', id)
				.select('*')
				.single()
		]);

		// Return enhanced house
		const house = enhanceHouseWithSanityData(supabaseResult.data, sanityResult as unknown as SanityHouse);
		return addHouseLocationData(house);
	} catch (error) {
		console.error('Error updating house:', error);
		throw new ApiError(
			'Failed to update house',
			500,
			error
		);
	}
}

/**
 * Delete a house and its operational data
 */
export async function deleteHouse(id: string): Promise<boolean> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// Delete from both systems in parallel
		const [sanityResult, supabaseResult] = await Promise.all([
			// Delete from Sanity
			sanityClient.delete(id),

			// Delete from Supabase
			supabase
				.from('house_operations')
				.delete()
				.eq('sanity_house_id', id)
		]);

		return true;
	} catch (error) {
		console.error('Error deleting house:', error);
		throw new ApiError(
			'Failed to delete house',
			500,
			error
		);
	}
}

/**
 * Get houses by location
 */
export async function getHousesByLocation(
	city: string,
	state?: string
): Promise<House[]> {
	return getHouses({
		location: { city, state },
		status: 'active'
	});
} 