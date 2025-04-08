import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { getUsersByHouse } from '@/lib/api/users';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/house/[houseId] - Get all residents of a specific house
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { houseId: string; }; }
) {
	try {
		const users = await getUsersByHouse(params.houseId);

		return NextResponse.json(
			users,
			getCacheHeaders('USER')
		);
	} catch (error) {
		return handleApiError(error);
	}
} 