"use server";
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

		// 1. Fetch operational data from Supabase first using UUID
		const { data: houseData, error: supabaseError } = await supabase
			.from('house_operations')
			.select('*')
			.eq('id', id)
			.single();

		if (supabaseError) {
			throw new Error(`Error fetching house operational data: ${supabaseError.message}`);
		}

		if (!houseData) {
			return null;
		}

		// 2. Use sanity_house_id to fetch content data from Sanity
		const sanityHouseId = houseData.sanity_house_id;
		const sanityHouse = await sanityClient.fetch(
			`*[_type == "house" && _id == $sanityHouseId][0]`,
			{ sanityHouseId }
		);

		// 3. Enhance house data with Sanity content
		const house = enhanceHouseWithSanityData(houseData, sanityHouse as unknown as SanityHouse);

		// 4. Add location data
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

		// 1. Fetch operations data from Supabase with filters
		let query = supabase.from('house_operations').select('*');

		// Apply status filter if specified
		if (options.status === 'active') {
			query = query.eq('status', 'open');
		} else if (options.status === 'inactive') {
			query = query.in('status', ['planned', 'closed']);
		}

		// Apply pagination if specified
		if (options.limit) {
			const offset = options.offset || 0;
			query = query.range(offset, offset + options.limit - 1);
		}

		const { data: operations, error } = await query;

		if (error) {
			throw error;
		}

		if (!operations || operations.length === 0) {
			return [];
		}

		// 2. Collect all Sanity IDs
		const sanityIds = operations.map(op => op.sanity_house_id).filter(Boolean);

		// 3. Fetch all corresponding Sanity houses
		let sanityHouses: any[] = [];
		if (sanityIds.length > 0) {
			sanityHouses = await sanityClient.fetch(
				`*[_type == "house" && _id in $ids] | order(name asc)`,
				{ ids: sanityIds }
			);
		}

		// 4. Create a map for quick lookup
		const sanityHousesMap = sanityHouses.reduce((map, house) => {
			map[house._id] = house;
			return map;
		}, {} as Record<string, any>);

		// 5. Apply location filter if specified (on the combined data)
		let filteredOperations = [...operations];
		if (options.location && (options.location.city || options.location.state)) {
			filteredOperations = operations.filter(op => {
				const sanityHouse = sanityHousesMap[op.sanity_house_id];
				if (!sanityHouse || !sanityHouse.location) return false;

				if (options.location?.city &&
					!sanityHouse.location.city?.toLowerCase().includes(options.location.city.toLowerCase())) {
					return false;
				}

				if (options.location?.state &&
					!sanityHouse.location.state?.toLowerCase().includes(options.location.state.toLowerCase())) {
					return false;
				}

				return true;
			});
		}

		// 6. Combine and enhance the houses
		return filteredOperations.map(operation => {
			const enhancedHouse = enhanceHouseWithSanityData(
				operation,
				sanityHousesMap[operation.sanity_house_id] as unknown as SanityHouse
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
 * This returns houses with status 'open'
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
			// active: data.active !== undefined ? data.active : true - removed
			// Add status value to Sanity doc as well, using the one from our input
			status: data.status || 'planned'
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

		// 1. First fetch the house from Supabase to get the sanity_house_id
		const { data: houseData, error: fetchError } = await supabase
			.from('house_operations')
			.select('*')
			.eq('id', id)
			.single();

		if (fetchError || !houseData) {
			throw new ApiError('House not found', 404);
		}

		const sanityHouseId = houseData.sanity_house_id;

		// 2. Prepare data for updates
		// Prepare Sanity update data
		const sanityData: any = {};
		if (data.name) sanityData.name = data.name;
		if (data.shortDescription) sanityData.shortDescription = data.shortDescription;
		if (data.capacity) sanityData.capacity = data.capacity;
		// Add other Sanity fields as needed

		// Prepare Supabase operations data
		const operationsData = createHouseOperationsFromInput({
			...data,
			sanity_house_id: sanityHouseId // Maintain the same Sanity reference
		});

		// 3. Update both systems in parallel
		const [sanityResult, supabaseResult] = await Promise.all([
			// Update Sanity document (only if we have data to update)
			Object.keys(sanityData).length > 0
				? sanityClient.patch(sanityHouseId).set(sanityData).commit()
				: sanityClient.fetch(`*[_type == "house" && _id == $id][0]`, { id: sanityHouseId }),

			// Update Supabase operations using UUID
			supabase
				.from('house_operations')
				.update(operationsData)
				.eq('id', id)
				.select('*')
				.single()
		]);

		if (supabaseResult.error) {
			throw new ApiError('Failed to update house operations', 500, supabaseResult.error);
		}

		// 4. Return enhanced house
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

		// 1. First fetch the house from Supabase to get the sanity_house_id
		const { data: houseData, error: fetchError } = await supabase
			.from('house_operations')
			.select('sanity_house_id')
			.eq('id', id)
			.single();

		if (fetchError || !houseData) {
			throw new ApiError('House not found', 404);
		}

		const sanityHouseId = houseData.sanity_house_id;

		// 2. Delete from both systems in parallel
		const [sanityResult, supabaseResult] = await Promise.all([
			// Delete from Sanity
			sanityClient.delete(sanityHouseId),

			// Delete from Supabase
			supabase
				.from('house_operations')
				.delete()
				.eq('id', id)
		]);

		if (supabaseResult.error) {
			throw new ApiError('Failed to delete house operations', 500, supabaseResult.error);
		}

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

/**
 * Updates a house's main image
 */
export async function updateHouseMainImage(
	houseId: string,
	imageData: FormData,
	altText?: string
): Promise<House | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. First fetch the house to get sanity_house_id
		const { data: houseData, error: fetchError } = await supabase
			.from('house_operations')
			.select('*')
			.eq('id', houseId)
			.single();

		if (fetchError || !houseData) {
			throw new ApiError('House not found', 404);
		}

		const sanityHouseId = houseData.sanity_house_id;

		// 2. Extract the file from FormData
		const file = imageData.get('file') as File;
		if (!file) {
			throw new ApiError('No file provided', 400);
		}

		// 3. Upload the image to Sanity's asset pipeline
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const asset = await sanityClient.assets.upload('image', buffer, {
			filename: file.name,
			contentType: file.type,
		});

		// 4. Update the house document with the new image reference
		const sanityResult = await sanityClient
			.patch(sanityHouseId)
			.set({
				mainImage: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: asset._id
					},
					alt: altText || ''
				}
			})
			.commit();

		// 5. Return the updated house
		const house = enhanceHouseWithSanityData(houseData, sanityResult as unknown as SanityHouse);
		return addHouseLocationData(house);
	} catch (error) {
		console.error('Error updating house main image:', error);
		throw new ApiError('Failed to update house image', 500, error);
	}
}

/**
 * Adds images to a house's gallery
 */
export async function addHouseGalleryImages(
	houseId: string,
	formData: FormData,
	metadata?: Array<{
		alt?: string,
		caption?: string;
	}>
): Promise<House | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. First fetch the house to get sanity_house_id
		const { data: houseData, error: fetchError } = await supabase
			.from('house_operations')
			.select('*')
			.eq('id', houseId)
			.single();

		if (fetchError || !houseData) {
			throw new ApiError('House not found', 404);
		}

		const sanityHouseId = houseData.sanity_house_id;

		// 2. Extract files from FormData
		// FormData uses the same key for multiple files, so we need to use getAll
		const files = formData.getAll('files') as File[];

		if (!files || files.length === 0) {
			throw new ApiError('No files provided', 400);
		}

		// 3. Upload each image and create image objects
		const imageObjects: Array<{
			_type: string;
			_key: string;
			asset: {
				_type: string;
				_ref: string;
			};
			alt: string;
			caption: string;
		}> = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const meta = metadata && metadata[i] ? metadata[i] : {};

			// Upload to Sanity
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			const asset = await sanityClient.assets.upload('image', buffer, {
				filename: file.name,
				contentType: file.type,
			});

			// Create image object with unique key
			imageObjects.push({
				_type: 'image',
				_key: new Date().getTime().toString() + i,
				asset: {
					_type: 'reference',
					_ref: asset._id
				},
				alt: meta.alt || '',
				caption: meta.caption || ''
			});
		}

		// 4. Update the Sanity document, appending to the gallery
		const sanityResult = await sanityClient
			.patch(sanityHouseId)
			.setIfMissing({ galleryImages: [] })
			.append('galleryImages', imageObjects)
			.commit();

		// 5. Return the updated house
		const house = enhanceHouseWithSanityData(houseData, sanityResult as unknown as SanityHouse);
		return addHouseLocationData(house);
	} catch (error) {
		console.error('Error adding house gallery images:', error);
		throw new ApiError('Failed to add gallery images', 500, error);
	}
}

/**
 * Removes an image from a house's gallery
 */
export async function removeHouseGalleryImage(
	houseId: string,
	imageKey: string
): Promise<House | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. First fetch the house to get sanity_house_id
		const { data: houseData, error: fetchError } = await supabase
			.from('house_operations')
			.select('*')
			.eq('id', houseId)
			.single();

		if (fetchError || !houseData) {
			throw new ApiError('House not found', 404);
		}

		const sanityHouseId = houseData.sanity_house_id;

		// 2. Remove the image with the matching key from the gallery
		const sanityResult = await sanityClient
			.patch(sanityHouseId)
			.unset([`galleryImages[_key=="${imageKey}"]`])
			.commit();

		// 3. Return the updated house
		const house = enhanceHouseWithSanityData(houseData, sanityResult as unknown as SanityHouse);
		return addHouseLocationData(house);
	} catch (error) {
		console.error('Error removing house gallery image:', error);
		throw new ApiError('Failed to remove gallery image', 500, error);
	}
} 