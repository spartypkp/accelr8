import {
	createRoom,
	getRooms,
	RoomInput,
	RoomQueryOptions
} from '@/lib/api/rooms';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for room query parameters
const roomsQuerySchema = z.object({
	houseId: z.string().optional(),
	status: z.enum(['available', 'occupied', 'maintenance', 'reserved', 'all']).optional(),
	floor: z.coerce.number().optional(),
	minPrice: z.coerce.number().optional(),
	maxPrice: z.coerce.number().optional(),
	limit: z.coerce.number().optional(),
	offset: z.coerce.number().optional()
});

// Schema for creating a room
const createRoomSchema = z.object({
	house: z.object({
		id: z.string()
	}),
	type: z.object({
		id: z.string()
	}),
	roomNumber: z.string(),
	floor: z.number().optional(),
	status: z.enum(['available', 'occupied', 'maintenance', 'reserved']).optional(),
	currentPrice: z.number().optional(),
	specialNotes: z.string().optional()
});

/**
 * GET /api/rooms - Get rooms with optional filtering
 */
export async function GET(request: NextRequest) {
	try {
		// Parse and validate query parameters
		const { searchParams } = new URL(request.url);
		const validatedParams = await withValidation(
			roomsQuerySchema,
			Object.fromEntries(searchParams)
		);

		// Fetch rooms with provided filters
		const rooms = await getRooms(validatedParams as RoomQueryOptions);

		return NextResponse.json(rooms);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * POST /api/rooms - Create a new room
 */
export async function POST(request: NextRequest) {
	try {
		// Parse and validate request body
		const body = await request.json();
		const validatedData = await withValidation(createRoomSchema, body);

		// Create the room
		const room = await createRoom(validatedData as RoomInput);

		return NextResponse.json(room, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
} 