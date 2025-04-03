# Accelr8 Frontend Integration Plan: From Skeleton to Real Implementation

This document outlines the strategic plan for transitioning the Accelr8 website from skeleton UI components to a fully functional application integrated with Sanity CMS and Supabase.

## Technical Prerequisites

Before beginning implementation, ensure:

1. **Sanity Integration**
   - Sanity client configured in the Next.js project (`lib/sanity.js`)
   - CORS settings in Sanity allow requests from development and production URLs
   - Environment variables configured for Sanity project ID and dataset

2. **Supabase Integration** [Done]
   - Supabase client set up in Next.js (`lib/supabase/`)
   - Row-level security policies configured for all tables
   - Environment variables for Supabase URL and anon key

3. **Repository Configuration**
   - Determine workflow for syncing Sanity schema changes
   - Consider using git submodules or npm packages if beneficial

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

#### 1.1 Unified Data Layer

Create utilities for data fetching that combine Sanity and Supabase data:

```typescript
// lib/api.ts

// Fetch house with both Sanity content and Supabase operational data
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
  
  // Get operational data from Supabase
  const { data: roomsData } = await supabaseClient
    .from('rooms')
    .select('*')
    .eq('sanity_house_id', houseId);
    
  // Combine the data
  return {
    ...houseContent,
    rooms: roomsData || []
  };
}
```

#### 1.2 Authentication System

Implement Supabase authentication with user profile enrichment from Sanity:

```typescript
// lib/auth.ts

// Get full user profile combining Supabase and Sanity data
export async function getUserProfile(userId: string) {
  // Get user from Supabase
  const { data: userData } = await supabaseClient
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
```

#### 1.3 Image Optimization Utilities

Create utilities for handling Sanity images correctly with Next.js:

```typescript
// lib/image.ts
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './sanity';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Example usage with Next.js Image:
// <Image 
//   src={urlFor(house.mainImage).width(800).url()} 
//   alt={house.name}
//   width={800}
//   height={500}
// />
```

### Phase 2: Public Website Integration (Week 1-2)

#### 2.1 Homepage ✅

Update the homepage to use real content from Sanity:

1. ✅ Create data fetching in `page.tsx` using the Sanity client
2. ✅ Replace hardcoded hero section with Sanity content
3. ✅ Load features from Sanity instead of using hardcoded arrays
4. ✅ Implement real house previews from Sanity with dynamic routing

```typescript
// src/app/page.tsx
export async function generateMetadata() {
  const homepage = await sanityClient.fetch(`
    *[_type == "mainPage" && slug.current == "home"][0]{
      title,
      description,
      openGraph
    }
  `);
  
  return {
    title: homepage.title,
    description: homepage.description,
    openGraph: homepage.openGraph
  };
}

export default async function HomePage() {
  const homepage = await sanityClient.fetch(`
    *[_type == "mainPage" && slug.current == "home"][0]{
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
  
  return (
    <PublicLayout>
      {homepage.content.map((section, index) => {
        if (section._type === 'hero') {
          return <HeroSection key={index} data={section} />;
        }
        if (section._type === 'featureSection') {
          return <FeaturesSection key={index} data={section} />;
        }
        if (section._type === 'housePreviewSection') {
          return <HousePreviewSection key={index} data={section} />;
        }
        return null;
      })}
    </PublicLayout>
  );
}
```

#### 2.2 Houses Overview Page ✅

Implement the houses overview page with real data:

1. ✅ Fetch houses from Sanity
2. ✅ Implement filtering based on amenities and locations
3. ✅ Create responsive grid with proper house cards

#### 2.3 Individual House Pages ✅

Create dynamic house pages with data from both systems:

1. ✅ Implement dynamic routes for houses using Sanity slugs
2. ✅ Display house details, amenities, and images from Sanity
3. ✅ Show room availability and pricing from Supabase
4. ✅ Load upcoming events specific to the house

```typescript
// src/app/houses/[slug]/page.tsx
export async function generateStaticParams() {
  const houses = await sanityClient.fetch(`
    *[_type == "house" && defined(slug.current)][].slug.current
  `);
  
  return houses.map((slug: string) => ({ slug }));
}

export default async function HousePage({ params }: { params: { slug: string } }) {
  // 1. Get house content from Sanity
  const house = await sanityClient.fetch(`
    *[_type == "house" && slug.current == $slug][0]{
      _id,
      name,
      description,
      location,
      amenities[]->,
      mainImage,
      gallery,
      // Add other fields needed
    }
  `, { slug: params.slug });
  
  // 2. Get operational data from Supabase
  const { data: rooms } = await supabaseClient
    .from('rooms')
    .select('*')
    .eq('sanity_house_id', house._id);
    
  // 3. Get upcoming events for this house
  const { data: events } = await supabaseClient
    .from('internal_events')
    .select('*')
    .eq('sanity_house_id', house._id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(3);
    
  return (
    <PublicLayout>
      <HouseHero house={house} />
      <HouseDetails house={house} />
      <RoomsAvailability rooms={rooms || []} />
      <HouseEvents events={events || []} />
      {/* Other house page sections */}
    </PublicLayout>
  );
}
```

#### 2.4 Application Flow ✅

Integrate application form with Supabase:

1. ✅ Create form validation with react-hook-form and Zod
2. ✅ Implement multi-step application process
3. ✅ Store application data in Supabase
4. ✅ Add success and confirmation states with thank-you page
5. ✅ Create API route for handling form submissions

```typescript
// Implementation highlights:

// 1. ApplicationData type for Supabase integration
export type ApplicationData = {
  user_id?: string; // May be null for non-authenticated users
  sanity_house_id: string;
  preferred_move_in: string;
  preferred_duration: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'interview' | 'approved' | 'rejected' | 'waitlisted';
  responses: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dob: string;
    };
    // Other response fields...
  };
};

// 2. Form submission function
export async function submitApplication(applicationData: ApplicationData) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select();
  
  if (error) {
    throw new Error(`Failed to submit application: ${error.message}`);
  }
  
  return data?.[0];
}

// 3. API route for server-side processing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    // ...
    
    // Submit application to Supabase
    const application = await submitApplication(applicationData);
    
    // Redirect to thank you page
    return NextResponse.redirect(new URL('/apply/thank-you', request.url));
  } catch (error) {
    // Handle errors
  }
}
```

### Phase 3: Resident Dashboard Integration (Week 2-3) [In Progress]

#### 3.1 Authentication Layer ✅

Complete authenticated routing with Supabase:

1. ✅ Create auth middleware
2. ✅ Implement client-side auth hooks through useAuth
3. ✅ Set up server-side authentication functions
4. ✅ Handle redirect to appropriate dashboard based on user role

```typescript
// Example of server-side authentication function
export async function requireAuth(redirectTo = '/login') {
  const { data: { session } } = await getSession();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session.user;
}

// Example of client-side auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Set user if already authenticated
    setLoading(true);
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
```

#### 3.2 Resident Home Dashboard [In Progress]

Implement resident dashboard home with real data:

1. ✅ Create dashboard layout with sidebar navigation
2. ✅ Implement house-specific dashboard landing page
3. ✅ Display announcements from Supabase
4. ✅ Show upcoming events for the house
5. 🔄 Show maintenance requests for the user
6. 🔄 Implement notifications system

```typescript
// src/app/dashboard/[houseId]/page.tsx
export default async function ResidentDashboard({ 
  params 
}: { 
  params: { houseId: string } 
}) {
  const { houseId } = params;
  
  // Get user profile with Sanity data
  const userProfile = await getUserProfile(userId);
  
  // Get house data from Sanity
  const house = await getHouse(houseId);
  
  // Get announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('sanity_house_id', houseId)
    .order('created_at', { ascending: false });
    
  // Get upcoming events
  const { data: events } = await supabase
    .from('internal_events')
    .select('*')
    .eq('sanity_house_id', houseId)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });
    
  return (
    <DashboardLayout house={house}>
      <WelcomePanel user={userProfile} house={house} />
      <AnnouncementsPanel announcements={announcements || []} />
      <UpcomingEventsPanel events={events || []} />
      <QuickLinks house={house} />
    </DashboardLayout>
  );
}
```

#### 3.3 Community Hub [Not Started]

Implement community features with Sanity profiles and Supabase relationships:

1. Display resident directory with Sanity profiles
2. Show skills and interests from Sanity
3. Implement filtering and search capabilities

#### 3.4 Resource Booking System

Create resource booking system with Supabase real-time capabilities:

1. List available resources from Sanity
2. Show calendar with existing bookings from Supabase
3. Implement booking creation with conflict prevention
4. Add real-time updates using Supabase subscriptions

```typescript
// src/app/dashboard/[houseId]/resources/page.tsx
export default async function ResourceBookingPage({ 
  params 
}: { 
  params: { houseId: string } 
}) {
  const { houseId } = params;
  
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
  
  // Initial bookings rendered server-side
  // (Client component will subscribe to real-time updates)
  const { data: bookings } = await supabase
    .from('resource_bookings')
    .select('*')
    .eq('sanity_house_id', houseId)
    .gte('end_time', new Date().toISOString())
    .order('start_time', { ascending: true });
    
  return (
    <DashboardLayout>
      <ResourcesHeader />
      <ResourcesList resources={resources} initialBookings={bookings || []} />
    </DashboardLayout>
  );
}
```

### Phase 4: Admin Dashboard Integration (Week 3-4)

#### 4.1 Residents Management

Implement resident management with data from both systems:

1. List all residents with Sanity profiles and Supabase status
2. Handle check-in/check-out processes with Supabase
3. View application pipeline with reviews
4. Manage room assignments

#### 4.2 Maintenance Management

Create maintenance request system:

1. Display all maintenance requests from Supabase
2. Implement status updates and assignment
3. Add filtering and categorization
4. Create reporting tools

#### 4.3 House Analytics

Implement analytics dashboard with real data:

1. Calculate occupancy rates from Supabase records
2. Show event participation metrics
3. Create visualizations for key metrics
4. Implement date range filtering

```typescript
// src/app/admin/[houseId]/analytics/page.tsx
export default async function HouseAnalyticsPage({ 
  params 
}: { 
  params: { houseId: string } 
}) {
  const { houseId } = params;
  
  // Get house info
  const house = await sanityClient.fetch(`
    *[_type == "house" && _id == $houseId][0]{ name }
  `, { houseId });
  
  // Get room count and occupancy
  const { data: rooms, count: roomCount } = await supabase
    .from('rooms')
    .select('*', { count: 'exact' })
    .eq('sanity_house_id', houseId);
    
  const { count: occupiedCount } = await supabase
    .from('rooms')
    .select('*', { count: 'exact' })
    .eq('sanity_house_id', houseId)
    .eq('status', 'occupied');
    
  // Get event metrics for past month
  const pastMonth = new Date();
  pastMonth.setMonth(pastMonth.getMonth() - 1);
  
  const { data: eventMetrics } = await supabase
    .from('internal_events')
    .select(`
      id,
      title,
      start_time,
      event_participants(count)
    `)
    .eq('sanity_house_id', houseId)
    .gte('start_time', pastMonth.toISOString())
    .lte('start_time', new Date().toISOString());
  
  // Calculate metrics
  const occupancyRate = roomCount ? (occupiedCount / roomCount) * 100 : 0;
  
  return (
    <AdminLayout house={house}>
      <MetricsOverview 
        occupancyRate={occupancyRate} 
        roomCount={roomCount || 0} 
        occupiedCount={occupiedCount || 0} 
      />
      <EventParticipationChart events={eventMetrics || []} />
      {/* Other analytics components */}
    </AdminLayout>
  );
}
```

### Phase 5: Super-Admin Integration (Week 4)

#### 5.1 Multi-House Overview

Create organization-wide dashboard with aggregated data:

1. List all houses with key metrics
2. Show alerts for important issues
3. Provide executive-level KPIs

#### 5.2 Cross-House Analytics

Implement organization-wide analytics:

1. Compare performance across houses
2. Create charts for key growth metrics
3. Show resident satisfaction data

## Implementation Strategies

### 1. Content Type Migration Strategy

For each page and component, follow this process:

1. **Identify Content Requirements**
   - Map out what content is needed for each component
   - Determine which data comes from Sanity vs Supabase

2. **Create Query Functions**
   - Build reusable functions for common queries
   - Use type definitions to ensure type safety

3. **Implement Server Components First**
   - Leverage React Server Components for data fetching
   - Move interactive elements to Client Components

4. **Add Client Interactivity**
   - Enhance with client-side features where needed
   - Use React's `use client` directive appropriately

### 2. Testing Approach

For each integration point, implement:

1. **Isolated Component Testing**
   - Test components with mock data first
   - Verify rendering with different data scenarios

2. **Integration Testing**
   - Test API endpoints with actual Sanity/Supabase
   - Verify data flows correctly between systems

3. **User Flow Testing**
   - Test complete user journeys through the application
   - Verify authentication and authorization

### 3. Sanity-Supabase Synchronization

To handle changes between systems:

1. **Change Detection**
   - Use Sanity webhooks to trigger updates when content changes
   - Update related Supabase records when necessary

2. **Data Consistency**
   - Implement checks to ensure references remain valid
   - Handle missing data gracefully with fallbacks

## Component Conversion Priorities

| Component | Priority | Complexity | Dependencies |
|-----------|----------|------------|--------------|
| Homepage | High | Medium | Sanity MainPage schema |
| House Detail Pages | High | High | Sanity House schema, Supabase rooms |
| Application Form | High | Medium | Supabase applications table |
| Authentication | High | Medium | Supabase auth, accelr8_users table |
| Resident Dashboard | High | High | Supabase user data, Sanity profiles |
| Resource Booking | Medium | High | Sanity resources, Supabase bookings |
| Maintenance Requests | Medium | Medium | Supabase maintenance_requests |
| Admin Analytics | Medium | High | Multiple Supabase tables |
| Resident Directory | Low | Medium | Sanity person profiles |
| Super Admin Dashboard | Low | High | Cross-house data aggregation |

## Conclusion

This implementation plan provides a structured approach to transitioning from skeleton UI to a fully functional application using Sanity CMS and Supabase. By following the phases outlined above, the project can systematically replace placeholder content with real data while maintaining a cohesive user experience.

The implementation prioritizes the most visible and valuable features first, ensuring that users can begin experiencing the benefits of real content as quickly as possible. This approach also helps identify and resolve integration challenges early in the development process. 