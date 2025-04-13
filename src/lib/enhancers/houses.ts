import { House as SanityHouse } from '../sanity/sanity.types';
import { House, SupabaseHouseOperations } from '../types';

/**
 * Enhances a Supabase house with Sanity data
 */
export function enhanceHouseWithSanityData(
	houseOperations: SupabaseHouseOperations,
	sanityHouse?: SanityHouse | null
): House {
	// Start with the base house (which already has all SupabaseHouseOperations properties)
	const enhancedHouse: House = {
		...houseOperations,

		// Add Sanity data if available
		sanityHouse: sanityHouse || undefined
	};

	return enhancedHouse;
}

/**
 * Calculate house-specific metrics
 */
export function calculateHouseMetrics(house: House): {
	occupancyRate: number;
	isAtCapacity: boolean;
	hasWifi: boolean;
	hasFullContent: boolean;
} {
	// Get total capacity from Sanity if available, otherwise use a default
	const totalCapacity = house.sanityHouse?.capacity || 0;

	// Calculate occupancy rate (percentage of occupancy)
	const occupancyRate = totalCapacity > 0
		? (house.current_occupancy / totalCapacity) * 100
		: 0;

	// Check if house is at capacity
	const isAtCapacity = totalCapacity > 0 && house.current_occupancy >= totalCapacity;

	// Check if house has WiFi information
	const hasWifi = !!(house.wifi_network && house.wifi_password);

	// Check if house has full content from Sanity
	const hasFullContent = !!house.sanityHouse;

	return {
		occupancyRate,
		isAtCapacity,
		hasWifi,
		hasFullContent
	};
}

/**
 * House with enhanced location data
 */
export interface HouseWithLocation extends House {
	formattedAddress: string;
	mapUrl: string;
}

/**
 * Add formatted location data to a house
 */
export function addHouseLocationData(house: House): HouseWithLocation {
	// Only calculate if we have Sanity location data
	const location = house.sanityHouse?.location;

	// Format address from location components
	const addressParts: string[] = [];
	if (location?.address) addressParts.push(location.address);
	if (location?.city) addressParts.push(location.city);
	if (location?.state) addressParts.push(location.state);
	if (location?.zipCode) addressParts.push(location.zipCode);

	const formattedAddress = addressParts.join(', ');

	// Create Google Maps URL for the location
	let mapUrl = '';
	if (location?.coordinates?.lat && location?.coordinates?.lng) {
		mapUrl = `https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`;
	} else if (formattedAddress) {
		mapUrl = `https://maps.google.com/?q=${encodeURIComponent(formattedAddress)}`;
	}

	return {
		...house,
		formattedAddress,
		mapUrl
	};
}

/**
 * Creates a Supabase house operations record from input data
 */
export function createHouseOperationsFromInput(
	data: {
		sanity_house_id: string;
		status?: 'open' | 'planned' | 'closed';
		current_occupancy?: number;
		wifi_network?: string;
		wifi_password?: string;
		access_code?: string;
		emergency_contacts?: Record<string, any>;
		maintenance_contacts?: Record<string, any>;
		cleaning_schedule?: Record<string, any>;
		operational_notes?: string;
		last_inspection_date?: string;
		// Allow other properties but don't use them
		[key: string]: any;
	}
): Partial<SupabaseHouseOperations> {
	// Extract only the fields that exist in the house_operations table
	return {
		sanity_house_id: data.sanity_house_id,
		status: data.status || 'planned',
		current_occupancy: data.current_occupancy || 0,
		wifi_network: data.wifi_network,
		wifi_password: data.wifi_password,
		access_code: data.access_code,
		emergency_contacts: data.emergency_contacts,
		maintenance_contacts: data.maintenance_contacts,
		cleaning_schedule: data.cleaning_schedule,
		operational_notes: data.operational_notes,
		last_inspection_date: data.last_inspection_date
	};
} 