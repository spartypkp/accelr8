import { Event as SanityEvent, House as SanityHouse, Person as SanityPerson, RoomType as SanityRoomType } from "./sanity/sanity.types";

export type UserRole = 'applicant' | 'resident' | 'admin' | 'super_admin';


// Base Supabase user data from auth.users (via metadata)
export interface SupabaseAuthUser {
	id: string;
	email?: string;
	role: UserRole;
	sanity_person_id?: string;
	onboarding_completed: boolean;
}

// Extended user data from accelr8_users table
export interface SupabaseExtendedUser extends SupabaseAuthUser {
	emergency_contact_name?: string;
	emergency_contact_phone?: string;
	phone_number?: string;
	last_active?: string;
	created_at: string;
	updated_at: string;
}

export interface UserProfile extends SupabaseExtendedUser {
	// Public profile data (from SanityPerson)
	sanityPerson?: SanityPerson;
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


export interface House extends SupabaseHouseOperations {
	sanityHouse?: SanityHouse;


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
export interface Room extends SupabaseRoom {

	sanityRoomType?: SanityRoomType;
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
export interface Event extends SupabaseHouseEvent {

	// Properties available when sourced from Sanity
	sanityEvent?: SanityEvent;

}

/**
 * Application status enum representing all possible states of an application
 */
export enum ApplicationStatus {
	Draft = 'draft',
	Submitted = 'submitted',
	Reviewing = 'reviewing',
	InterviewScheduled = 'interview_scheduled',
	InterviewCompleted = 'interview_completed',
	Approved = 'approved',
	Rejected = 'rejected',
	Waitlisted = 'waitlisted',
	Accepted = 'accepted',
	Cancelled = 'cancelled'
}

export interface SupabaseApplication {
	id: string;
	email: string;
	name: string;
	phone?: string;
	status: ApplicationStatus;
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



