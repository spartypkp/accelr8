# Accelr8 Website and Dashboard System

## About Accelr8: Our Story and Vision

### Genesis
Accelr8 began when Daniel and Pat met at a Web3 co-living experiment in the Sierra Nevada mountains hosted by Cabin DAO. Surrounded by ambitious builders working on cutting-edge technologies, they witnessed firsthand how magical the right community can be. What started as late-night conversations about the future of work and innovation evolved into a vision: create a space in San Francisco where the world's brightest minds could live, build, and grow together.

This wasn't just about shared housing—it was about creating an environment where serendipitous connections lead to outsized outcomes, where breakfast conversations spark midnight breakthroughs, and where the next generation of world-changing companies could begin.

### Evolution
Over time, Daniel and Pat built deep networks across technology and Web3. They organized events, hosted dinner gatherings, and connected builders who were working on similar problems. They recognized a pattern: when the right people come together in the right environment with the right incentives, innovation happens at an accelerated pace. Not through formal structures or rigid programs, but through organic connection and authentic collaboration.

Every event strengthened their conviction that community-driven innovation was the future—and that San Francisco needed a physical hub where this approach could flourish full-time.

### Accelr8 Today
Today, Accelr8 is bringing these learnings and vision to life through our hacker house in San Francisco. We've created a space designed specifically for AI and Web3 founders at the pre-seed and seed stages—those building the future right at technology's frontier.

Our 15-bedroom house in Nob Hill has become home to engineers, designers, and founders from diverse backgrounds but with a common trait: they're all exceptionally talented builders committed to creating something meaningful.

Through weekly house events, monthly hackathons, demo days, and daily interactions, our community is accelerating innovation in ways that traditional accelerators and incubators simply cannot replicate.

#### Impact So Far
- **40+ Founders** building next-gen startups in AI, Web3, and beyond
- **15+ Startups Launched** from ideation to successful funding rounds
- **100+ Community Events** including hackathons, workshops, pitch days, and social gatherings

### Future Vision
We believe we're just at the beginning of what's possible when you bring together the right people in the right environment. Our vision for Accelr8 extends far beyond a single house in San Francisco—we're building a globally connected network of innovation hubs that will reshape how talented people live, work, and create together.

#### Phase I: San Francisco Network
Our immediate goal is to create a network of innovation hubs across San Francisco, forming a powerful ecosystem of talent, resources, and opportunities for founders. By creating multiple nodes across San Francisco, we'll build critical mass for innovation, allowing members to tap into different sub-communities while maintaining the cohesive Accelr8 experience.

**Why a network matters:**
- **Talent density**: Multiple houses means more founders, engineers, and creators in proximity
- **Specialization**: Houses can develop unique focuses (AI, Web3, Biotech) while remaining connected
- **Local network effects**: Cross-house events, shared resources, and expanded opportunity networks

#### Phase II: Global Innovation Network
Our ultimate vision extends far beyond San Francisco. We're creating a global network of innovation hubs where the next generation of technology companies are born, all connected through a shared community of ambitious builders and entrepreneurs.

**The Accelr8 Network Advantage:**
- **Global Community**: Connect with brilliant minds worldwide
- **Talent & Co-founders**: Find your perfect collaborator
- **Remote Work**: Move between locations while staying connected
- **Launch Support**: Resources to help you scale globally
- **Prestige & Credibility**: Be part of a recognized network
- **Global Events**: Participate in cross-location collaborations

When you join Accelr8, you're not just renting a room—you're becoming part of a global network designed to accelerate your journey as a founder. Whether you need a co-founder, technical talent, investment opportunities, or simply a supportive community that understands the challenges of building, the Accelr8 network will be there to support you at every step.

### Our Guiding Principles
- **Community First**: We believe that meaningful connections between founders create exponential value. Our community is our greatest asset.
- **High Talent Density**: We curate our community to bring together exceptional people with complementary skills and shared ambition.
- **Innovation Through Interaction**: We foster an environment where serendipitous collisions of ideas and perspectives lead to breakthrough innovations.

## Project Context

### What We're Building
We are developing a comprehensive website and dashboard system for Accelr8, a hacker house organization. Currently, Accelr8 operates one house but has plans for rapid expansion to multiple locations. This system will serve as both a public-facing marketing website and a powerful internal tool for residents and administrators.

### Why We're Building It
As Accelr8 scales from one house to multiple locations, we need a centralized platform that can:
1. Present a unified brand and application process to potential residents
2. Provide residents with house-specific information and community tools
3. Give house administrators tools to effectively manage operations
4. Enable organization-level oversight across multiple properties
5. Support the company's mission of fostering a high-talent-density environment for founders

This platform will be critical to maintaining operational efficiency during expansion while preserving the community experience that makes Accelr8 valuable to residents.

## Implementation Progress

### Completed Components
- ✅ Project setup and configuration
- ✅ UI component library setup with Shadcn UI
- ✅ Core layout components (NavBar, Footer)
- ✅ Global styling with customized dark theme

### Admin Dashboard (Completed)
- ✅ House Admin Dashboard at `/dashboard/[houseId]/admin`
- ✅ House health metrics with KPIs
- ✅ Recent activity tracking
- ✅ Quick stat cards for key metrics
- ✅ Sub-page structure for management functions

### Public Site (In Progress)
- ✅ Homepage with hero section and feature overview
- ✅ Apply page with multi-step application form
- ✅ Blog/resources section structure
- ✅ Events page framework

### Authentication & Authorization (In Progress)
- ✅ Route configuration with role-based access
- ✅ House-specific access controls
- ✅ Authentication flow with Supabase
- ✅ Role-based redirection

### Resident Dashboard (In Progress)
- ✅ Basic dashboard structure
- 🔄 Community features
- 🔄 House-specific content

### Not Started
- Detailed admin management sub-pages (residents, operations, etc.)
- Super-admin dashboard for company executives
- Content integration - final content, images, and copy

### Next Steps
1. Complete resident dashboard features
2. Develop detailed house admin sub-pages
3. Implement the super-admin dashboard
4. Integrate with backend APIs for live data
5. Testing and QA
6. Deployment

## Technology Stack

- **Frontend**: NextJS (App Router), React, TailwindCSS, ShadCN components
- **Backend/Database**: 
  - **Supabase**: PostgreSQL database and authentication
  - **Sanity CMS**: Content management for marketing and public-facing content
- **Hosting**: Vercel

## Data Architecture: Sanity CMS & Supabase Integration

We've implemented a sophisticated dual-database architecture that leverages the strengths of both Sanity CMS and Supabase while maintaining strong type safety through TypeScript.

### Architecture Overview

#### Core Principles 

1. **Single Source of Truth**: Each data entity has one primary location
   - Sanity: Content, public-facing data, media assets
   - Supabase: Operational data, user authentication, transactions

2. **Type Extension Pattern**: Composite types extend base types using TypeScript interfaces
   - Base types directly reflect database schemas
   - Composite types normalize and combine data from both sources

3. **Clear Data Origin**: Each property's source system is explicit and traceable
   - Properties are grouped by their origin
   - Naming conventions identify the data source

4. **Normalized Properties**: Consistent naming across systems
   - camelCase for all TypeScript interfaces
   - snake_case for Supabase database
   - Consistent property transformations

### Sanity CMS: Content Management

Sanity handles all **public-facing, editable content** that benefits from an editorial workflow:

- **House Profiles**: Descriptions, images, amenities, location details
- **Room Types**: Standard configurations, features, images
- **Person Profiles**: Public resident/team information
- **Public Events**: Organization activities, programs, hackathons
- **Media Assets**: Images, documents, videos

Sanity offers several advantages for this content:

- Rich editorial interface with customizable workflows
- Powerful image handling with hotspot support
- Structured content with references between types
- Version history and collaboration tools

### Supabase: Application Data & Operations

Supabase manages all **transactional, operational, and user-specific data**:

- **Authentication**: User accounts, roles, permissions
- **House Operations**: WiFi passwords, access codes, occupancy stats
- **Room Instances**: Current status, resident assignments, leases
- **Internal Events**: House meetings, private gatherings
- **Applications**: Prospective resident applications, interviews
- **Bookings & Transactions**: Resource reservations, payments

Supabase advantages for operational data:

- Real-time updates via subscriptions
- Row-level security for fine-grained access control
- PostgreSQL for robust relational data
- Serverless functions for business logic

### Type System Architecture

Our type system follows a clean extension pattern where composite types integrate data from both sources:

```typescript
// Base Sanity type
interface SanityHouse {
  _id: string;
  name: string;
  slug: { current: string };
  // Other Sanity fields...
}

// Base Supabase type
interface SupabaseHouseOperations {
  id: string;
  sanity_house_id: string;
  status: string;
  // Other Supabase fields...
}

// Composite type using extension
interface House extends Omit<SanityHouse, '_id' | 'slug'> {
  // Normalized Sanity properties
  id: string; // renamed from _id
  slug: string; // simplified from slug.current
  
  // Add operational data from Supabase
  operations?: {
    id: string;
    status: 'operational' | 'maintenance' | 'planned_closure';
    // Other normalized operational fields...
  };
  
  // Computed properties
  isActive: boolean;
  occupancyRate?: number;
}
```

This pattern provides several benefits:

1. **Type safety** - Changes to base schemas automatically propagate to composite types
2. **Clear data lineage** - Properties are traceable to their origin
3. **Normalized interfaces** - Consistent property naming across the application
4. **Computed properties** - Derived data based on multiple sources

### Data Fetching Pattern

Data is fetched from both systems and combined into composite objects:

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

### Reference Management

Cross-database references are managed through ID fields:

1. **Sanity → Supabase**: Reference fields in Supabase tables link to Sanity IDs
   - Example: `sanity_house_id` in the rooms table references a Sanity house document

2. **Supabase → Sanity**: User profiles in Supabase can link to Sanity person documents
   - Example: User metadata contains `sanity_person_id` to reference their public profile

### Caching Strategy

A tiered caching approach optimizes performance:

1. **Content (Sanity)**: 
   - Incremental Static Regeneration (ISR) for public content
   - Longer cache lifetimes for stable content

2. **Operational Data (Supabase)**:
   - SWR (stale-while-revalidate) for frequently changing data
   - Real-time subscriptions for critical updates

3. **Composite Objects**:
   - In-memory or Redis caching for frequently accessed composites
   - Cache invalidation triggered by changes in either system

### Real-time Updates

For dynamic features, we use Supabase's real-time capabilities:

```typescript
// Subscribe to room status changes
function subscribeToRoomStatus(roomId: string, onUpdate: (room: Room) => void) {
  return supabase
    .from('rooms')
    .on('UPDATE', async (payload) => {
      if (payload.new.id === roomId) {
        // Fetch the complete room data and notify
        const room = await getRoomWithDetails(roomId);
        onUpdate(room);
      }
    })
    .subscribe();
}
```

### Entity Relationships

Our core entity model consists of these primary types:

1. **User/Person**
   - Authentication in Supabase
   - Extended profile in `accelr8_users` table
   - Public profile in Sanity `person` documents
   - Joined through references in auth metadata

2. **House**
   - Content details in Sanity `house` documents
   - Operational data in `house_operations` table
   - Joined through `sanity_house_id` references

3. **Room**
   - Type definition in Sanity `roomType` documents
   - Instances in Supabase `rooms` table
   - Joined through `sanity_room_type_id` references

4. **Event**
   - Public events in Sanity `event` documents
   - Internal events in `house_events` table
   - Optional cross-reference through `sanity_event_id`

5. **Application**
   - Entirely in Supabase with `applications` table
   - References to Sanity houses through `preferred_houses`
   - Creates Sanity person when approved

## Sanity CMS Schema

Sanity is configured with the following primary content types:

### Core Content Types

1. **House**
   - Location details
   - Description and marketing copy
   - Photo gallery
   - Amenities (reference to Amenity documents)
   - Features and specifications
   - Neighborhood information

2. **Person**
   - Name and profile information
   - Bio and background
   - Skills and expertise
   - Public-facing social links
   - Profile photo
   - Role (team member, resident, alumnus)

3. **Event**
   - Public-facing events
   - Title and description
   - Date and time
   - Location
   - Featured images
   - Event type and category
   - Related house (reference)

4. **BlogPost**
   - Title and slug
   - Author (reference to Person)
   - Publication date
   - Featured image
   - Body content (Portable Text)
   - Categories and tags
   - Related content

5. **Amenity**
   - Name and description
   - Icon
   - Category

6. **Testimonial**
   - Quote
   - Author (reference to Person)
   - Position/company
   - Rating

7. **FAQ**
   - Question
   - Answer
   - Category
   - Related house (optional reference)

8. **Resource**
   - Name and description
   - Type (meeting room, equipment, etc.)
   - House (reference)
   - Availability rules
   - Images

9. **MainPage**
   - Page builder with flexible content blocks
   - SEO metadata
   - Page-specific settings

### Content Relationships

- Houses reference Amenities and may link to Events
- BlogPosts reference Persons as authors
- Events may reference Houses
- Testimonials reference Persons
- MainPages may reference any content type for dynamic page building

## Supabase Schema

Supabase handles the operational and transactional aspects of the platform with a comprehensive set of tables:

### Core Tables

1. **accelr8_users**
   - Extends Supabase auth.users with UUID reference
   - Emergency contact information
   - Phone number and activity tracking
   - Created/updated timestamps with automatic management

2. **house_operations**
   - References Sanity House ID for content integration
   - Operational status tracking ('open', 'planned', 'closed')
   - Current occupancy metrics
   - WiFi and access information (securely stored)
   - Contact information for maintenance and emergencies
   - Cleaning schedule and operational notes

3. **rooms**
   - References both Sanity house and room type IDs
   - Room number and floor information
   - Status tracking (available, occupied, maintenance, reserved)
   - Current resident reference
   - Pricing information
   - Lease period tracking
   - Maintenance history and inventory

4. **house_events**
   - House-specific or global events
   - Optional reference to Sanity event for public events
   - Scheduling information (start/end times)
   - Mandatory flag for required attendance
   - Participant count and capacity tracking
   - Status management (scheduled, in progress, completed, cancelled)

5. **event_participants**
   - RSVP tracking with status options
   - Timestamp of RSVP submission
   - Attendance verification
   - Feedback collection

6. **external_participants**
   - For public events with non-resident attendees
   - Basic contact information
   - Registration and check-in tracking

7. **applications**
   - Prospective resident application process
   - Comprehensive status tracking (9 different statuses)
   - Preferred move-in date and duration
   - Preferred houses (array of Sanity house IDs)
   - Form responses as JSONB for flexible schema
   - Professional links (LinkedIn, GitHub, portfolio)
   - Application review metadata
   - House/room assignment tracking

8. **application_interviews**
   - Interview scheduling and completion tracking
   - Duration and interviewer assignment
   - Status options (scheduled, completed, cancelled, rescheduled, no-show)
   - Notes and impression rating system

### Database Features

Our schema leverages PostgreSQL's advanced features:

1. **Automatic Timestamps**
   - Custom function and triggers for all `updated_at` fields
   - Consistent timestamp handling across tables

2. **Referential Integrity**
   - Foreign key constraints with appropriate cascade behaviors
   - UUID references to auth.users

3. **Data Validation**
   - CHECK constraints for status fields
   - Unique constraints for preventing duplicates
   - NOT NULL constraints for required fields

4. **JSONB Storage**
   - Flexible schema for form responses
   - Structured data for contacts and schedules

### Complete SQL Schema

The full SQL schema implements these tables with proper constraints and relationships:

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

## Implementation Strategy for Data Integration

We've implemented a comprehensive integration strategy that leverages the type extension pattern to seamlessly combine data from Sanity CMS and Supabase.

### Type-First Development Approach

Our implementation follows a "type-first" development approach:

1. **Define Base Types**: 
   - Create TypeScript interfaces that directly match database schemas
   - Generate Sanity types using their schema-to-typescript tools
   - Define Supabase types that match SQL tables

2. **Create Composite Types**:
   - Extend base types using TypeScript's `extends` and `Omit` patterns
   - Normalize property names with consistent conventions
   - Add computed properties that derive from multiple sources

3. **Build Utility Functions**:
   - Create converter functions to transform raw data into composite types
   - Implement fetch helpers that retrieve and combine data
   - Handle error cases and fallbacks

### Authentication Flow

1. User authentication happens exclusively through Supabase Auth
2. After authentication, the application:
   - Fetches user metadata including role and `sanity_person_id` 
   - Retrieves the extended profile from `accelr8_users` table
   - If applicable, fetches the corresponding public profile from Sanity
   - Combines all data into a unified `UserProfile` object

```typescript
// Example user profile integration
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Get auth data and metadata
    const { data: authData } = await supabase.auth.getUser(userId);
    if (!authData?.user) return null;
    
    // Get extended data from accelr8_users table
    const { data: extendedData } = await supabase
      .from('accelr8_users')
      .select('*')
      .eq('id', userId)
      .single();

    // Get Sanity profile if ID exists
    let sanityProfile = null;
    if (authData.user.user_metadata?.sanity_person_id) {
      sanityProfile = await sanityClient.fetch(
        `*[_type == "person" && _id == $id][0]`,
        { id: authData.user.user_metadata.sanity_person_id }
      );
    }
    
    // Create the composite user profile
    return {
      id: authData.user.id,
      email: authData.user.email,
      role: authData.user.user_metadata?.role || 'resident',
      onboarding_completed: authData.user.user_metadata?.onboarding_completed || false,
      
      // Add extended data if available
      extendedData: extendedData ? {
        emergency_contact_name: extendedData.emergency_contact_name,
        emergency_contact_phone: extendedData.emergency_contact_phone,
        phone_number: extendedData.phone_number,
        last_active: extendedData.last_active
      } : undefined,
      
      // Add Sanity profile if available
      sanityProfile: sanityProfile ? {
        id: sanityProfile._id,
        name: sanityProfile.name,
        slug: sanityProfile.slug?.current,
        profileImage: sanityProfile.profileImage,
        bio: sanityProfile.bio,
        // ...other fields
      } : undefined,
      
      // Computed properties
      isAdmin: authData.user.user_metadata?.role === 'admin' || 
               authData.user.user_metadata?.role === 'super_admin',
      isSuperAdmin: authData.user.user_metadata?.role === 'super_admin',
      isResident: authData.user.user_metadata?.role === 'resident'
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
```

### Content Delivery Strategy

#### Public Website
For public-facing pages, we implement a hybrid rendering approach:

1. **Static Content**: 
   - Use Next.js Static Site Generation (SSG) with revalidation
   - Fetch Sanity content at build time with incremental updates
   - Pre-render pages for optimal performance

```typescript
// Example of fetching houses for public display
export async function getStaticProps() {
  const houses = await sanityClient.fetch(`
    *[_type == "house" && active == true] {
      _id,
      name,
      slug,
      mainImage,
      shortDescription,
      "location": location {
        city,
        state
      }
    }
  `);
  
  return {
    props: { houses },
    revalidate: 3600 // Revalidate every hour
  };
}
```

2. **Dynamic Content**:
   - For personalized or real-time data, use client-side fetching
   - Combine static Sanity content with dynamic Supabase data
   - Implement SWR pattern for optimal user experience

```typescript
// Example: Room availability on house page
function RoomAvailability({ roomTypeId }) {
  const { data, error } = useSWR(
    `/api/rooms/availability?roomTypeId=${roomTypeId}`,
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  );
  
  // Rest of component implementation
}
```

#### Dashboard Features

For authenticated dashboard features, we implement:

1. **Real-time Updates**:
   - Use Supabase subscriptions for live operational data
   - Update UI reactively as data changes
   - Optimize for responsiveness

```typescript
// Example: Event RSVP counter
function EventRSVPCounter({ eventId }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Initial count
    fetchCurrentCount();
    
    // Subscribe to changes
    const subscription = supabase
      .from('event_participants')
      .on('INSERT', () => fetchCurrentCount())
      .on('DELETE', () => fetchCurrentCount())
      .subscribe();
      
    return () => supabase.removeSubscription(subscription);
  }, [eventId]);
  
  async function fetchCurrentCount() {
    const { count } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact' })
      .eq('event_id', eventId)
      .eq('rsvp_status', 'attending');
      
    setCount(count);
  }
  
  return <div>Attending: {count} people</div>;
}
```

2. **Combined Data Views**:
   - Fetch and merge data from both sources
   - Transform into strongly-typed composite objects
   - Present unified interfaces to components

```typescript
// Example API route that combines data
export async function getRoom(req, res) {
  const { roomId } = req.query;
  
  try {
    // Get room data from Supabase
    const { data: roomData, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
      
    if (error) throw error;
    
    // Get room type from Sanity
    const roomType = await sanityClient.fetch(`
      *[_type == "roomType" && _id == $id][0]
    `, { id: roomData.sanity_room_type_id });
    
    // Get house data from Sanity
    const house = await sanityClient.fetch(`
      *[_type == "house" && _id == $id][0]{
        _id, name, location
      }
    `, { id: roomData.sanity_house_id });
    
    // Convert to composite Room object
    const room = convertToRoomType(roomData, roomType, house);
    
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Data Synchronization

For key entities that exist in both systems, we implement sync mechanisms:

1. **User/Person Creation**:
   - When a user is approved from an application, create both:
     - Supabase auth user with appropriate role
     - Sanity person document with public profile
     - Link them via reference IDs

2. **Event Publishing**:
   - Internal events can be "published" to create Sanity documents
   - Public events can have internal operational data in Supabase
   - Maintain references between systems via IDs

3. **Webhooks**:
   - Sanity webhooks trigger updates for critical content changes
   - Next.js API routes process webhook data and update Supabase
   - Handle synchronization of key reference data

### Error Handling and Resilience

Our implementation includes robust error handling and resilience mechanisms:

1. **Graceful Degradation**:
   - Components can render with partial data if one source fails
   - Fallback strategies use available data from either system
   - Clear error boundaries prevent cascading failures

2. **Data Validation**:
   - TypeScript interfaces enforce correct data structures
   - Runtime validation ensures data integrity
   - Conversion functions handle missing or malformed data

## Main Website Requirements

### Public-Facing Content
1. **Homepage**
   - Mission and vision statement
   - Value proposition for founders
   - Featured testimonials from current/past residents
   - Quick stats on success stories
   - Call-to-action for applications

2. **Story Page**
   - Company story and philosophy
   - Team members/leadership profiles
   - Accelr8 mission and values

3. **Houses Overview**
   - Map/visual display of all hacker house locations
   - Brief description of each house's unique features
   - Filtering options (location, amenities, availability)
   - Preview cards with key information

4. **Individual House Public Pages**
   - Location and neighborhood details
   - Room types and amenities
   - Photo gallery
   - Current resident count/capacity
   - Upcoming events specific to that house
   - House-specific FAQs

5. **Services Page**
- Page for showcasing non-housing services accelr8 offers founders and startups

6. **Application Page**
   - Application form
   - Selection criteria
   - Timeline for selection process
   - FAQs about application process

7. **Media**
   - Founder stories
   - Startup resources
   - Community highlights

8. **Contact/Support Page**

### Authentication System
- Registration flow
- Login system
- Password recovery
- Role-based access (resident, admin, super-admin)

## Authentication & Authorization Architecture

The Accelr8 platform implements a comprehensive authentication and authorization system using Next.js middleware and Supabase authentication. This system enforces robust access controls while maintaining a clean user experience.

### Authentication Flow

1. **User Authentication**
   - Authentication is handled by Supabase Auth
   - Login, registration, and password recovery flows are provided
   - Sessions are managed via cookies with proper security measures

2. **Route Protection**
   - All routes under `/dashboard/*` are protected and require authentication
   - Middleware intercepts requests to check for valid sessions
   - Unauthenticated users are redirected to the login page with return URL

3. **Role-Based Access Control**
   - Three user roles with increasing permissions:
     - `resident`: Basic access to resident features for assigned houses
     - `admin`: House management capabilities plus resident features
     - `super_admin`: Full access to all houses and features

4. **House-Specific Permissions**
   - Users only have access to houses they're associated with
   - Residents can only access their assigned houses (via `residencies` table)
   - Admins can only manage houses they're assigned to (via `house_admins` table)
   - Super admins have access to all houses

### Implementation Details

1. **Middleware Architecture**
   - Root middleware (`src/middleware.ts`) intercepts all requests
   - Auth-specific middleware (`src/lib/supabase/middleware.ts`) handles authentication logic
   - Clean fallbacks for authentication failures

2. **Dashboard Entry Point**
   - `/dashboard` serves as entry to house selection
   - Displays houses the user has access to based on their role
   - Admins see houses they manage, residents see houses they live in

3. **House Access Verification**
   - When accessing a specific house (`/dashboard/[houseId]/*`):
     - Middleware verifies the user has access to that house
     - Checks appropriate table based on user role (`residencies` or `house_admins`)
     - Redirects to house selection if access check fails

4. **Section-Based Permissions**
   - `/dashboard/[houseId]/resident/*` - Resident functionality (accessible to all users with house access)
   - `/dashboard/[houseId]/admin/*` - Admin functionality (only for admins and super admins)
   - Routing structure enforces clear separation of concerns

5. **UI Components & Navigation**
   - Navigation adapts based on user role and current section
   - Admins can switch between resident and admin views
   - Layout components handle conditional rendering based on permissions

### Security Considerations

1. **Multiple Verification Layers**
   - Client-side navigation restrictions
   - Server middleware protection
   - Database-level access controls
   - UI conditional rendering

2. **Principle of Least Privilege**
   - Users only see navigation options they have permission to access
   - Database queries are scoped to the user's role and assigned houses
   - Super admin privileges are strictly controlled

3. **Session Management**
   - Secure cookie handling
   - Proper token refresh
   - Session timeout management

## House Dashboard (Resident Portal)

When a resident logs in, they should be directed to their house dashboard with:

1. **Resident Home**
   - Personalized welcome
   - Important announcements
   - Upcoming house events
   - Quick links to common actions

2. **Community Hub**
   - Resident directory with profiles and skills
   - Messaging system for resident communication
   - Project showcase/collaboration board
   - Interest/skill matching for potential co-founders

3. **Events Calendar**
   - House-specific events
   - Organization-wide events
   - RSVP functionality
   - Option to propose events

4. **Resource Booking**
   - Meeting rooms
   - Common spaces for presentations
   - Equipment checkout

5. **Maintenance Requests**
   - Submit new requests
   - Track status of existing requests

6. **House Information**
   - House rules and guidelines
   - Local area resources (grocery, coffee shops, etc.)
   - Emergency contacts
   - Wi-Fi information and tech support

7. **Billing/Payments**
   - Rent payment status
   - Payment history
   - Receipt downloads

## House Admin Dashboard

House administrators (house managers) can access an admin section directly within the house dashboard at `/dashboard/[houseId]/admin`. This provides a more integrated management experience tied directly to the specific house context. Key functionality includes:

1. **Admin Dashboard Overview**
   - House health metrics (occupancy, satisfaction, etc.)
   - Quick stats (pending maintenance, upcoming events)
   - Recent activity feed
   - Quick actions for common management tasks

2. **Resident Management**
   - View all current residents
   - Application reviews for prospective residents
   - Check-in/check-out processing
   - Room assignments

3. **Operations Management**
   - Maintenance request tracking
   - Inventory management
   - Cleaning schedule
   - Service provider contacts

4. **Events Management**
   - Create and publish events
   - Track RSVPs and attendance
   - Resource allocation for events

5. **Analytics**
   - House occupancy rates
   - Event participation metrics
   - Resident satisfaction scores
   - Community engagement metrics

6. **Financial Overview**
   - Rent collection status
   - Outstanding payments
   - Operational expenses
   - Budget tracking

7. **Application Management**
   - Review new applications
   - Schedule interviews
   - Track application status
   - Send acceptance/rejection notifications

8. **Communication Tools**
   - House-wide announcements
   - Targeted communications
   - Feedback collection

## Super-Admin Dashboard (Organization-Level)

For managing the entire Accelr8 operation across all houses:

1. **Multi-House Overview**
   - At-a-glance status of all properties
   - Comparative metrics and KPIs
   - Alerting system for issues requiring attention

2. **Expansion Management**
   - New house setup workflow
   - Template configuration for new houses

3. **Global Analytics**
   - Cross-house comparison
   - Success metrics tracking
   - Growth analytics

4. **Organization Settings**
   - Branding controls
   - Global policies
   - Role and permission management

## Routing Structure

```
/                                  # Main homepage
/story                             # About Accelr8 Our story
/houses                            # All houses overview
/houses/[houseId]                  # Public house page
/events                            # Organization events
/apply                             # Application page
/media                             # Media content and resources

# Auth routes
/login                             # Login page
/register                          # Registration
/forgot-password                   # Password recovery

# Authenticated routes
/dashboard                         # House selection dashboard

# House-specific resident dashboard
/dashboard/[houseId]/resident             # Resident dashboard home
/dashboard/[houseId]/resident/community   # Community features
/dashboard/[houseId]/resident/events      # Events calendar
/dashboard/[houseId]/resident/resources   # Resource booking
/dashboard/[houseId]/resident/maintenance # Maintenance requests
/dashboard/[houseId]/resident/billing     # Payment information
/dashboard/[houseId]/resident/profile     # User profile

# House admin routes (house manager)
/dashboard/[houseId]/admin                # House admin dashboard
/dashboard/[houseId]/admin/residents      # Resident management
/dashboard/[houseId]/admin/operations     # Operations management
/dashboard/[houseId]/admin/events         # Events management
/dashboard/[houseId]/admin/analytics      # House analytics
/dashboard/[houseId]/admin/finances       # Financial management
/dashboard/[houseId]/admin/applications   # Application management

# Super-admin routes (organization level)
/admin                             # Super-admin overview of all houses
/admin/expansion                   # New house setup
/admin/analytics                   # Organization-wide analytics
/admin/settings                    # Global settings
```

## Implementation Phases

### Phase 1: Foundation (Completed)
- ✅ Set up project with NextJS, Tailwind, ShadCN, and Supabase
- ✅ Implement basic routing structure
- ✅ Develop admin interfaces and dashboard structure

### Phase 2: Resident Experience (Next Focus)
- Develop house-specific dashboards
- Create community features
- Implement event calendar
- Build maintenance request system

### Phase 3: Content and Integration (Added)
- ✅ Set up Sanity CMS schemas
- Implement content fetching from Sanity
- Connect Supabase for operational data
- Build unified API layer

### Phase 4: Advanced Admin Tools & Public Site
- Enhance public website pages with content
- Implement authentication and authorization
- Connect to backend APIs and data sources

### Phase 5: Organization Management
- Develop super-admin overview
- Create house expansion tools
- Implement cross-house analytics
- Build global settings management

## Timeline
- Phase 1: Core structure and admin features (2 weeks) - Completed
- Phase 2: Resident features and community tools (2 weeks) - In Progress
- Phase 3: Content and Integration (1 week) - Starting
- Phase 4: Advanced admin tools and public site (1 week)
- Phase 5: Testing, optimization, and deployment (1 week)

## Integration Challenges & Solutions

### Content Synchronization
**Challenge**: Keeping content in sync between Sanity and operational data in Supabase.
**Solution**: Use Sanity webhooks to trigger updates to Supabase when relevant content changes.

### Performance Optimization
**Challenge**: Maintaining performance when fetching from two different systems.
**Solution**: 
- Use ISR for Sanity content
- Implement efficient caching strategies
- Create batched queries that minimize round-trips

### User Profile Management
**Challenge**: Managing user profiles across both systems.
**Solution**: 
- Store core user data in Supabase
- Create public profiles in Sanity when needed
- Link with consistent IDs

## TypeScript Types

Our TypeScript type system provides a robust foundation for the application, emphasizing type safety, clarity, and maintainability.

### Architecture

The type system follows a clean extension pattern with three layers:

1. **Base Types**: Direct reflections of database structures
   - `SanityHouse`, `SupabaseHouseOperations`, etc.
   - Generated from schemas or manually defined to match DB tables

2. **Composite Types**: Extended types that combine sources
   - `House`, `Room`, `Event`, etc.
   - Normalize property names and add computed properties

3. **Utility Types**: Supporting types and shared interfaces 
   - Common enums, shared interfaces, helper types



### Type Extension Pattern

Our composite types follow a consistent pattern that extends base types:

```typescript
// Example from src/lib/types.ts
import { House as SanityHouse } from "./sanity.types";

// Base Supabase type
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

// Composite type extending Sanity type with operational data
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
```

### Key Benefits

This pattern provides several advantages:

1. **Type Safety**: Properties are automatically updated when base types change
2. **Clarity**: Clear separation between content and operational data
3. **Normalization**: Consistent property naming (camelCase) across the app
4. **Documentation**: Self-documenting code with type definitions
5. **Intellisense**: Better developer experience with autocomplete

### Unified User Types

User management is particularly complex as it spans authentication, extended data, and public profiles:

```typescript
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

// Composite user profile type
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
```

### Rooms and Events

Rooms and events illustrate the power of combining entities across systems:

```typescript
// Room example showing combined operational data with content type reference
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
  // ...other normalized properties

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

// Event example showing unified type handling
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

  // Source-specific properties
  sanityData?: Omit<SanityEvent, '_id' | 'house' | 'startDateTime' | 'endDateTime' | 'title' | 'shortDescription'> & {
    slug?: string; // simplified from slug.current
    isGlobal: boolean;
    isPublic: boolean;
  };

  operationalData?: Omit<SupabaseHouseEvent,
    'id' | 'sanity_event_id' | 'sanity_house_id' | 'title' |
    'description' | 'start_time' | 'end_time' | 'location' |
    'created_at' | 'updated_at'> & {
      isMandatory: boolean; // renamed from is_mandatory
      // ...other operational data
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

