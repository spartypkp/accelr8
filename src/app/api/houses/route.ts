import { sanityClient } from '@/lib/sanity';
import { House } from '@/lib/sanity.types';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const query = `*[_type == "house"]{
      _id,
      name,
      slug,
      shortDescription,
      location,
      mainImage,
      featured
    }`;

		const houses = await sanityClient.fetch<House[]>(query);

		return NextResponse.json(houses);
	} catch (error) {
		console.error('Error fetching houses:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch houses data' },
			{ status: 500 }
		);
	}
} 