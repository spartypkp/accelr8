import {
	createRoomFromInput,
	enhanceRoomWithSanityData
} from '../enhancers/rooms';
import { createSanityClient } from '../sanity/client';
import { createClient } from '../supabase/server';
import { Room, SupabaseRoom } from '../types';
import { ApiError } from './shared/error';

/**
 * Input type for creating/updating a room
 */
export type RoomInput = Partial<Room>;

/**
 * Query options for filtering rooms
 */
export interface RoomQueryOptions {
	houseId?: string;
	status?: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'all';
	floor?: number;
	minPrice?: number;
	maxPrice?: number;
	limit?: number;
	offset?: number;
}

/**
 * Get a single room by ID with complete data
 */
export async function getRoom(id: string): Promise<Room | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Get room data from Supabase
		const { data: roomData, error } = await supabase
			.from('rooms')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !roomData) {
			if (error?.code === 'PGRST116') {
				return null; // Not found
			}
			throw error;
		}

		// 2. Fetch room type data
		const roomType = await sanityClient.fetch(
			`*[_type == "roomType" && _id == $id][0]`,
			{ id: roomData.sanity_room_type_id }
		);

		// 3. Enhance and return combined data
		return enhanceRoomWithSanityData(roomData, roomType);
	} catch (error) {
		console.error('Error fetching room:', error);
		throw new ApiError(
			'Failed to fetch room details',
			500,
			error
		);
	}
}

/**
 * Get all rooms with optional filtering
 */
export async function getRooms(options: RoomQueryOptions = {}): Promise<Room[]> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Build Supabase query with filters
		let query = supabase.from('rooms').select('*');

		// Apply filters
		if (options.houseId) {
			query = query.eq('sanity_house_id', options.houseId);
		}

		if (options.status && options.status !== 'all') {
			query = query.eq('status', options.status);
		}

		if (options.floor !== undefined) {
			query = query.eq('floor', options.floor);
		}

		if (options.minPrice !== undefined) {
			query = query.gte('current_price', options.minPrice);
		}

		if (options.maxPrice !== undefined) {
			query = query.lte('current_price', options.maxPrice);
		}

		// Apply pagination
		if (options.limit !== undefined) {
			query = query.limit(options.limit);
		}

		if (options.offset !== undefined) {
			query = query.range(
				options.offset,
				options.offset + (options.limit || 10) - 1
			);
		}

		// 2. Fetch rooms from Supabase
		const { data: rooms, error } = await query;

		if (error) throw error;
		if (!rooms || rooms.length === 0) return [];

		// 3. Get unique Sanity IDs for room types
		const roomTypeIds = [...new Set(rooms.map(room => room.sanity_room_type_id))];

		// 4. Fetch all room types
		const roomTypes = await sanityClient.fetch(
			`*[_type == "roomType" && _id in $ids]`,
			{ ids: roomTypeIds }
		);

		// 5. Create lookup map for efficient access
		const roomTypeMap = roomTypes.reduce((map: any, type: any) => {
			map[type._id] = type;
			return map;
		}, {});

		// 6. Enhance and return rooms
		return rooms.map((room: SupabaseRoom) => {
			return enhanceRoomWithSanityData(
				room,
				roomTypeMap[room.sanity_room_type_id]
			);
		});
	} catch (error) {
		console.error('Error fetching rooms:', error);
		throw new ApiError(
			'Failed to fetch rooms',
			500,
			error
		);
	}
}

/**
 * Get available rooms
 */
export async function getAvailableRooms(houseId?: string): Promise<Room[]> {
	return getRooms({
		status: 'available',
		houseId
	});
}

/**
 * Get rooms by house
 */
export async function getRoomsByHouse(houseId: string): Promise<Room[]> {
	return getRooms({ houseId });
}

/**
 * Create a new room
 */
export async function createRoom(data: RoomInput): Promise<Room> {
	try {
		const supabase = await createClient();

		// Validate required fields
		if (!data.sanity_house_id) {
			throw new ApiError('House ID is required', 400);
		}

		if (!data.sanity_room_type_id) {
			throw new ApiError('Room type ID is required', 400);
		}

		if (!data.room_number) {
			throw new ApiError('Room number is required', 400);
		}

		// Create room in Supabase using the helper function
		const roomData = createRoomFromInput({
			sanity_house_id: data.sanity_house_id,
			sanity_room_type_id: data.sanity_room_type_id,
			room_number: data.room_number,
			floor: data.floor,
			status: data.status as 'available' | 'occupied' | 'maintenance' | 'reserved',
			current_price: data.current_price
		});

		// Insert the room
		const { data: newRoom, error } = await supabase
			.from('rooms')
			.insert(roomData)
			.select('*')
			.single();

		if (error) throw error;

		// Return the complete room
		return getRoom(newRoom.id) as Promise<Room>;
	} catch (error) {
		console.error('Error creating room:', error);
		throw new ApiError(
			'Failed to create room',
			500,
			error
		);
	}
}

/**
 * Update an existing room
 */
export async function updateRoom(id: string, data: RoomInput): Promise<Room> {
	try {
		const supabase = await createClient();

		// Check if the room exists
		const existingRoom = await getRoom(id);
		if (!existingRoom) {
			throw new ApiError('Room not found', 404);
		}

		// Update room in Supabase
		const { data: updatedRoom, error } = await supabase
			.from('rooms')
			.update({
				...(data.room_number && { room_number: data.room_number }),
				...(data.floor !== undefined && { floor: data.floor }),
				...(data.status && { status: data.status }),
				...(data.current_price !== undefined && { current_price: data.current_price }),
				...(data.special_notes !== undefined && { special_notes: data.special_notes }),
				...(data.maintenance_notes !== undefined && { maintenance_notes: data.maintenance_notes })
			})
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw error;

		// Return the updated room
		return getRoom(updatedRoom.id) as Promise<Room>;
	} catch (error) {
		console.error('Error updating room:', error);
		throw new ApiError(
			'Failed to update room',
			500,
			error
		);
	}
}

/**
 * Delete a room
 */
export async function deleteRoom(id: string): Promise<boolean> {
	try {
		const supabase = await createClient();

		// Check if the room exists
		const existingRoom = await getRoom(id);
		if (!existingRoom) {
			throw new ApiError('Room not found', 404);
		}

		// Delete room from Supabase
		const { error } = await supabase
			.from('rooms')
			.delete()
			.eq('id', id);

		if (error) throw error;

		return true;
	} catch (error) {
		console.error('Error deleting room:', error);
		throw new ApiError(
			'Failed to delete room',
			500,
			error
		);
	}
}

/**
 * Assign a resident to a room
 */
export async function assignRoom(
	roomId: string,
	residentId: string,
	leaseDetails: {
		startDate: string;
		endDate: string;
		price?: number;
	}
): Promise<Room> {
	try {
		const supabase = await createClient();

		// Check if the room exists and is available
		const room = await getRoom(roomId);
		if (!room) {
			throw new ApiError('Room not found', 404);
		}

		if (room.status !== 'available' && room.status !== 'reserved') {
			throw new ApiError('Room is not available for assignment', 400);
		}

		// Update room with resident and lease details
		const { data: updatedRoom, error } = await supabase
			.from('rooms')
			.update({
				status: 'occupied',
				current_resident_id: residentId,
				lease_start_date: leaseDetails.startDate,
				lease_end_date: leaseDetails.endDate,
				...(leaseDetails.price && { current_price: leaseDetails.price })
			})
			.eq('id', roomId)
			.select('*')
			.single();

		if (error) throw error;

		// Return the updated room
		return getRoom(updatedRoom.id) as Promise<Room>;
	} catch (error) {
		console.error('Error assigning room:', error);
		throw new ApiError(
			'Failed to assign room',
			500,
			error
		);
	}
} 