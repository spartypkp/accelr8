import {
	deleteHouse,
	getHouse,
	updateHouse
} from '@/lib/api/houses';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/houses/[id] - Fetch a single house by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		const house = await getHouse(params.id);

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			house,
			getCacheHeaders('HOUSE')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * PUT /api/houses/[id] - Update an existing house
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		const data = await request.json();

		const updatedHouse = await updateHouse(params.id, data);

		if (!updatedHouse) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedHouse);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * DELETE /api/houses/[id] - Delete a house
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		const success = await deleteHouse(params.id);

		if (!success) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		return handleApiError(error);
	}
} 