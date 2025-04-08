import { Event as SanityEvent } from '../sanity/sanity.types';
import { Event, SupabaseEventParticipation, SupabaseHouseEvent } from '../types';

/**
 * Calculate days difference between a date and now
 */
export function calculateDaysDifference(dateStr: string): number {
	const date = new Date(dateStr);
	const now = new Date();
	return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Enhances a Supabase event with Sanity data
 */
export function enhanceEventWithSanityData(
	supabaseEvent: SupabaseHouseEvent,
	sanityEvent?: SanityEvent | null
): Event {
	// Start with the base event (which already has all SupabaseHouseEvent properties)
	const enhancedEvent: Event = {
		...supabaseEvent,

		// Add Sanity data if available
		sanityEvent: sanityEvent || undefined
	};

	return enhancedEvent;
}

/**
 * Calculate event-specific metrics
 */
export function calculateEventMetrics(event: Event): {
	registrationPercentage?: number;
	daysUntil?: number;
	isAvailable: boolean;
	isAtCapacity: boolean;
	isUpcoming: boolean;
	isOngoing: boolean;
	isPast: boolean;
} {
	const now = new Date();
	const startDate = new Date(event.start_time);
	const endDate = new Date(event.end_time);

	// Determine event timing
	const isPast = endDate < now;
	const isOngoing = startDate <= now && endDate >= now;
	const isUpcoming = startDate > now;

	const maxParticipants = event.max_participants || 0;
	const currentParticipants = event.current_participants;

	// Calculate percentage of spots filled
	const registrationPercentage = maxParticipants > 0
		? Math.round((currentParticipants / maxParticipants) * 100)
		: undefined;

	// Calculate days until event
	const daysUntil = isUpcoming
		? calculateDaysDifference(event.start_time)
		: undefined;

	// Check if event is available for registration
	const isAvailable = isUpcoming &&
		event.status === 'scheduled' &&
		(!maxParticipants || currentParticipants < maxParticipants);

	// Check if event is at capacity
	const isAtCapacity = !!maxParticipants &&
		currentParticipants >= maxParticipants;

	return {
		registrationPercentage,
		daysUntil,
		isAvailable,
		isAtCapacity,
		isUpcoming,
		isOngoing,
		isPast
	};
}

/**
 * Event with user participation data
 */
export interface EventWithParticipation extends Event {
	participationData: SupabaseEventParticipation;
}

/**
 * Add user-specific participation data to an event
 */
export function addEventParticipationData(
	event: Event,
	participationData: SupabaseEventParticipation
): EventWithParticipation {
	// Return event with the participation data
	return {
		...event,
		participationData
	};
}

/**
 * Creates a Supabase event record from input data
 */
export function createSupabaseEventFromInput(
	data: {
		title: string;
		description?: string;
		start_time: string;
		end_time: string;
		location?: string;
		sanity_house_id: string;
		is_mandatory?: boolean;
		created_by?: string;
		max_participants?: number;
	}
): Partial<SupabaseHouseEvent> {
	return {
		...data,
		current_participants: 0,
		status: 'scheduled'
	};
} 