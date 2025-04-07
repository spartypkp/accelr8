# Accelr8 Data Type System V2

This document defines the improved data type system for Accelr8, following a clean type extension pattern where composite types extend the base types from Sanity and Supabase.

## Core Principles
1. **Single Source of Truth**: Each data entity has one primary location
2. **Type Extension**: Composite types extend base types using TypeScript interfaces
3. **Clear Data Origin**: Each property's source system is explicit and traceable
4. **Normalized Properties**: Consistent naming conventions across systems

## User/Person Management

### Supabase Types
```typescript
// Base Supabase user data from auth.users (via metadata)
interface SupabaseAuthUser {
  id: string;
  email?: string;
  role: 'resident' | 'admin' | 'super_admin';
  sanity_person_id?: string;
  onboarding_completed: boolean;
}

// Extended user data from accelr8_users table
interface SupabaseExtendedUser {
  id: string; // References auth.users(id)
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  phone_number?: string;
  last_active?: string;
  created_at: string;
  updated_at: string;
}
```

### Sanity Types
```typescript
// Person document from Sanity
interface SanityPerson {
  _id: string;
  name: string;
  slug?: { current: string };
  email?: string;
  profileImage?: SanityImage;
  role?: string;
  bio?: string;
  fullBio?: PortableText[];
  isTeamMember?: boolean;
  isResident?: boolean;
  house?: { _ref: string };
  startDate?: string;
  endDate?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  skills?: string[];
  company?: string;
  displayOnWebsite?: boolean;
  displayOrder?: number;
}
```

### Composite Type
```typescript
// Complete user profile combining auth, extended data, and Sanity
interface UserProfile {
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
    fullBio?: PortableText[];
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
```

## House

### Supabase Types
```typescript
// House operations from Supabase
interface SupabaseHouseOperations {
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
```

### Sanity Types
```typescript
// House document from Sanity
interface SanityHouse {
  _id: string;
  name: string;
  slug: { current: string };
  active?: boolean;
  mainImage?: SanityImage;
  galleryImages?: SanityImage[];
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: { lat: number; lng: number };
  };
  shortDescription?: string;
  fullDescription?: PortableText[];
  amenities?: Array<{
    name: string;
    category: string;
    icon?: string;
  }>;
  capacity?: number;
  neighborhoodDetails?: PortableText[];
  localResources?: Array<{
    name: string;
    category: string;
    address?: string;
    distance?: string;
    website?: string;
  }>;
  houseRules?: PortableText[];
}
```

### Composite Type
```typescript
// Combined House type that extends SanityHouse with operational data
interface House extends Omit<SanityHouse, '_id' | 'slug'> {
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
```

## Room

### Supabase Types
```typescript
// Room instance from Supabase
interface SupabaseRoom {
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
```

### Sanity Types
```typescript
// Room type from Sanity
interface SanityRoomType {
  _id: string;
  name: string;
  house?: { _ref: string };
  description?: string;
  image?: SanityImage;
  images?: SanityImage[];
  basePrice?: number;
  capacity?: number;
  squareFootage?: number;
  features?: string[];
  floorPlan?: SanityImage;
}

// House reference (minimal) from Sanity
interface SanityHouseReference {
  _id: string;
  name: string;
  location?: {
    city?: string;
    state?: string;
  };
}
```

### Composite Type
```typescript
// Combined Room type extending the operational data with content
interface Room extends Omit<SupabaseRoom, 
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
```

## Event

### Supabase Types
```typescript
// House event from Supabase
interface SupabaseHouseEvent {
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
interface SupabaseEventParticipation {
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
```

### Sanity Types
```typescript
// Event document from Sanity
interface SanityEvent {
  _id: string;
  title: string;
  slug?: { current: string };
  eventType?: 'hackathon' | 'workshop' | 'social' | 'demo' | 'pitch' | 'other';
  house?: { _ref: string };
  isGlobal?: boolean;
  isPublic?: boolean;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  shortDescription?: string;
  fullDescription?: PortableText[];
  mainImage?: SanityImage;
  speakers?: Array<{
    name: string;
    role?: string;
    bio?: string;
    image?: SanityImage;
  }>;
  registrationLink?: string;
  maxParticipants?: number;
}
```

### Composite Type
```typescript
// Event from either Sanity (public) or Supabase (internal)
interface Event {
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
```

## Application

### Supabase Types
```typescript
// Application record from Supabase
interface SupabaseApplication {
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
interface SupabaseApplicationInterview {
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
```

### Composite Type (Applications are only in Supabase)
```typescript
// Application type with normalized property names
interface Application extends Omit<SupabaseApplication,
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
```

## Utility Functions

```typescript
// Type converters

// Convert from Sanity house to composite House
function convertSanityHouse(sanityHouse: SanityHouse, operations?: SupabaseHouseOperations): House {
  return {
    // Map properties from Sanity
    id: sanityHouse._id,
    name: sanityHouse.name,
    slug: sanityHouse.slug?.current || '',
    active: sanityHouse.active || false,
    mainImage: sanityHouse.mainImage,
    galleryImages: sanityHouse.galleryImages,
    location: sanityHouse.location,
    shortDescription: sanityHouse.shortDescription,
    fullDescription: sanityHouse.fullDescription,
    amenities: sanityHouse.amenities,
    capacity: sanityHouse.capacity || 0,
    neighborhoodDetails: sanityHouse.neighborhoodDetails,
    localResources: sanityHouse.localResources,
    houseRules: sanityHouse.houseRules,
    
    // Add operations data if available
    operations: operations ? {
      id: operations.id,
      status: mapStatus(operations.status),
      currentOccupancy: operations.current_occupancy,
      wifiNetwork: operations.wifi_network,
      wifiPassword: operations.wifi_password,
      accessCode: operations.access_code,
      emergencyContacts: operations.emergency_contacts,
      maintenanceContacts: operations.maintenance_contacts,
      cleaningSchedule: operations.cleaning_schedule,
      operationalNotes: operations.operational_notes,
      lastInspectionDate: operations.last_inspection_date,
    } : undefined,
    
    // Computed properties
    isActive: (sanityHouse.active !== false) && 
              (!operations || operations.status !== 'closed'),
    occupancyRate: sanityHouse.capacity && operations?.current_occupancy ? 
                  operations.current_occupancy / sanityHouse.capacity : undefined
  };
}

// Convert from raw Supabase room + Sanity room type to composite Room
function convertRoom(roomData: SupabaseRoom, roomType: SanityRoomType, house: SanityHouseReference): Room {
  return {
    id: roomData.id,
    roomNumber: roomData.room_number,
    floor: roomData.floor,
    status: roomData.status,
    currentResidentId: roomData.current_resident_id,
    currentPrice: roomData.current_price,
    leaseStartDate: roomData.lease_start_date,
    leaseEndDate: roomData.lease_end_date,
    lastMaintenanceDate: roomData.last_maintenance_date,
    maintenanceNotes: roomData.maintenance_notes,
    lastCleanedDate: roomData.last_cleaned_date,
    inventoryItems: roomData.inventory_items,
    specialNotes: roomData.special_notes,
    
    // Room type data
    type: {
      id: roomType._id,
      name: roomType.name,
      description: roomType.description,
      image: roomType.image,
      images: roomType.images,
      basePrice: roomType.basePrice,
      capacity: roomType.capacity || 1,
      squareFootage: roomType.squareFootage,
      features: roomType.features,
      floorPlan: roomType.floorPlan,
    },
    
    // House reference
    house: {
      id: house._id,
      name: house.name,
      location: house.location
    },
    
    // Computed properties
    isAvailable: roomData.status === 'available',
    pricePerMonth: roomData.current_price || roomType.basePrice || 0,
    daysUntilAvailable: roomData.lease_end_date ? 
      calculateDaysUntil(new Date(roomData.lease_end_date)) : undefined
  };
}

// Helper functions
function mapStatus(status: string): 'operational' | 'maintenance' | 'planned_closure' | 'renovation' {
  const statusMap: Record<string, any> = {
    'open': 'operational',
    'planned': 'planned_closure',
    'closed': 'renovation'
  };
  return statusMap[status] || status as any;
}

function calculateDaysUntil(date: Date): number {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

## Supabase SQL Schema

Below is the complete SQL schema for the Supabase tables that implement the operational data layer:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function for automatically updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Core user data extending auth.users
CREATE TABLE accelr8_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  phone_number TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- House operations data
CREATE TABLE house_operations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'planned', 'closed')),
  current_occupancy INTEGER DEFAULT 0,
  wifi_network TEXT,
  wifi_password TEXT,
  access_code TEXT,
  emergency_contacts JSONB,
  maintenance_contacts JSONB,
  cleaning_schedule JSONB,
  operational_notes TEXT,
  last_inspection_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room instances
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL,
  sanity_room_type_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  current_resident_id UUID REFERENCES accelr8_users(id),
  current_price DECIMAL(10,2),
  lease_start_date DATE,
  lease_end_date DATE,
  last_maintenance_date DATE,
  maintenance_notes TEXT,
  last_cleaned_date DATE,
  inventory_items JSONB,
  special_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (sanity_house_id, room_number)
);

-- Internal events
CREATE TABLE house_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_event_id TEXT,
  sanity_house_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_mandatory BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES accelr8_users(id),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event participation tracking
CREATE TABLE event_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES house_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE CASCADE,
  rsvp_status TEXT NOT NULL CHECK (rsvp_status IN ('attending', 'maybe', 'declined', 'no_response')),
  rsvp_time TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- External event registration
CREATE TABLE external_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES house_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  registration_time TIMESTAMPTZ DEFAULT NOW(),
  checkin_time TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(event_id, email)
);

-- Resident applications
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'draft', 
    'submitted', 
    'reviewing', 
    'interview_scheduled', 
    'interview_completed', 
    'approved', 
    'rejected', 
    'waitlisted',
    'accepted',
    'cancelled'
  )),
  preferred_move_in DATE,
  preferred_duration TEXT CHECK (preferred_duration IN ('1-3 months', '3-6 months', '6-12 months', '12+ months')),
  preferred_houses TEXT[],
  bio TEXT,
  responses JSONB,
  current_role TEXT,
  company TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  submitted_at TIMESTAMPTZ,
  referral_source TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES accelr8_users(id),
  reviewed_at TIMESTAMPTZ,
  assigned_house_id TEXT,
  assigned_room_id UUID,
  sanity_person_id TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application interviews
CREATE TABLE application_interviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES accelr8_users(id),
  scheduled_time TIMESTAMPTZ,
  completed_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  interview_notes TEXT,
  overall_impression TEXT CHECK (overall_impression IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_accelr8_users_updated_at BEFORE UPDATE ON accelr8_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_house_operations_updated_at BEFORE UPDATE ON house_operations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_house_events_updated_at BEFORE UPDATE ON house_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_participants_updated_at BEFORE UPDATE ON event_participants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_interviews_updated_at BEFORE UPDATE ON application_interviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Sanity Schema Definitions

Below are the Sanity schema definitions for the content types:

### Person Schema

```typescript
// schemas/person.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title or role in the organization',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'isTeamMember',
      title: 'Is Team Member',
      type: 'boolean',
      description: 'Is this person part of the Accelr8 team?',
      initialValue: false,
    }),
    defineField({
      name: 'isResident',
      title: 'Is Resident',
      type: 'boolean',
      description: 'Is this person a current resident?',
      initialValue: false,
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      description: 'Which house is this resident part of?',
      hidden: ({ document }) => !document?.isResident,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      description: 'When did this person join as resident or team member?',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'If former resident or team member, when did they leave?',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'twitter', type: 'url', title: 'Twitter' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'github', type: 'url', title: 'GitHub' },
        { name: 'website', type: 'url', title: 'Personal Website' },
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'company',
      title: 'Company/Project',
      type: 'string',
      description: 'Current company or project they are working on',
    }),
    defineField({
      name: 'displayOnWebsite',
      title: 'Display on Website',
      type: 'boolean',
      description: 'Show this person publicly on the website?',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order for team members display (lower numbers first)',
      hidden: ({ document }) => !document?.isTeamMember,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'profileImage',
      isTeam: 'isTeamMember',
      isResident: 'isResident',
    },
    prepare(selection) {
      const { title, subtitle, media, isTeam, isResident } = selection;
      let status = [];
      if (isTeam) status.push('Team');
      if (isResident) status.push('Resident');

      return {
        title,
        subtitle: status.length > 0 ? `${subtitle} (${status.join(', ')})` : subtitle,
        media,
      };
    },
  },
});
```

### House Schema

```typescript
// schemas/house.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'house',
  title: 'House',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'House Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this house currently active?',
      initialValue: true,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'address', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'zipCode', type: 'string', title: 'Zip/Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
        { name: 'coordinates', type: 'geopoint', title: 'Coordinates' },
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Amenity Name' },
            { 
              name: 'category', 
              type: 'string',
              title: 'Category',
              options: {
                list: [
                  { title: 'Technology', value: 'technology' },
                  { title: 'Workspace', value: 'workspace' },
                  { title: 'Comfort', value: 'comfort' },
                  { title: 'Kitchen', value: 'kitchen' },
                  { title: 'Entertainment', value: 'entertainment' },
                  { title: 'Services', value: 'services' },
                  { title: 'Other', value: 'other' },
                ]
              }
            },
            { name: 'icon', type: 'string', title: 'Icon Code' },
          ],
        },
      ],
    }),
    defineField({
      name: 'capacity',
      title: 'Total Capacity',
      type: 'number',
      validation: Rule => Rule.min(1),
    }),
    defineField({
      name: 'neighborhoodDetails',
      title: 'Neighborhood Details',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'localResources',
      title: 'Local Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Resource Name' },
            { name: 'category', type: 'string', title: 'Category' },
            { name: 'address', type: 'string', title: 'Address' },
            { name: 'distance', type: 'string', title: 'Distance' },
            { name: 'website', type: 'url', title: 'Website' },
          ],
        },
      ],
    }),
    defineField({
      name: 'houseRules',
      title: 'House Rules',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location.city',
      media: 'mainImage',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title,
        subtitle: `${subtitle}${!active ? ' (Inactive)' : ''}`,
        media,
      };
    },
  },
});
```

### Room Type Schema

```typescript
// schemas/roomType.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'roomType',
  title: 'Room Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Room Type Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Room Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        },
      ],
    }),
    defineField({
      name: 'basePrice',
      title: 'Base Price (Monthly)',
      type: 'number',
    }),
    defineField({
      name: 'capacity',
      title: 'Occupancy Capacity',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'squareFootage',
      title: 'Square Footage',
      type: 'number',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'floorPlan',
      title: 'Floor Plan',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      house: 'house.name',
      media: 'image',
    },
    prepare({ title, house, media }) {
      return {
        title,
        subtitle: house ? `${house}` : '',
        media,
      };
    },
  },
});
```

### Event Schema

```typescript
// schemas/event.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hackathon', value: 'hackathon' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Social', value: 'social' },
          { title: 'Demo Day', value: 'demo' },
          { title: 'Pitch Night', value: 'pitch' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      description: 'Which house is hosting this event?',
    }),
    defineField({
      name: 'isGlobal',
      title: 'Global Event',
      type: 'boolean',
      description: 'Is this an organization-wide event?',
      initialValue: false,
    }),
    defineField({
      name: 'isPublic',
      title: 'Public Event',
      type: 'boolean',
      description: 'Is this event open to the public?',
      initialValue: true,
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Physical location or "Virtual"',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'role', type: 'string', title: 'Role/Title' },
            { name: 'bio', type: 'text', title: 'Bio' },
            { 
              name: 'image', 
              type: 'image', 
              title: 'Image',
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      description: 'External registration link (if applicable)',
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Maximum Participants',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventType: 'eventType',
      startDate: 'startDateTime',
      house: 'house.name',
      media: 'mainImage',
    },
    prepare({ title, eventType, startDate, house, media }) {
      const date = startDate ? new Date(startDate).toLocaleDateString() : '';
      return {
        title,
        subtitle: `${eventType ? eventType + ' | ' : ''}${date}${house ? ' | ' + house : ''}`,
        media,
      };
    },
  },
});
```

## Schema Integration Example

Below is an example of how to integrate the schemas with Sanity and reference them in your application:

### Sanity Schema Configuration

```typescript
// sanity.config.ts
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'accelr8',
  title: 'Accelr8 Content',
  projectId: 'your-project-id',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
```

### Schemas Index

```typescript
// schemas/index.ts
import person from './person';
import house from './house';
import roomType from './roomType';
import event from './event';

export const schemaTypes = [
  person,
  house,
  roomType,
  event,
];
```

### Type Generation for TypeScript

To ensure type safety between your Sanity schema and TypeScript interfaces, use the Sanity CLI tool to generate types:

```bash
# Install the Sanity CLI if you haven't already
npm install -g @sanity/cli

# Generate types based on your schema
sanity install @sanity/typescript
sanity exec scripts/generateTypes.ts --with-user-token
```

Example script for generating types:

```typescript
// scripts/generateTypes.ts
import { createCliConfig } from 'sanity/cli';
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'your-project-id',
    dataset: 'production',
  },
  typescript: {
    // Generate TypeScript types from Sanity schemas
    generateTypes: true,
    outputPath: './src/lib/sanity.types.ts',
  },
});
``` 

## Implementation Guide

This section provides practical guidance on implementing and working with the dual-database architecture.

### Development Workflow

1. **Define your schemas first**:
   - Start with Sanity schemas for all content types
   - Create corresponding Supabase tables for operational data
   - Define TypeScript interfaces that match both systems

2. **Create your composite types**:
   - Extend base types using the patterns shown above
   - Normalize property names using camelCase
   - Add computed properties that derive from base data

3. **Build utility functions**:
   - Create converters for transforming database objects to composite types
   - Implement helper functions for common operations

### Data Access Patterns

For optimal performance and maintainability, follow these patterns:

#### Fetching Data

```typescript
// Example: Fetching a house with operations data
async function getHouseData(houseId: string): Promise<House> {
  // Fetch data in parallel
  const [sanityHouse, operations] = await Promise.all([
    // Get content from Sanity
    sanityClient.fetch(`*[_type == "house" && _id == $id][0]`, { id: houseId }),
    
    // Get operations data from Supabase
    supabase.from('house_operations')
      .select('*')
      .eq('sanity_house_id', houseId)
      .single()
      .then(result => result.data)
  ]);
  
  // Convert to composite type
  return convertSanityHouse(sanityHouse, operations);
}
```

#### Updating Data

Keep updates isolated to their respective systems:

```typescript
// Example: Updating house data across both systems
async function updateHouse(houseId: string, updates: Partial<House>): Promise<void> {
  // Separate content updates from operational updates
  const contentUpdates: Partial<SanityHouse> = {};
  const operationsUpdates: Partial<SupabaseHouseOperations> = {};
  
  // Map properties to their respective systems
  if (updates.name) contentUpdates.name = updates.name;
  if (updates.shortDescription) contentUpdates.shortDescription = updates.shortDescription;
  // ...more content fields
  
  if (updates.operations?.wifiPassword) 
    operationsUpdates.wifi_password = updates.operations.wifiPassword;
  if (updates.operations?.currentOccupancy !== undefined) 
    operationsUpdates.current_occupancy = updates.operations.currentOccupancy;
  // ...more operational fields
  
  // Execute updates in parallel
  await Promise.all([
    // Update content in Sanity (if needed)
    Object.keys(contentUpdates).length > 0 
      ? sanityClient.patch(houseId).set(contentUpdates).commit()
      : Promise.resolve(),
      
    // Update operations in Supabase (if needed)
    Object.keys(operationsUpdates).length > 0
      ? supabase.from('house_operations')
          .update(operationsUpdates)
          .eq('sanity_house_id', houseId)
      : Promise.resolve()
  ]);
}
```

### Caching Strategy

Implement a tiered caching strategy:

1. **Content (Sanity)**: 
   - Use ISR (Incremental Static Regeneration) for public content
   - Revalidate based on expected update frequency
   - Example: Houses might be revalidated every 24 hours

2. **Operational Data (Supabase)**:
   - Use SWR (stale-while-revalidate) for operational data
   - Set short TTL for frequently changing data
   - Example: Room availability might be revalidated every 5 minutes

3. **Composite Objects**:
   - Cache the composite objects in-memory or Redis
   - Invalidate when either source is updated
   - Example: When room status changes, invalidate the cached Room object

### Real-time Updates

For real-time features, use Supabase subscriptions:

```typescript
// Example: Getting real-time updates on room status
function subscribeToRoomStatus(roomId: string, onUpdate: (room: Room) => void): () => void {
  const subscription = supabase
    .from('rooms')
    .on('UPDATE', async (payload) => {
      if (payload.new.id === roomId) {
        // Fetch the complete room data
        const room = await getRoomWithDetails(roomId);
        onUpdate(room);
      }
    })
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeSubscription(subscription);
  };
}
```

### Error Handling

Implement robust error handling for cross-system operations:

```typescript
// Example: Error handling with fallbacks
async function getHouseWithFallback(houseId: string): Promise<House | null> {
  try {
    // Try to get the complete house data
    return await getHouseData(houseId);
  } catch (sanityError) {
    console.error('Error fetching from Sanity:', sanityError);
    
    try {
      // Fall back to just Supabase data if possible
      const { data: operations } = await supabase
        .from('house_operations')
        .select('*')
        .eq('sanity_house_id', houseId)
        .single();
      
      if (operations) {
        return {
          id: houseId,
          name: 'Unknown House', // Placeholder
          slug: houseId, // Use ID as slug placeholder
          active: true, // Assume active
          operations: {
            id: operations.id,
            status: mapStatus(operations.status),
            currentOccupancy: operations.current_occupancy,
            // ... other operations fields
          },
          isActive: operations.status !== 'closed',
        };
      }
    } catch (supabaseError) {
      console.error('Error fetching from Supabase:', supabaseError);
    }
    
    return null; // Could not get any data
  }
}
```

By following these patterns, you'll create a maintainable and performant system that leverages the strengths of both Sanity CMS for content and Supabase for operational data. 