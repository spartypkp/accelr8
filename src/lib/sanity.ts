import { createClient, SanityClient } from 'next-sanity';
import { SanityImageAsset, SanityImageCrop, SanityImageHotspot } from './sanity.types';

// Defining a union type for all possible Sanity image sources based on the generated types
export type SanityImage = {
	asset?: {
		_ref: string;
		_type: 'reference';
		_weak?: boolean;
	};
	media?: unknown;
	hotspot?: SanityImageHotspot;
	crop?: SanityImageCrop;
	alt?: string;
	_type: 'image';
} | SanityImageAsset | string;

// SANITY CONFIGURATION
// ===================
// To allow client-side requests to Sanity:
// 1. Go to manage.sanity.io
// 2. Navigate to your project settings
// 3. Go to API > CORS origins
// 4. Add http://localhost:3000 for development
// 5. Add your production domain (e.g., https://yourdomain.com)
// 6. Check "Allow credentials" for both if needed
// 
// Alternatively, use server-side API routes like we've implemented in:
// - /app/api/houses/route.ts (for listing houses)
// - /app/api/houses/[houseId]/route.ts (for single house details)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-03-25';

export const createSanityClient = (): SanityClient => {
	const client = createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: process.env.NODE_ENV === 'production' // Use CDN in production, live API in development
	});

	return client;
}; 