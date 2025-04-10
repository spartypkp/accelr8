# Accelr8 Website and Dashboard System

## Project Overview

### About Accelr8
Accelr8 is a network of co-living houses for tech founders and builders, primarily focused on AI and Web3. The organization provides housing and community to foster innovation, collaboration, and startup growth.

- **Mission**: Create living spaces that accelerate innovation through community.
- **Current State**: Operating in San Francisco with one house in Nob Hill.
- **Future Vision**: Expand to multiple houses in San Francisco and eventually create a global network.

### Project Goals
This project is developing a comprehensive website and dashboard system for Accelr8 that will:

1. **Create a unified platform** for marketing, application processing, and resident management
2. **Support operational scaling** from a single house to multiple locations
3. **Enhance resident experience** through community and house-specific tools
4. **Empower administrators** with effective house management tools
5. **Enable executive oversight** across the organization's properties

## System Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS, ShadCN UI components
- **Backend/Database**:
  - **Supabase**: Authentication, operational data, PostgreSQL database
  - **Sanity CMS**: Content management for marketing and profile content
- **Hosting**: Vercel

### Dual Database Architecture
The system implements a unique dual-database architecture to leverage the strengths of both Sanity CMS and Supabase:

#### Content vs. Operations Split
- **Sanity CMS**: Manages all public-facing content, including:
  - House profiles, amenities, and photos
  - Person profiles and team information
  - Public events and media content
  - Blog posts and marketing materials

- **Supabase**: Handles all operational and transactional data:
  - User authentication and authorization
  - House operations (WiFi, access codes, occupancy)
  - Room bookings and assignments
  - Applications and resident management
  - Internal events and maintenance requests

#### Data Integration Strategy
- **Type Extension Pattern**: TypeScript interfaces extend base types from each source
- **Cross-Database References**: Consistent ID linking between systems
- **Normalized Properties**: Consistent naming conventions across systems

## User Roles and Authorization

The system implements a comprehensive role-based access control system:

### User Roles

#### 1. Applicant
- **Access Level**: Limited
- **Capabilities**:
  - View and manage their application(s)
  - Update personal profile information
  - Access dashboard with application status tracking
  - Configure account settings

#### 2. Resident
- **Access Level**: House-specific
- **Capabilities**:
  - Everything an applicant can do
  - View houses they're a resident of
  - Access resident-specific house features
  - Interact with house community
  - View events and resources
  - Submit maintenance requests
  - Access billing information

#### 3. Admin (House Manager)
- **Access Level**: House-specific management
- **Capabilities**:
  - Everything a resident can do
  - Manage assigned houses
  - View resident information and occupancy
  - Organize house events
  - Process maintenance requests
  - Access house analytics and reports
  - Handle house-specific applications

#### 4. Super Admin
- **Access Level**: Organization-wide
- **Capabilities**:
  - Access to all houses and features
  - Organization-wide analytics
  - User role management
  - System configuration
  - House setup and initialization

### Authorization Implementation

The authorization system is implemented through multiple layers:

1. **Middleware (Route Protection)**
   - All dashboard routes require authentication
   - Role-specific routes are protected based on user role
   - House-specific access is verified against database records

2. **Database-Level Security**
   - Row-level security in Supabase restricts data access
   - Table policies enforce user-specific data access

3. **UI Conditional Rendering**
   - Navigation options only show relevant items per role
   - Components adapt based on user permissions

## Application Structure

### Routing Architecture

The application uses Next.js App Router with a clear routing structure:

```
/ - Public homepage
/story - About Accelr8 and mission
/houses - Public houses listing
/houses/[houseId] - Public house detail page
/apply - Application form
/events - Public events
/login, /register, /forgot-password - Auth pages

/dashboard - Main dashboard and house selection
/dashboard/profile - User profile management
/dashboard/settings - User account settings
/dashboard/applications - Application status (for applicants)

/dashboard/[houseId]/resident - House resident view
/dashboard/[houseId]/resident/* - Resident sub-pages

/dashboard/[houseId]/admin - House admin dashboard 
/dashboard/[houseId]/admin/* - Admin sub-pages

/dashboard/superAdmin - Organization administration
/dashboard/superAdmin/* - Super admin sub-pages
```

### Key Dashboard Components

The dashboard interface is built with a consistent structure:

1. **Shell**: The outer container with navigation
2. **Sidebar**: Role-specific navigation menu
3. **Main Content**: Dynamic page content

### Dashboard Navigation

Navigation is dynamically generated based on:
1. User's role
2. Access to specific houses
3. Current context (admin vs. resident view)

## Implementations Complete

### Core System
- ✅ User authentication with Supabase
- ✅ Role-based middleware with house-specific access control
- ✅ Dashboard shell with responsive sidebar
- ✅ User profile and settings pages
- ✅ Dynamic navigation based on role

### Public Site
- ✅ Homepage with core marketing content
- ✅ Application form with multi-step process
- ✅ House details page with amenities, photos, and information
- ✅ Responsive layout for all device sizes

### Dashboard Features
- ✅ Main dashboard with role-specific content
- ✅ User profile management
- ✅ Settings panel with security options
- ✅ House selection for users with multiple houses
- ✅ Application tracking for applicants

## Features in Progress

### Resident Dashboard
- 🔄 Community directory and connections
- 🔄 House events calendar and RSVP
- 🔄 Maintenance request system
- 🔄 Resource booking

### Admin Dashboard
- 🔄 House analytics dashboard
- 🔄 Resident management tools
- 🔄 Application review pipeline
- 🔄 Operations management

### Super Admin Features
- 🔄 Organization overview
- 🔄 Cross-house analytics
- 🔄 User and role management

## User Flows

### Applicant Experience
1. Visits public website and views houses
2. Submits application through multi-step form
3. Creates account and accesses applicant dashboard
4. Tracks application status and updates profile
5. If accepted, transitions to resident role

### Resident Experience
1. Logs in and sees house selection (if multiple)
2. Accesses house-specific resident dashboard
3. Views community members and upcoming events
4. Submits maintenance requests as needed
5. Manages profile and account settings

### Admin Experience
1. Logs in and sees admin-accessible houses
2. Views house dashboards with critical metrics
3. Manages residents and operations
4. Reviews applications and coordinates events
5. Accesses analytics for decision-making

## Database Schemas

### Key Supabase Tables

1. **accelr8_users**
   - Extends auth.users with profile data
   - Stores emergency contacts and phone numbers
   - Tracks onboarding status and last activity

2. **house_operations**
   - Links to Sanity house content via ID
   - Stores operational status and occupancy
   - Contains sensitive information (WiFi, access codes)
   - Holds maintenance and contact information

3. **rooms**
   - Tracks individual rooms in houses
   - Links to room types in Sanity
   - Manages availability and current residents
   - Stores pricing and lease information

4. **applications**
   - Handles prospective resident applications
   - Tracks application status with comprehensive stages
   - Stores applicant preferences and information
   - Links to houses and assigned rooms

### Key Sanity Schemas

1. **House**
   - Public house information and marketing content
   - Location data and amenities
   - Photo galleries and descriptions

2. **Person**
   - Public profiles for residents and team
   - Profile photos and biographies
   - Skills and background information

3. **Event**
   - Public events and programming
   - Event dates, descriptions, and images
   - House affiliations

## Implementation Strategy

### Phase 1: Foundation (Completed)
- ✅ Setup Next.js with App Router
- ✅ Configure Supabase and authentication
- ✅ Create UI component system with ShadCN
- ✅ Implement role-based middleware
- ✅ Build basic dashboard structure

### Phase 2: Core Functionality (In Progress)
- ✅ Build house details pages
- ✅ Create profile and settings pages
- 🔄 Implement house-specific dashboards
- 🔄 Develop application management system

### Phase 3: Advanced Features (Upcoming)
- Community and communication tools
- Event management system
- Resource booking and maintenance
- Analytics and reporting

### Phase 4: Polish and Launch
- Comprehensive testing
- Performance optimization
- Content finalization
- Deployment pipeline

## Middleware Architecture

The authorization system is implemented through Next.js middleware which:

1. **Intercepts Routes**: Checks all requests to protected routes
2. **Verifies Authentication**: Ensures users are logged in
3. **Checks Permissions**: Validates role-based access
4. **Verifies House Access**: For house-specific routes, confirms the user has access to that house
5. **Handles Redirects**: Sends unauthenticated users to login

### Key Middleware Logic:

```typescript
// Role hierarchy for permission checks
const roleHierarchy: Record<UserRole, number> = {
  applicant: 0,
  resident: 1,
  admin: 2,
  super_admin: 3
};

// Check route permissions
if (isMainDashboard || isProfileRoute || isApplicationRoute) {
  // All authenticated users can access these routes
  return response;
}

// Super admin routes require super_admin role
if (isSuperAdminRoute) {
  if (userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return response;
}

// Check house-specific access and permissions
// ...house access verification logic
```

## Technical Challenges and Solutions

### Cross-Database Integration
**Challenge**: Maintaining consistency between Sanity and Supabase data.
**Solution**: Implemented type extension pattern with strict TypeScript interfaces.

### House-Specific Authorization
**Challenge**: Creating a flexible system for house-specific access.
**Solution**: Database tables track user-house relationships with middleware verification.

### Dynamic Navigation
**Challenge**: Building navigation that adapts to user roles and permissions.
**Solution**: Context-aware sidebar that renders different items based on role and route.

### Performance Optimization
**Challenge**: Managing data fetching from dual sources without excessive requests.
**Solution**: Parallel fetching, data composition, and client-side caching strategies.

## Future Roadmap

### Near-Term (1-3 months)
- Complete resident dashboard features
- Deploy admin tools for house management
- Integrate messaging and community features

### Medium-Term (3-6 months)
- Develop advanced analytics and reporting
- Create house setup automation for new properties
- Implement billing integration

### Long-Term (6+ months)
- Build cross-house community features
- Develop mobile application
- Implement global search and discovery

## Development Guidelines

### Code Style
- Follow Next.js and React best practices
- Use TypeScript for all components and functions
- Implement proper error handling and loading states

### Component Structure
- Create reusable UI components in `/components`
- Develop feature-specific components in domain folders
- Use proper TypeScript interfaces for all props

### Data Fetching
- Use React Server Components where appropriate
- Implement client-side data fetching for interactive elements
- Handle loading and error states consistently

### API Development
- Create separate API routes for data operations
- Implement proper authentication and validation
- Use server actions for form submissions

