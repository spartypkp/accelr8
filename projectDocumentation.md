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
- ✅ Main Admin Dashboard page
- ✅ House-specific Admin Dashboard
- ✅ Residents Management interface
- ✅ Events Management system
- ✅ Operations Management (maintenance tracking)
- ✅ Analytics Dashboard with performance metrics
- ✅ Financial Management tools
- ✅ Communication tools (announcements and messaging)

### Public Site (In Progress)
- ✅ Homepage with hero section and feature overview
- ✅ Apply page with multi-step application form
- ✅ Blog/resources section structure
- ✅ Events page framework

### Not Started
- Resident dashboard and features
- Authentication system implementation
- Super-admin dashboard for company executives
- Content integration - final content, images, and copy

### Next Steps
1. Begin implementing the resident dashboard and features
2. Develop community and social features
3. Implement the super-admin dashboard
4. Set up authentication and authorization
5. Integrate with backend APIs
6. Testing and QA
7. Deployment

## Technology Stack

- **Frontend**: NextJS (App Router), React, TailwindCSS, ShadCN components
- **Backend/Database**: 
  - **Supabase**: PostgreSQL database and authentication
  - **Sanity CMS**: Content management for marketing and public-facing content
- **Hosting**: Vercel

## Data Architecture: Sanity CMS & Supabase Integration

We've implemented a dual-database architecture that leverages the strengths of both Sanity CMS and Supabase. This design clearly separates content from application data while maintaining seamless integration between the two systems.

### Architecture Overview

#### Sanity CMS: Content Management
Sanity handles all **public-facing, editable content** that benefits from an editorial workflow:

- Marketing content (homepage, about page, etc.)
- Rich media assets (images, videos)
- Blog posts and resources
- House information and amenities
- Team and resident public profiles
- Testimonials and success stories
- Public events and programs

#### Supabase: Application Data & Operational Management
Supabase manages all **transactional, operational, and user-specific data**:

- User authentication and profiles
- Resident applications and onboarding
- Room management and assignments
- Maintenance requests
- Internal communications
- Resource bookings
- Financial transactions
- Analytics data

### How They Work Together

The two systems are integrated through:

1. **Reference IDs**: Supabase records contain Sanity document IDs to reference content
2. **Unified API Layer**: Our Next.js application queries both systems and combines results
3. **Content Caching**: Sanity content is cached using ISR (Incremental Static Regeneration)
4. **Real-time Updates**: Supabase subscriptions provide real-time data for dashboards

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

Supabase handles the operational and transactional aspects of the platform with these core tables:

### Core Tables

1. **accelr8_users**
   - Extends Supabase auth.users
   - Links to Sanity Person record
   - Role and permissions
   - Contact information
   - Emergency contacts
   - Onboarding status

2. **rooms**
   - References Sanity House ID
   - Room number and type
   - Occupancy details
   - Pricing information
   - Availability status
   - Floor and square footage

3. **residencies**
   - Links users to rooms and houses
   - Tracks occupancy periods
   - Rental terms
   - Payment tracking
   - Move-in/out information

4. **applications**
   - Prospective resident applications
   - Application status tracking
   - References to preferred houses
   - Reviewer notes
   - Interview scheduling
   - Custom form responses

5. **maintenance_requests**
   - Issue reporting
   - Status tracking
   - Severity and categorization
   - Resolution notes
   - Associated rooms and houses

6. **resource_bookings**
   - Booking system for shared resources
   - References Sanity resources
   - Scheduling information
   - User associations
   - Status tracking

7. **internal_events**
   - House-specific private events
   - Organizational gatherings
   - Meeting scheduling
   - Attendee management

8. **event_participants**
   - RSVP tracking
   - Attendance records
   - Feedback collection

9. **announcements**
   - Internal communications
   - Targeted messaging
   - Priority levels
   - Duration settings

10. **payments**
    - Financial transactions
    - Payment status tracking
    - Receipt generation
    - Payment method information

11. **activity_logs**
    - System-wide audit trail
    - User action tracking
    - Security monitoring

### Complete SQL Schema

A full SQL schema for Supabase is maintained in the repository under `scripts/schema.sql`.

## Implementation Strategy for Data Integration

### Authentication Flow

1. User authentication happens exclusively through Supabase Auth
2. After authentication, the application:
   - Fetches the user profile from Supabase
   - If applicable, fetches the corresponding public profile from Sanity
   - Combines data for a complete user context

### Content Delivery

1. **Public Website**:
   - Static content from Sanity is pre-rendered using Next.js ISR
   - Dynamic, personalized content may combine Sanity content with Supabase data
   - Media assets (images, videos) are served through Sanity's CDN

2. **Dashboards**:
   - Operational data comes from Supabase (with real-time subscriptions where needed)
   - Content references fetch enriched data from Sanity when needed
   - House information, descriptions, and media are pulled from Sanity

### API Structure

Our implementation provides several utility functions for accessing both systems:

```typescript
// Example of a unified data fetcher
async function getHouseWithResidents(houseId: string) {
  // Get house details from Sanity
  const houseDetails = await sanityClient.fetch(`
    *[_type == "house" && _id == $houseId][0]
  `, { houseId });
  
  // Get current residents from Supabase
  const { data: residents } = await supabaseClient
    .from('residencies')
    .select(`
      id,
      accelr8_users (
        id,
        email,
        sanity_person_id
      )
    `)
    .eq('sanity_house_id', houseId)
    .eq('status', 'active');
    
  // Fetch additional resident details from Sanity if needed
  const residentIds = residents.map(r => r.accelr8_users.sanity_person_id).filter(Boolean);
  const residentDetails = residentIds.length > 0 
    ? await sanityClient.fetch(`
        *[_type == "person" && _id in $ids]{ _id, name, image, bio }
      `, { ids: residentIds })
    : [];
    
  // Combine the data
  return {
    ...houseDetails,
    residents: residents.map(r => {
      const sanityProfile = residentDetails.find(p => p._id === r.accelr8_users.sanity_person_id);
      return {
        id: r.accelr8_users.id,
        email: r.accelr8_users.email,
        residencyId: r.id,
        ...sanityProfile
      };
    })
  };
}
```

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

For house administrators, additional functionality should include:

1. **Resident Management**
   - View all current residents
   - Application reviews for prospective residents
   - Check-in/check-out processing
   - Room assignments

2. **Operations Management**
   - Maintenance request tracking
   - Inventory management
   - Cleaning schedule
   - Service provider contacts

3. **Events Management**
   - Create and publish events
   - Track RSVPs and attendance
   - Resource allocation for events

4. **Analytics**
   - House occupancy rates
   - Event participation metrics
   - Resident satisfaction scores
   - Community engagement metrics

5. **Financial Overview**
   - Rent collection status
   - Outstanding payments
   - Operational expenses
   - Budget tracking

6. **Communication Tools**
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
/story                            # About Accelr8 Our story
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
/dashboard                         # User's main dashboard (redirects to house)

# House-specific resident dashboard
/dashboard/[houseId]               # House dashboard home
/dashboard/[houseId]/community     # Community features
/dashboard/[houseId]/events        # Events calendar
/dashboard/[houseId]/resources     # Resource booking
/dashboard/[houseId]/maintenance   # Maintenance requests
/dashboard/[houseId]/info          # House information
/dashboard/[houseId]/billing       # Payment information

# House admin routes
/admin/[houseId]                   # Admin dashboard for specific house
/admin/[houseId]/residents         # Resident management
/admin/[houseId]/operations        # Operations management
/admin/[houseId]/events            # Events management
/admin/[houseId]/analytics         # House analytics
/admin/[houseId]/finances          # Financial management
/admin/[houseId]/communication     # Communication tools

# Super-admin routes
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