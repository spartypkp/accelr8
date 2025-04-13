'use client';

import { useUser } from '@/hooks/UserContext';
import { getHouse } from '@/lib/api/houses';
import { createSanityClient } from '@/lib/sanity/client';
import { createClient } from '@/lib/supabase/client';
import { House } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

// Define the context type
export type HouseContextType = {
	// House data
	house: House | null;
	isLoading: boolean;
	error: string | null;

	// Permissions
	canEdit: boolean;
	canView: boolean;

	// Functions
	fetchHouse: (houseId?: string) => Promise<House | null>;

	// Admin-only functions
	updateBasicInfo?: (data: {
		name?: string;
		shortDescription?: string;
		status?: 'open' | 'planned' | 'closed';
		active?: boolean;
		capacity?: number;
	}) => Promise<{ error: Error | null; }>;

	updateLocation?: (data: {
		address?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
		coordinates?: { lat: number; lng: number; };
	}) => Promise<{ error: Error | null; }>;

	updateAccessInfo?: (data: {
		wifi_network?: string;
		wifi_password?: string;
		access_code?: string;
		emergency_contacts?: any;
		maintenance_contacts?: any;
		operational_notes?: string;
	}) => Promise<{ error: Error | null; }>;

	updateAmenities?: (data: {
		amenities: Array<{
			name: string;
			category: "technology" | "workspace" | "comfort" | "kitchen" | "entertainment" | "services" | "other";
			icon?: string;
		}>;
	}) => Promise<{ error: Error | null; }>;

	updateMedia?: (data: {
		mainImageUrl?: string;
		mainImageAlt?: string;
		galleryUrls?: Array<{
			url: string;
			alt?: string;
			caption?: string;
		}>;
		mainImageUpdated?: boolean;
		galleryImagesUpdated?: boolean;
	}) => Promise<{ error: Error | null; }>;

	updateHouseRules?: (data: {
		houseRules: string;
	}) => Promise<{ error: Error | null; }>;
};

// Create the context with default values
const HouseContext = createContext<HouseContextType>({
	house: null,
	isLoading: true,
	error: null,
	canEdit: false,
	canView: false,
	fetchHouse: async () => null,
});

// Provider component
export function HouseProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const params = useParams();
	const router = useRouter();
	const { user, isAdmin, isSuperAdmin, isResident } = useUser();

	const houseId = params?.houseId as string;

	const [house, setHouse] = useState<House | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Define permissions based on user role
	const canEdit = Boolean(user && (isAdmin || isSuperAdmin));
	const canView = Boolean(user && (isAdmin || isSuperAdmin || isResident));

	const supabase = createClient();
	const sanityClient = createSanityClient();

	// Function to fetch house data from both Supabase and Sanity
	const fetchHouse = async (id?: string): Promise<House | null> => {
		const targetHouseId = id || houseId;
		if (!targetHouseId) return null;

		setIsLoading(true);
		setError(null);

		try {
			// Use the getHouse function directly from our API layer
			const houseData = await getHouse(targetHouseId);

			if (!houseData) {
				throw new Error('House not found');
			}

			// Update state
			setHouse(houseData);
			setIsLoading(false);

			return houseData;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch house data';
			console.error('Error in fetchHouse:', errorMessage);
			setError(errorMessage);
			setIsLoading(false);
			return null;
		}
	};

	// Initialize house data when the component mounts or houseId changes
	useEffect(() => {
		if (houseId && canView) {
			// houseId from the URL is now treated as a Supabase UUID
			fetchHouse(houseId);
		}
	}, [houseId, canView]);

	// Admin-only function to update basic house information
	const updateBasicInfo = canEdit ? async (data: {
		name?: string;
		shortDescription?: string;
		status?: 'open' | 'planned' | 'closed';
		active?: boolean;
		capacity?: number;
	}) => {
		if (!house) return { error: new Error('No house loaded') };
		setIsLoading(true);

		try {
			// 1. Update operational data in Supabase if needed
			if (data.status) {
				const { error: supabaseError } = await supabase
					.from('house_operations')
					.update({ status: data.status })
					.eq('id', house.id);

				if (supabaseError) throw new Error(supabaseError.message);
			}

			// 2. Update content data in Sanity if needed
			if (data.name || data.shortDescription || data.active || data.capacity) {
				const sanityUpdates: any = {};
				if (data.name) sanityUpdates.name = data.name;
				if (data.shortDescription) sanityUpdates.shortDescription = data.shortDescription;
				if (data.active !== undefined) sanityUpdates.active = data.active;
				if (data.capacity) sanityUpdates.capacity = data.capacity;

				// This would use Sanity's client mutation in a real implementation
				console.log('Would update Sanity with:', sanityUpdates);
				// Get the sanity_house_id from the house object
				// await sanityClient.patch(house.sanity_house_id).set(sanityUpdates).commit();
			}

			// 3. Update local state
			setHouse(prev => {
				if (!prev) return null;

				return {
					...prev,
					status: data.status || prev.status,
					sanityHouse: prev.sanityHouse ? {
						...prev.sanityHouse,
						name: data.name || prev.sanityHouse.name,
						shortDescription: data.shortDescription || prev.sanityHouse.shortDescription,
						active: data.active !== undefined ? data.active : prev.sanityHouse.active,
						capacity: data.capacity || prev.sanityHouse.capacity
					} : undefined
				};
			});

			return { error: null };
		} catch (err) {
			console.error('Error updating house basic info:', err);
			return { error: err instanceof Error ? err : new Error('Failed to update house') };
		} finally {
			setIsLoading(false);
		}
	} : undefined;

	// Admin-only function to update location information
	const updateLocation = canEdit ? async (data: {
		address?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
		coordinates?: { lat: number; lng: number; };
	}) => {
		if (!house) return { error: new Error('No house loaded') };
		setIsLoading(true);

		try {
			// In a real implementation, this would update Sanity with the new location data
			console.log('Would update location in Sanity:', data);

			// Update local state
			setHouse(prev => {
				if (!prev || !prev.sanityHouse) return prev;

				return {
					...prev,
					sanityHouse: {
						...prev.sanityHouse,
						location: {
							...prev.sanityHouse.location,
							address: data.address || prev.sanityHouse.location?.address,
							city: data.city || prev.sanityHouse.location?.city,
							state: data.state || prev.sanityHouse.location?.state,
							zipCode: data.zipCode || prev.sanityHouse.location?.zipCode,
							country: data.country || prev.sanityHouse.location?.country,
							coordinates: data.coordinates ? {
								_type: "geopoint",
								...data.coordinates
							} : prev.sanityHouse.location?.coordinates
						}
					}
				};
			});

			return { error: null };
		} catch (err) {
			console.error('Error updating house location:', err);
			return { error: err instanceof Error ? err : new Error('Failed to update location') };
		} finally {
			setIsLoading(false);
		}
	} : undefined;

	// Admin-only function to update access information
	const updateAccessInfo = canEdit ? async (data: {
		wifi_network?: string;
		wifi_password?: string;
		access_code?: string;
		emergency_contacts?: any;
		maintenance_contacts?: any;
		operational_notes?: string;
	}) => {
		if (!house) return { error: new Error('No house loaded') };
		setIsLoading(true);

		try {
			// Update in Supabase using the house.id (Supabase UUID)
			const { error: supabaseError } = await supabase
				.from('house_operations')
				.update({
					wifi_network: data.wifi_network,
					wifi_password: data.wifi_password,
					access_code: data.access_code,
					emergency_contacts: data.emergency_contacts,
					maintenance_contacts: data.maintenance_contacts,
					operational_notes: data.operational_notes
				})
				.eq('id', house.id);

			if (supabaseError) throw new Error(supabaseError.message);

			// Update local state
			setHouse(prev => {
				if (!prev) return null;

				return {
					...prev,
					wifi_network: data.wifi_network || prev.wifi_network,
					wifi_password: data.wifi_password || prev.wifi_password,
					access_code: data.access_code || prev.access_code,
					emergency_contacts: data.emergency_contacts || prev.emergency_contacts,
					maintenance_contacts: data.maintenance_contacts || prev.maintenance_contacts,
					operational_notes: data.operational_notes || prev.operational_notes
				};
			});

			return { error: null };
		} catch (err) {
			console.error('Error updating house access info:', err);
			return { error: err instanceof Error ? err : new Error('Failed to update access info') };
		} finally {
			setIsLoading(false);
		}
	} : undefined;

	// Admin-only function to update amenities
	const updateAmenities = canEdit ? async (data: {
		amenities: Array<{
			name: string;
			category: "technology" | "workspace" | "comfort" | "kitchen" | "entertainment" | "services" | "other";
			icon?: string;
		}>;
	}) => {
		if (!house) return { error: new Error('No house loaded') };
		setIsLoading(true);

		try {
			// In a real implementation, this would update Sanity with the new amenities
			console.log('Would update amenities in Sanity:', data.amenities);

			// Update local state
			setHouse(prev => {
				if (!prev || !prev.sanityHouse) return prev;

				return {
					...prev,
					sanityHouse: {
						...prev.sanityHouse,
						amenities: data.amenities.map((amenity, index) => ({
							...amenity,
							_key: (index + 1).toString()
						}))
					}
				};
			});

			return { error: null };
		} catch (err) {
			console.error('Error updating house amenities:', err);
			return { error: err instanceof Error ? err : new Error('Failed to update amenities') };
		} finally {
			setIsLoading(false);
		}
	} : undefined;

	// Admin-only function to update media
	const updateMedia = canEdit ? async (data: {
		mainImageUrl?: string;
		mainImageAlt?: string;
		galleryUrls?: Array<{
			url: string;
			alt?: string;
			caption?: string;
		}>;
		mainImageUpdated?: boolean;
		galleryImagesUpdated?: boolean;
	}) => {
		if (!house) return { error: new Error('No house loaded') };
		setIsLoading(true);

		try {
			// The actual image uploads are now handled in the MediaManager component
			// directly using the houses.ts API functions.
			console.log('Media updates processed:', data);

			// Always refresh house data when media-related changes are reported
			if (data.mainImageUpdated || data.galleryImagesUpdated) {
				await fetchHouse(house.id);
			}

			return { error: null };
		} catch (err) {
			console.error('Error updating house media:', err);
			return { error: err instanceof Error ? err : new Error('Failed to update media') };
		} finally {
			setIsLoading(false);
		}
	} : undefined;

	// Admin-only function to update house rules
	const updateHouseRules = canEdit ? async (data: {
		houseRules: string;
	}) => {
		if (!house) return { error: new Error('No house loaded') };
		setIsLoading(true);

		try {
			// In a real implementation, this would convert the text to Sanity blocks
			// and update the house document
			console.log('Would update house rules in Sanity:', data);

			return { error: null };
		} catch (err) {
			console.error('Error updating house rules:', err);
			return { error: err instanceof Error ? err : new Error('Failed to update house rules') };
		} finally {
			setIsLoading(false);
		}
	} : undefined;

	return (
		<HouseContext.Provider
			value={{
				house,
				isLoading,
				error,
				canEdit,
				canView,
				fetchHouse,
				updateBasicInfo,
				updateLocation,
				updateAccessInfo,
				updateAmenities,
				updateMedia,
				updateHouseRules
			}}
		>
			{children}
		</HouseContext.Provider>
	);
}

// Hook to use the context
export function useHouse() {
	return useContext(HouseContext);
} 