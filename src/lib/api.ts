import { sanityClient } from './sanity';
import { createClient } from './supabase/server';

/**
 * Fetch house data from both Sanity CMS and Supabase
 */
export async function getHouse(houseId: string) {
	// Get content data from Sanity
	const houseContent = await sanityClient.fetch(
		`*[_type == "house" && _id == $houseId][0]{
      _id,
      name,
      description,
      location,
      amenities[]->,
      mainImage,
      gallery
    }`,
		{ houseId }
	);

	if (!houseContent) {
		return null;
	}

	// Get operational data from Supabase
	const supabase = await createClient();

	const { data: roomsData } = await supabase
		.from('rooms')
		.select('*')
		.eq('sanity_house_id', houseId);

	// Combine the data
	return {
		...houseContent,
		rooms: roomsData || []
	};
}

/**
 * Fetch houses overview
 */
export async function getHouses() {
	return sanityClient.fetch(
		`*[_type == "house" && defined(slug.current)]{
      _id,
      name,
      slug,
      location,
      mainImage,
      featured
    }`
	);
}

/**
 * Get user profile combining data from Supabase and Sanity
 */
export async function getUserProfile(userId: string) {
	if (!userId) return null;

	const supabase = await createClient();

	// Get user from Supabase
	const { data: userData } = await supabase
		.from('accelr8_users')
		.select('*')
		.eq('id', userId)
		.single();

	if (!userData || !userData.sanity_person_id) {
		return userData;
	}

	// Get public profile from Sanity
	const sanityProfile = await sanityClient.fetch(
		`*[_type == "person" && _id == $personId][0]{
      _id,
      name,
      bio,
      skills,
      image,
      socialLinks
    }`,
		{ personId: userData.sanity_person_id }
	);

	// Return combined profile
	return {
		...userData,
		profile: sanityProfile
	};
}

/**
 * Get homepage content from Sanity
 */
export async function getHomepage() {
	return sanityClient.fetch(`
    *[_type == "mainPage" && slug.current == "home"][0]{
      title,
      description,
      openGraph,
      content[] {
        _type == 'hero' => {
          heading,
          subheading,
          ctaText,
          ctaLink,
          image
        },
        _type == 'featureSection' => {
          heading,
          subheading,
          features[] {
            title,
            description,
            icon
          }
        },
        _type == 'housePreviewSection' => {
          heading,
          subheading,
          "houses": *[_type == "house" && featured == true] {
            _id,
            name,
            slug,
            location,
            mainImage
          }
        }
      }
    }
  `);
}

/**
 * Get resource bookings for a house
 */
export async function getResourceBookings(houseId: string) {
	// Get resources from Sanity
	const resources = await sanityClient.fetch(`
    *[_type == "resource" && references($houseId)]{
      _id,
      name,
      description,
      type,
      image
    }
  `, { houseId });

	// Get bookings from Supabase
	const supabase = await createClient();

	const { data: bookings } = await supabase
		.from('resource_bookings')
		.select('*')
		.eq('sanity_house_id', houseId)
		.gte('end_time', new Date().toISOString())
		.order('start_time', { ascending: true });

	return {
		resources,
		bookings: bookings || []
	};
} 