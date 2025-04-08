import { getActiveHouses } from '@/lib/api/houses';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { NextResponse } from 'next/server';

/**
 * GET /api/houses/active - List all active houses
 */
export async function GET() {
	try {
		const houses = await getActiveHouses();

		return NextResponse.json(
			houses,
			getCacheHeaders('HOUSE')
		);
	} catch (error) {
		return handleApiError(error);
	}
} 