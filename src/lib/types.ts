import { Event as SanityEvent, House as SanityHouse, RoomType as SanityRoomType } from "./sanity.types";
import { SanityImage } from "./sanity/client";

// Base Supabase user data from auth.users (via metadata)
export interface SupabaseAuthUser {
	id: string;
	email?: string;
	role: 'resident' | 'admin' | 'super_admin';
	sanity_person_id?: string;
	onboarding_completed: boolean;
}

// Extended user data from accelr8_users table
export interface SupabaseExtendedUser {
	id: string; // References auth.users(id)
	emergency_contact_name?: string;
	emergency_contact_phone?: string;
	phone_number?: string;
	last_active?: string;
	created_at: string;
	updated_at: string;
}

export interface UserProfile {
	// Base auth data (from SupabaseAuthUser)
	id: string;
	email?: string;
	role: 'resident' | 'admin' | 'super_admin';
	onboarding_completed: boolean;

	// Extended data (from SupabaseExtendedUser)
	extendedData?: {
		emergency_contact_name?: string;
		emergency_contact_phone?: string;
		phone_number?: string;
		last_active?: string;
	};

	// Public profile data (from SanityPerson)
	sanityProfile?: {
		id: string; // Renamed from _id
		name: string;
		slug?: string; // Simplified from slug.current
		profileImage?: SanityImage;
		bio?: string;
		fullBio?: string;
		isTeamMember?: boolean;
		isResident?: boolean;
		houseId?: string; // Simplified from house._ref
		socialLinks?: {
			twitter?: string;
			linkedin?: string;
			github?: string;
			website?: string;
		};
		skills?: string[];
		company?: string;
	};

	// Computed properties
	isAdmin: boolean; // derived from role
	isSuperAdmin: boolean; // derived from role 
	isResident: boolean; // derived from role
}

// House operations from Supabase
export interface SupabaseHouseOperations {
	id: string;
	sanity_house_id: string;
	status: 'open' | 'planned' | 'closed';
	current_occupancy: number;
	wifi_network?: string;
	wifi_password?: string;
	access_code?: string;
	emergency_contacts?: Record<string, any>;
	maintenance_contacts?: Record<string, any>;
	cleaning_schedule?: Record<string, any>;
	operational_notes?: string;
	last_inspection_date?: string;
	created_at: string;
	updated_at: string;
}


export interface House extends Omit<SanityHouse, '_id' | 'slug'> {
	// Normalized properties from Sanity
	id: string; // renamed from _id
	slug: string; // simplified from slug.current

	// Add operational data from Supabase
	operations?: Omit<SupabaseHouseOperations, 'sanity_house_id' | 'created_at' | 'updated_at'> & {
		// Normalized properties from Supabase
		status: 'operational' | 'maintenance' | 'planned_closure' | 'renovation';
		currentOccupancy: number;
		wifiNetwork?: string; // camelCase version of wifi_network 
		wifiPassword?: string;
		accessCode?: string;
		lastInspectionDate?: string;
	};

	// Computed properties
	isActive: boolean; // derived from active flag and operations status
	occupancyRate?: number; // calculated as currentOccupancy / capacity
}

export interface SupabaseRoom {
	id: string;
	sanity_house_id: string;
	sanity_room_type_id: string;
	room_number: string;
	floor?: number;
	status: 'available' | 'occupied' | 'maintenance' | 'reserved';
	current_resident_id?: string;
	current_price?: number;
	lease_start_date?: string;
	lease_end_date?: string;
	last_maintenance_date?: string;
	maintenance_notes?: string;
	last_cleaned_date?: string;
	inventory_items?: Record<string, any>;
	special_notes?: string;
	created_at: string;
	updated_at: string;
}


// Combined Room type extending the operational data with content
export interface Room extends Omit<SupabaseRoom,
	'sanity_house_id' | 'sanity_room_type_id' | 'room_number' |
	'current_resident_id' | 'current_price' | 'lease_start_date' |
	'lease_end_date' | 'last_maintenance_date' | 'last_cleaned_date' |
	'inventory_items' | 'special_notes' | 'created_at' | 'updated_at'> {

	// Normalized properties from Supabase
	roomNumber: string; // renamed from room_number
	currentResidentId?: string;
	currentPrice?: number;
	leaseStartDate?: string;
	leaseEndDate?: string;
	lastMaintenanceDate?: string;
	lastCleanedDate?: string;
	inventoryItems?: Record<string, any>;
	specialNotes?: string;

	// Room type data from Sanity
	type: Omit<SanityRoomType, '_id' | 'house'> & {
		id: string; // renamed from _id
	};

	// House reference data from Sanity
	house: {
		id: string; // renamed from _id
		name: string;
		location?: {
			city?: string;
			state?: string;
		};
	};

	// Computed properties
	isAvailable: boolean; // derived from status
	pricePerMonth: number; // currentPrice or type.basePrice
	daysUntilAvailable?: number; // calculated from leaseEndDate if occupied
}

// House event from Supabase
export interface SupabaseHouseEvent {
	id: string;
	sanity_event_id?: string;
	sanity_house_id: string;
	title: string;
	description?: string;
	start_time: string;
	end_time: string;
	location?: string;
	is_mandatory: boolean;
	created_by?: string;
	max_participants?: number;
	current_participants: number;
	notes?: string;
	status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
}

// Event participation record
export interface SupabaseEventParticipation {
	id: string;
	event_id: string;
	user_id: string;
	rsvp_status: 'attending' | 'maybe' | 'declined' | 'no_response';
	rsvp_time: string;
	attended?: boolean;
	feedback?: string;
	created_at: string;
	updated_at: string;
}
export interface Event {
	// Common properties
	id: string; // Sanity _id or Supabase id
	title: string;
	description?: string;
	startDateTime: string; // ISO datetime string from either source
	endDateTime: string; // ISO datetime string from either source
	location?: string;
	houseId?: string; // Sanity house _ref or Supabase sanity_house_id
	houseName?: string; // Derived from house reference

	// Properties available when sourced from Sanity
	sanityData?: Omit<SanityEvent, '_id' | 'house' | 'startDateTime' | 'endDateTime' | 'title' | 'shortDescription'> & {
		slug?: string; // simplified from slug.current
		isGlobal: boolean;
		isPublic: boolean;
	};

	// Properties available when sourced from Supabase
	operationalData?: Omit<SupabaseHouseEvent,
		'id' | 'sanity_event_id' | 'sanity_house_id' | 'title' |
		'description' | 'start_time' | 'end_time' | 'location' |
		'created_at' | 'updated_at'> & {
			isMandatory: boolean; // renamed from is_mandatory
			createdBy?: {
				id: string;
				name?: string;
			};
			currentParticipants: number;

			// User-specific participation data (if available)
			userParticipation?: Omit<SupabaseEventParticipation,
				'id' | 'event_id' | 'user_id' | 'created_at' | 'updated_at' | 'rsvp_time'> & {
					rsvpTime: string;
				};
		};

	// Source indicator
	source: 'sanity' | 'supabase' | 'both';

	// Computed properties
	isPast: boolean; // Based on current time vs endDateTime
	isOngoing: boolean; // Based on current time between start/end
	isUpcoming: boolean; // Based on current time vs startDateTime
	daysUntil?: number; // Days until event starts
}

export interface SupabaseApplication {
	id: string;
	email: string;
	name: string;
	phone?: string;
	status: 'draft' | 'submitted' | 'reviewing' | 'interview_scheduled' |
	'interview_completed' | 'approved' | 'rejected' | 'waitlisted' |
	'accepted' | 'cancelled';
	preferred_move_in?: string;
	preferred_duration?: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months';
	preferred_houses?: string[]; // Array of Sanity house IDs
	bio?: string;
	responses?: Record<string, any>; // Flexible form responses
	current_role?: string;
	company?: string;
	linkedin_url?: string;
	github_url?: string;
	portfolio_url?: string;
	resume_url?: string;
	submitted_at?: string;
	referral_source?: string;
	admin_notes?: string;
	rejection_reason?: string;
	reviewed_by?: string; // UUID of reviewer
	reviewed_at?: string;
	assigned_house_id?: string;
	assigned_room_id?: string;
	sanity_person_id?: string;
	user_id?: string;
	created_at: string;
	updated_at: string;
}

// Interview record from Supabase
export interface SupabaseApplicationInterview {
	id: string;
	application_id: string;
	interviewer_id: string;
	scheduled_time: string;
	completed_time?: string;
	duration_minutes?: number;
	status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
	interview_notes?: string;
	overall_impression?: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
	created_at: string;
	updated_at: string;
}


// Application type with normalized property names
export interface Application extends Omit<SupabaseApplication,
	'preferred_move_in' | 'preferred_duration' | 'preferred_houses' |
	'linkedin_url' | 'github_url' | 'portfolio_url' | 'resume_url' |
	'submitted_at' | 'referral_source' | 'admin_notes' | 'rejection_reason' |
	'reviewed_by' | 'reviewed_at' | 'assigned_house_id' | 'assigned_room_id' |
	'sanity_person_id' | 'user_id' | 'created_at' | 'updated_at'> {

	// Normalized properties
	preferredMoveIn?: string;
	preferredDuration?: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months';
	preferredHouses?: Array<{
		id: string;
		name?: string; // Enriched with house name when available
	}>;
	linkedinUrl?: string;
	githubUrl?: string;
	portfolioUrl?: string;
	resumeUrl?: string;
	submittedAt?: string;
	referralSource?: string;
	adminNotes?: string;
	rejectionReason?: string;

	// Enriched reviewer data
	reviewedBy?: {
		id: string;
		name?: string;
	};
	reviewedAt?: string;

	// Enriched assignment data
	assignedHouse?: {
		id: string;
		name?: string;
	};
	assignedRoom?: {
		id: string;
		roomNumber?: string;
	};
	createdPersonId?: string;
	createdUserId?: string;

	// Interviews data
	interviews?: Array<Omit<SupabaseApplicationInterview,
		'application_id' | 'interviewer_id' | 'scheduled_time' | 'completed_time' |
		'interview_notes' | 'created_at' | 'updated_at'> & {
			interviewerId: string;
			interviewerName?: string;
			scheduledTime: string;
			completedTime?: string;
			notes?: string;
		}>;

	// Metadata
	createdAt: string;
	updatedAt: string;

	// Computed properties
	daysSinceSubmission?: number;
	stage: 'draft' | 'submitted' | 'screening' | 'interviewing' | 'decision' | 'accepted' | 'rejected';
}

