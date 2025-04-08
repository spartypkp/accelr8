import { createHouse, getHouses, HouseQueryOptions } from '@/lib/api/houses';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/houses - List all houses with optional filtering
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		// Parse query parameters
		const options: HouseQueryOptions = {};

		// Status filter
		const status = searchParams.get('status');
		if (status && ['active', 'inactive', 'all'].includes(status as string)) {
			options.status = status as 'active' | 'inactive' | 'all';
		}

		// Location filters
		const city = searchParams.get('city');
		const state = searchParams.get('state');
		if (city || state) {
			options.location = {};
			if (city) options.location.city = city;
			if (state) options.location.state = state;
		}

		// Pagination
		const limit = searchParams.get('limit');
		const offset = searchParams.get('offset');
		if (limit) options.limit = parseInt(limit, 10);
		if (offset) options.offset = parseInt(offset, 10);

		// Fetch houses with the parsed options
		const houses = await getHouses(options);

		return NextResponse.json(
			houses,
			getCacheHeaders('HOUSE')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * POST /api/houses - Create a new house
 */
export async function POST(request: NextRequest) {
	try {
		const data = await request.json();

		// TODO: Add authentication/authorization check for admin access

		const newHouse = await createHouse(data);

		return NextResponse.json(
			newHouse,
			{ status: 201 }
		);
	} catch (error) {
		return handleApiError(error);
	}
} 