# Accelr8 Dashboard Overhaul Plan

## Current State Analysis

The current dashboard implementation has several architectural issues:

1. **Duplicate Layout Components**: We have both Next.js built-in layouts and custom layout components
2. **Redundant Auth Logic**: Auth checks are performed in middleware, layout components, and individual pages
3. **Complex Component Hierarchy**: Overly deep component nesting with specialized components
4. **Multiple Navigation Patterns**: Different navigation for different user roles
5. **Inconsistent Auth Strategy**: Mix of old permission-based and new role-based approaches

## Implementation Progress (Updated)

### Completed Items ✅

1. **Auth & Middleware Improvements**
   - ✅ Enhanced middleware in `src/lib/supabase/middleware.ts` to handle dashboard redirects
   - ✅ Implemented role-based redirects for the `/dashboard` root path

2. **Layout Simplification**
   - ✅ Simplified dashboard layout in `src/app/dashboard/layout.tsx`
   - ✅ Removed redundant auth logic from layouts
   - ✅ Created basic loading state for dashboard page in `src/app/dashboard/page.tsx`

3. **Component System**
   - ✅ Created enhanced `DashboardCard` component with loading and error states
   - ✅ Developed `DashboardPanel` component for card organization
   - ✅ Implemented modular card components:
     - ✅ `EventsCard` for upcoming events
     - ✅ `EventDetailsCard` for detailed event information
     - ✅ `MaintenanceCard` for maintenance requests
     - ✅ `AnnouncementsCard` for house announcements
     - ✅ `QuickLinksCard` for dashboard navigation
     - ✅ `ResidentCard` for individual resident profiles
     - ✅ `ResidentsListCard` for community directory
     - ✅ `ResourcesCard` for viewing room and equipment resources
     - ✅ `MaintenanceRequestForm` for submitting maintenance requests
     - ✅ `BillingInfoCard` for payment and billing information

4. **Page Refactoring**
   - ✅ Refactored house dashboard page to use new component system
   - ✅ Refactored community page with modular components 
   - ✅ Refactored resources page with modular components
   - ✅ Refactored billing page with modular components
   - ✅ Refactored events page with modular components

### Files Created/Modified ✅

- ✅ Enhanced: `src/lib/supabase/middleware.ts`
- ✅ Simplified: `src/app/dashboard/layout.tsx`
- ✅ Simplified: `src/app/dashboard/page.tsx`
- ✅ Created: `src/components/dashboard/panels/DashboardPanel.tsx`
- ✅ Enhanced: `src/components/dashboard/cards/dashboard-card.tsx`
- ✅ Created: `src/components/dashboard/cards/EventsCard.tsx`
- ✅ Created: `src/components/dashboard/cards/EventDetailsCard.tsx`
- ✅ Created: `src/components/dashboard/cards/MaintenanceCard.tsx`
- ✅ Created: `src/components/dashboard/cards/AnnouncementsCard.tsx`
- ✅ Created: `src/components/dashboard/cards/QuickLinksCard.tsx`
- ✅ Created: `src/components/dashboard/cards/ResidentCard.tsx`
- ✅ Created: `src/components/dashboard/cards/ResidentsListCard.tsx`
- ✅ Created: `src/components/dashboard/cards/ResourcesCard.tsx`
- ✅ Created: `src/components/dashboard/cards/MaintenanceRequestForm.tsx`
- ✅ Created: `src/components/dashboard/cards/BillingInfoCard.tsx`
- ✅ Refactored: `src/app/dashboard/[houseId]/page.tsx`
- ✅ Refactored: `src/app/dashboard/[houseId]/community/page.tsx`
- ✅ Refactored: `src/app/dashboard/[houseId]/resources/page.tsx`
- ✅ Refactored: `src/app/dashboard/[houseId]/billing/page.tsx`
- ✅ Refactored: `src/app/dashboard/[houseId]/events/page.tsx`

### In Progress

1. **Continue Feature-Specific Card Development**
   - Create maintenance management cards
   - Implement info and help cards

2. **Further Page Refactoring**
   - Refactor remaining dashboard sub-pages (maintenance, info)
   - Apply consistent layout pattern to all pages

3. **Admin Dashboard**
   - Update admin dashboard pages
   - Create admin-specific cards for management features

## High-Level User Experience

### Dashboard Flow for Residents

1. **Authentication**:
   - User logs in with their credentials
   - Auth middleware validates the user has the minimum 'resident' role
   - Middleware checks if user has active residency in a house

2. **Dashboard Landing**:
   - User is automatically redirected to their house dashboard (`/dashboard/[houseId]`)
   - If a resident isn't assigned to any house, redirect to houses overview with a prompt

3. **House Dashboard Experience**:
   - View house-specific announcements, events, and community stats
   - Access house resources (booking meeting rooms, etc.)
   - View maintenance requests and house information
   - Access personal billing information

4. **Navigation**:
   - Consistent sidebar navigation between different house features
   - Mobile-friendly navigation that collapses to a hamburger menu

### Dashboard Flow for Admins

1. **Authentication**:
   - Admin logs in with their credentials
   - Auth middleware validates the user has 'admin' or 'super_admin' role
   - Middleware checks which houses the admin manages (for house-specific admins)

2. **Dashboard Landing**:
   - House admins are redirected to their house admin dashboard (`/admin/[houseId]`)
   - Super admins are redirected to the global admin dashboard (`/admin`)

3. **House Admin Experience**:
   - Manage house residents (view, add, remove)
   - Manage house operations (maintenance, announcements)
   - View house analytics and financial data
   - Manage house events and resources

4. **Super Admin Experience**:
   - Global overview of all houses
   - Company-wide analytics and metrics
   - Ability to navigate to any house admin dashboard
   - Expansion management tools

## Detailed Implementation Plan

### 1. File Structure Cleanup

#### Files to Keep & Update
- ✅ **`src/app/dashboard/page.tsx`**: Simplify to a basic redirect handler
- ✅ **`src/app/dashboard/[houseId]/page.tsx`**: Update to use server components for data fetching
- **`src/components/dashboard/dashboard-shell.tsx`**: Keep as main layout wrapper
- **`src/components/dashboard/sidebar.tsx`**: Retain with minor updates for consistency
- **`src/components/dashboard/navbar.tsx`**: Keep with improvements for notifications
- **`src/components/dashboard/mobile-sidebar.tsx`**: Keep for responsive design
- **`src/components/dashboard/types.ts`**: Expand to include more shared types

#### Files to Consolidate
- ✅ **`src/app/dashboard/layout.tsx`** and **`src/components/dashboard/layout.tsx`**: Consolidate into a single App Router layout
- **`src/components/dashboard/screens/*.tsx`**: Consolidate into modular dashboard cards/panels

#### Files to Remove
- **`src/components/dashboard/layout.tsx`**: Remove and replace with App Router layouts
- **`src/components/auth/auth-guard.tsx`**: Remove and handle auth in middleware
- Various specialized dashboard screens that create excessive nesting

#### New Files to Create
- ✅ Enhanced middleware for role-based auth and redirects
- ✅ **`src/components/dashboard/cards/*.tsx`**: New modular card components
- ✅ **`src/components/dashboard/panels/*.tsx`**: Panel components for organizing cards

### 2. Auth & Middleware Strategy

1. **Create a Unified Middleware**: ✅
```typescript
// src/middleware.ts (Enhanced with proper user role redirection)
export function middleware(request: NextRequest) {
  // Base dashboard route needs to redirect based on role
  if (path === '/dashboard') {
    const userRole = user.user_metadata?.role || 'resident';

    // For residents, redirect to their house dashboard
    if (userRole === 'resident') {
      try {
        // Get user's active residency
        const { data: residency } = await supabase
          .from('residencies')
          .select('sanity_house_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (residency?.sanity_house_id) {
          url.pathname = `/dashboard/${residency.sanity_house_id}`;
        } else {
          // Resident without active house - redirect to houses page
          url.pathname = '/houses';
          url.searchParams.set('status', 'no_active_house');
        }
        return NextResponse.redirect(url);
      } catch (error) {
        console.error('Error fetching residency:', error);
      }
    }

    // For admins and super_admins, redirect to admin dashboard
    else if (['admin', 'super_admin'].includes(userRole)) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }
}
```

2. **Remove Auth Logic from Components**: ✅
   - Removed `AuthGuard` usage in house dashboard page
   - Removed duplicate auth checks in layout components

### 3. Component Architecture

1. **Simplified Layout Structure**: ✅
```tsx
// src/app/dashboard/layout.tsx
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user from server
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Auth checks are now performed in middleware 
  if (!user) {
    return null; // Will never render - middleware will redirect
  }

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name,
        role: user.user_metadata?.role || "resident",
        profile: user.user_metadata?.profile
      }}
    >
      {children}
    </DashboardShell>
  );
}
```

2. **Modular Dashboard Card System**: ✅
   - Created standardized card components with loading and error states
   - Implemented SWR data fetching in card components
   - Made cards composable with DashboardPanel

### 4. Data Fetching Strategy

1. **Server Components for Initial Data**: ✅
   - Using React Server Components for initial house data
   - Moved announcement data fetching to the server component

2. **Client-Side Updates with SWR**: ✅
   - Implemented SWR pattern for events and maintenance data
   - Created custom fetcher functions for data cards:
```tsx
// Example from EventsCard.tsx
const fetcher = async (url: string) => {
  const supabase = createClient();
  const [_, houseId, limit] = url.split('/').slice(-3);
  
  const { data, error } = await supabase
    .from("internal_events")
    .select("*")
    .eq("sanity_house_id", houseId)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(parseInt(limit));
    
  if (error) throw error;
  return data;
};
```

## Next Steps

1. **Complete Card Components for All Features**
   - Develop MaintenanceStatusCard for tracking maintenance issues
   - Implement HouseInfoCard for displaying house information

2. **Refactor Remaining Pages**
   - Convert Maintenance page to card-based layout
   - Implement Info page with card components

3. **Enhance Navigation**
   - Update sidebar to highlight current section better
   - Improve mobile navigation experience
   - Add breadcrumbs for deeper pages

4. **Admin Dashboard**
   - Apply the card system to admin dashboard pages
   - Create admin-specific card components for management
   - Implement resident management interface

5. **Delete Obsolete Files**
   - Remove old dashboard-layout.tsx once all pages are migrated
   - Delete AuthGuard component after confirming middleware handles all cases
   - Remove specialized screen components that have been replaced

## Summary 

This dashboard overhaul simplifies the architecture by:

1. Moving auth logic to middleware for centralized control
2. Replacing duplicate layouts with App Router's nested layouts
3. Creating a modular card system for flexible dashboards
4. Implementing efficient data fetching with server components and SWR
5. Establishing a consistent navigation experience across user roles

The implementation is progressing well with substantial improvements to the dashboard architecture. We've successfully created core layout components, several key card components, and refactored multiple pages. The modular approach is proving effective, making the dashboard more maintainable, easier to extend, and providing a better user experience. We've now completed refactoring 5 out of 6 key dashboard pages, with only maintenance and info pages remaining. 