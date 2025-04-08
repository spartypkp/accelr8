import { RoomType as SanityRoomType } from '../sanity/sanity.types';
import { Room, SupabaseRoom } from '../types';

/**
 * Enhances a Supabase room with Sanity room type data
 */
export function enhanceRoomWithSanityData(
	roomOperations: SupabaseRoom,
	sanityRoomType?: SanityRoomType | null
): Room {
	// Start with the base room (which already has all SupabaseRoom properties)
	const enhancedRoom: Room = {
		...roomOperations,

		// Add Sanity data if available
		sanityRoomType: sanityRoomType || undefined
	};

	return enhancedRoom;
}

/**
 * Calculate room-specific metrics and properties
 */
export function calculateRoomMetrics(room: Room): {
	isAvailable: boolean;
	hasResident: boolean;
	daysUntilAvailable?: number;
	currentPrice: number;
	hasFullContent: boolean;
	leaseRemainingDays?: number;
} {
	const now = new Date();

	// Check if room is available
	const isAvailable = room.status === 'available';

	// Check if room has a resident
	const hasResident = !!room.current_resident_id;

	// Calculate days until available (if has end date)
	let daysUntilAvailable: number | undefined;
	if (room.lease_end_date && !isAvailable) {
		const endDate = new Date(room.lease_end_date);
		daysUntilAvailable = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		if (daysUntilAvailable < 0) daysUntilAvailable = undefined; // Lease already ended
	}

	// Calculate remaining days in current lease
	let leaseRemainingDays: number | undefined;
	if (room.lease_end_date && hasResident) {
		const endDate = new Date(room.lease_end_date);
		leaseRemainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		if (leaseRemainingDays < 0) leaseRemainingDays = 0; // Lease already ended
	}

	// Get price from current price or room type base price
	const currentPrice = room.current_price || room.sanityRoomType?.basePrice || 0;

	// Check if room has full content from Sanity
	const hasFullContent = !!room.sanityRoomType;

	return {
		isAvailable,
		hasResident,
		daysUntilAvailable,
		currentPrice,
		hasFullContent,
		leaseRemainingDays
	};
}

/**
 * Room with resident information
 */
export interface RoomWithResidentInfo extends Room {
	residentName?: string;
	residentEmail?: string;
	residentProfileUrl?: string;
}

/**
 * Creates a Supabase room record from input data
 */
export function createRoomFromInput(
	data: {
		sanity_house_id: string;
		sanity_room_type_id: string;
		room_number: string;
		floor?: number;
		status?: 'available' | 'occupied' | 'maintenance' | 'reserved';
		current_price?: number;
	}
): Partial<SupabaseRoom> {
	return {
		...data,
		status: data.status || 'available'
	};
} 