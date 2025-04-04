import { sanityClient } from '@/lib/sanity';
import { House } from '@/lib/sanity.types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { houseId: string; }; }
) {
	const houseId = params.houseId;

	try {
		// We'll query by slug rather than ID since we use slugs in the URL
		const query = `*[_type == "house" && slug.current == $houseId][0]{
      _id,
      name,
      slug,
      shortDescription,
      fullDescription,
      location,
      mainImage,
      galleryImages,
      amenities,
      roomTypes,
      capacity,
      occupied,
      neighborhoodDetails,
      localResources,
      houseRules,
      faq
    }`;

		const house = await sanityClient.fetch<House>(query, { houseId });

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(house);
	} catch (error) {
		console.error('Error fetching house details:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch house details' },
			{ status: 500 }
		);
	}
} 