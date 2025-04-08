import {
	addEventParticipationData,
	createSupabaseEventFromInput,
	enhanceEventWithSanityData,
	EventWithParticipation
} from '../enhancers/events';
import { createSanityClient } from '../sanity/client';
import { createClient } from '../supabase/server';
import { Event, SupabaseEventParticipation, SupabaseHouseEvent } from '../types';
import { ApiError } from './shared/error';

/**
 * Input type for creating/updating an event
 */
export type EventInput = Partial<SupabaseHouseEvent>;

/**
 * Type for RSVP status update
 */
export type RsvpInput = {
	userId: string;
	eventId: string;
	status: 'attending' | 'maybe' | 'declined' | 'no_response';
};

/**
 * Query options for filtering events
 */
export interface EventQueryOptions {
	houseId?: string;
	isGlobal?: boolean;
	isPublic?: boolean;
	startDate?: string;
	endDate?: string;
	status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'all';
	search?: string;
	limit?: number;
	offset?: number;
	userId?: string; // To fetch participation data
}

/**
 * Get a single event by ID with complete data
 */
export async function getEvent(id: string, userId?: string): Promise<Event | EventWithParticipation | null> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// First, try to find the event in Supabase
		const { data: eventData, error } = await supabase
			.from('events')
			.select('*')
			.eq('id', id)
			.single();

		// If found in Supabase
		if (eventData && !error) {
			let sanityEvent = null;

			// Check if it has a Sanity reference
			if (eventData.sanity_event_id) {
				// Fetch the Sanity event data
				sanityEvent = await sanityClient.fetch(
					`*[_type == "event" && _id == $id][0]`,
					{ id: eventData.sanity_event_id }
				);
			}

			// Fetch house info if applicable
			const houseInfo = eventData.sanity_house_id
				? await sanityClient.fetch(
					`*[_type == "house" && _id == $id][0]{
                _id, name
              }`,
					{ id: eventData.sanity_house_id }
				)
				: null;

			// Enhance the event with Sanity data
			let enhancedEvent = enhanceEventWithSanityData(
				eventData,
				sanityEvent
			);

			// Fetch user's participation data if userId provided
			if (userId) {
				const { data: participation } = await supabase
					.from('event_participation')
					.select('*')
					.eq('event_id', id)
					.eq('user_id', userId)
					.single();

				if (participation) {
					// Add participation data to the event
					return addEventParticipationData(enhancedEvent, participation);
				}
			}

			return enhancedEvent;
		}

		// If not found in Supabase, try Sanity
		const sanityEvent = await sanityClient.fetch(
			`*[_type == "event" && _id == $id][0]`,
			{ id }
		);

		if (!sanityEvent) {
			return null; // Not found in either database
		}

		// Fetch house info if applicable
		let houseInfo = null;
		if (sanityEvent.house?._ref) {
			houseInfo = await sanityClient.fetch(
				`*[_type == "house" && _id == $id][0]{
          _id, name
        }`,
				{ id: sanityEvent.house._ref }
			);
		}

		// For Sanity-only events, we need to create a minimal Supabase event structure
		const minimalEvent: SupabaseHouseEvent = {
			id: sanityEvent._id,
			sanity_event_id: sanityEvent._id,
			sanity_house_id: sanityEvent.house?._ref || '',
			title: sanityEvent.title || '',
			description: sanityEvent.shortDescription || '',
			start_time: sanityEvent.startDateTime || new Date().toISOString(),
			end_time: sanityEvent.endDateTime || new Date().toISOString(),
			location: sanityEvent.location || '',
			is_mandatory: false,
			current_participants: 0,
			status: 'scheduled',
			created_at: '',
			updated_at: ''
		};

		// Enhance with Sanity data and return
		return enhanceEventWithSanityData(
			minimalEvent,
			sanityEvent
		);
	} catch (error) {
		console.error('Error fetching event:', error);
		throw new ApiError('Failed to fetch event details', 500, error);
	}
}

/**
 * Get all events with optional filtering
 */
export async function getEvents(options: EventQueryOptions = {}): Promise<Event[]> {
	try {
		const sanityClient = createSanityClient();
		const supabase = await createClient();

		// 1. Build Supabase query with filters
		let query = supabase.from('events').select('*');

		// Apply Supabase filters
		if (options.houseId) {
			query = query.eq('sanity_house_id', options.houseId);
		}

		if (options.status && options.status !== 'all') {
			query = query.eq('status', options.status);
		}

		// Filter by date range
		if (options.startDate) {
			query = query.gte('start_time', options.startDate);
		}

		if (options.endDate) {
			query = query.lte('start_time', options.endDate);
		}

		// Apply pagination
		if (options.limit !== undefined) {
			query = query.limit(options.limit);
		}

		if (options.offset !== undefined) {
			query = query.range(
				options.offset,
				options.offset + (options.limit || 10) - 1
			);
		}

		// 2. Fetch events from Supabase
		const { data: supabaseEvents, error } = await query;
		if (error) throw error;

		// 3. Build Sanity query with filters
		let sanityQuery = `*[_type == "event"`;
		const params: Record<string, any> = {};

		// Apply Sanity filters
		if (options.houseId) {
			sanityQuery += ` && house._ref == $houseId`;
			params.houseId = options.houseId;
		}

		if (options.isGlobal !== undefined) {
			sanityQuery += ` && isGlobal == $isGlobal`;
			params.isGlobal = options.isGlobal;
		}

		if (options.isPublic !== undefined) {
			sanityQuery += ` && isPublic == $isPublic`;
			params.isPublic = options.isPublic;
		}

		if (options.startDate) {
			sanityQuery += ` && startDateTime >= $startDate`;
			params.startDate = options.startDate;
		}

		if (options.endDate) {
			sanityQuery += ` && startDateTime <= $endDate`;
			params.endDate = options.endDate;
		}

		if (options.search) {
			sanityQuery += ` && (title match $search || shortDescription match $search)`;
			params.search = options.search;
		}

		// Close query and add sort
		sanityQuery += `] | order(startDateTime asc)`;

		// Apply limit/offset for Sanity
		if (options.limit !== undefined) {
			const start = options.offset || 0;
			const end = start + options.limit;
			sanityQuery += `[${start}...${end}]`;
		}

		// 4. Fetch events from Sanity
		const sanityEvents = await sanityClient.fetch(sanityQuery, params);

		// 5. Get house information for all events
		const houseIds = [
			...(supabaseEvents || []).map(event => event.sanity_house_id).filter(Boolean),
			...(sanityEvents || []).map(event => event.house?._ref).filter(Boolean)
		];

		// Get unique house IDs
		const uniqueHouseIds = Array.from(new Set(houseIds));

		const houses = uniqueHouseIds.length > 0
			? await sanityClient.fetch(
				`*[_type == "house" && _id in $ids]{
            _id, name
          }`,
				{ ids: uniqueHouseIds }
			)
			: [];

		// Create a map of house ID to house info for easy lookup
		const houseMap = houses.reduce((map, house) => {
			map[house._id] = house;
			return map;
		}, {} as Record<string, any>);

		// 6. Get participation data if user ID provided
		let participationMap: Record<string, SupabaseEventParticipation> = {};
		if (options.userId) {
			const { data: participation } = await supabase
				.from('event_participation')
				.select('*')
				.eq('user_id', options.userId);

			if (participation) {
				participationMap = participation.reduce((map, item) => {
					map[item.event_id] = item;
					return map;
				}, {} as Record<string, SupabaseEventParticipation>);
			}
		}

		// 7. Process Supabase events
		const enhancedSupabaseEvents = (supabaseEvents || []).map(event => {
			// Find matching Sanity event if it exists
			const matchingSanityEvent = sanityEvents?.find(s => s._id === event.sanity_event_id);

			// Get participation data if available
			const participation = participationMap[event.id];

			// Enhance the event with Sanity data
			const enhancedEvent = enhanceEventWithSanityData(
				event,
				matchingSanityEvent || null
			);

			// Add participation data if available
			return participation
				? addEventParticipationData(enhancedEvent, participation)
				: enhancedEvent;
		});

		// 8. Process Sanity-only events (that don't exist in Supabase)
		const supabaseEventIds = new Set((supabaseEvents || []).map(e => e.sanity_event_id).filter(Boolean));
		const sanityOnlyEvents = (sanityEvents || [])
			.filter(event => !supabaseEventIds.has(event._id))
			.map(sanityEvent => {
				// Create a minimal Supabase structure for the Sanity event
				const houseId = sanityEvent.house?._ref;

				const minimalEvent: SupabaseHouseEvent = {
					id: sanityEvent._id,
					sanity_event_id: sanityEvent._id,
					sanity_house_id: houseId || '',
					title: sanityEvent.title || '',
					description: sanityEvent.shortDescription || '',
					start_time: sanityEvent.startDateTime || new Date().toISOString(),
					end_time: sanityEvent.endDateTime || new Date().toISOString(),
					location: sanityEvent.location || '',
					is_mandatory: false,
					current_participants: 0,
					status: 'scheduled',
					created_at: '',
					updated_at: ''
				};

				// Enhance with Sanity data
				return enhanceEventWithSanityData(minimalEvent, sanityEvent);
			});

		// 9. Combine and sort all events
		const allEvents = [...enhancedSupabaseEvents, ...sanityOnlyEvents]
			.sort((a, b) => {
				const dateA = new Date(a.start_time);
				const dateB = new Date(b.start_time);
				return dateA.getTime() - dateB.getTime();
			});

		return allEvents;
	} catch (error) {
		console.error('Error fetching events:', error);
		throw new ApiError('Failed to fetch events', 500, error);
	}
}

/**
 * Get upcoming events (shorthand for getEvents with startDate=now)
 */
export async function getUpcomingEvents(options: Omit<EventQueryOptions, 'startDate'> = {}): Promise<Event[]> {
	const now = new Date().toISOString();
	return getEvents({
		...options,
		startDate: now,
	});
}

/**
 * Get events for a specific house (shorthand for getEvents with houseId)
 */
export async function getHouseEvents(houseId: string, options: Omit<EventQueryOptions, 'houseId'> = {}): Promise<Event[]> {
	return getEvents({
		...options,
		houseId,
	});
}

/**
 * Create a new event
 */
export async function createEvent(data: EventInput): Promise<Event> {
	try {
		const supabase = await createClient();
		const sanityClient = createSanityClient();

		// Convert to Supabase format
		const eventData = createSupabaseEventFromInput(data as any);

		// Insert into Supabase
		const { data: createdEvent, error } = await supabase
			.from('events')
			.insert(eventData)
			.select()
			.single();

		if (error) throw error;
		if (!createdEvent) throw new ApiError('Failed to create event', 500);

		// Return enhanced event
		return enhanceEventWithSanityData(
			createdEvent,
			null
		);
	} catch (error) {
		console.error('Error creating event:', error);
		throw new ApiError('Failed to create event', 500, error);
	}
}

/**
 * Update an existing event
 */
export async function updateEvent(id: string, data: EventInput): Promise<Event> {
	try {
		const supabase = await createClient();
		const sanityClient = createSanityClient();

		// First, fetch the existing event
		const { data: existingEvent, error: fetchError } = await supabase
			.from('events')
			.select('*')
			.eq('id', id)
			.single();

		if (fetchError || !existingEvent) {
			throw new ApiError('Event not found', 404);
		}

		// Update in Supabase
		const { data: updatedEvent, error } = await supabase
			.from('events')
			.update(data)
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		if (!updatedEvent) throw new ApiError('Failed to update event', 500);

		// Fetch Sanity event if available
		let sanityEvent = null;
		if (updatedEvent.sanity_event_id) {
			sanityEvent = await sanityClient.fetch(
				`*[_type == "event" && _id == $id][0]`,
				{ id: updatedEvent.sanity_event_id }
			);
		}

		// Return enhanced event
		return enhanceEventWithSanityData(
			updatedEvent,
			sanityEvent
		);
	} catch (error) {
		console.error('Error updating event:', error);
		throw new ApiError('Failed to update event', 500, error);
	}
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string): Promise<boolean> {
	try {
		const supabase = await createClient();
		const sanityClient = createSanityClient();

		// First, fetch the event to check if it exists and has a Sanity reference
		const { data: existingEvent, error: fetchError } = await supabase
			.from('events')
			.select('*')
			.eq('id', id)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			// If error other than "not found"
			throw fetchError;
		}

		// If the event has a Sanity reference, check if we need to delete it
		if (existingEvent?.sanity_event_id) {
			// Here we could add logic to delete from Sanity if needed
			// For now, we'll just log that there's a Sanity reference
			console.log(`Event ${id} has Sanity reference ${existingEvent.sanity_event_id}`);
		}

		// Delete any participation records first (maintain referential integrity)
		await supabase.from('event_participation').delete().eq('event_id', id);

		// Delete from Supabase
		const { error } = await supabase.from('events').delete().eq('id', id);

		if (error) throw error;

		return true;
	} catch (error) {
		console.error('Error deleting event:', error);
		throw new ApiError('Failed to delete event', 500, error);
	}
}

/**
 * Update RSVP status for an event
 */
export async function updateRsvp(data: RsvpInput): Promise<Event> {
	try {
		const supabase = await createClient();
		const sanityClient = createSanityClient();

		const { userId, eventId, status } = data;

		// First, check if the event exists
		const { data: event, error: eventError } = await supabase
			.from('events')
			.select('*')
			.eq('id', eventId)
			.single();

		if (eventError || !event) {
			throw new ApiError('Event not found', 404);
		}

		// Check if there's an existing participation record
		const { data: existingParticipation, error: participationError } = await supabase
			.from('event_participation')
			.select('*')
			.eq('event_id', eventId)
			.eq('user_id', userId)
			.single();

		let participationData: SupabaseEventParticipation;

		if (existingParticipation) {
			// Update existing record
			const { data: updatedParticipation, error } = await supabase
				.from('event_participation')
				.update({
					rsvp_status: status,
					rsvp_time: new Date().toISOString(),
				})
				.eq('id', existingParticipation.id)
				.select()
				.single();

			if (error) throw error;
			participationData = updatedParticipation;
		} else {
			// Create new participation record
			const { data: newParticipation, error } = await supabase
				.from('event_participation')
				.insert({
					event_id: eventId,
					user_id: userId,
					rsvp_status: status,
					rsvp_time: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) throw error;
			participationData = newParticipation;

			// Update event participant count if attending
			if (status === 'attending') {
				await supabase
					.from('events')
					.update({
						current_participants: event.current_participants + 1,
					})
					.eq('id', eventId);
			}
		}

		// Fetch updated event
		const { data: updatedEvent } = await supabase
			.from('events')
			.select('*')
			.eq('id', eventId)
			.single();

		// Fetch Sanity data if available
		let sanityEvent = null;
		if (updatedEvent.sanity_event_id) {
			sanityEvent = await sanityClient.fetch(
				`*[_type == "event" && _id == $id][0]`,
				{ id: updatedEvent.sanity_event_id }
			);
		}

		// Return enhanced event with participation data
		const enhancedEvent = enhanceEventWithSanityData(
			updatedEvent,
			sanityEvent
		);

		return addEventParticipationData(enhancedEvent, participationData);
	} catch (error) {
		console.error('Error updating RSVP:', error);
		throw new ApiError('Failed to update RSVP', 500, error);
	}
} 