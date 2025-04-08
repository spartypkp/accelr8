# Dashboard Refactor Implementation Plan

## Executive Summary

This document outlines the implementation plan for refactoring the Accelr8 dashboard to create a centralized, multi-purpose hub that serves all user types. The key change is moving from the current automatic redirect model to a comprehensive dashboard that displays relevant information based on user role, with a new role specifically for applicants.

## 1. New Role Structure

### Current Roles
- `resident`: Users who live in a house
- `admin`: House administrators
- `super_admin`: Organization-level administrators

### New Role Structure
- `applicant`: Users who have applied but aren't residents yet
- `resident`: Users who live in a house
- `admin`: House administrators
- `super_admin`: Organization-level administrators

### Role Hierarchy
```typescript
const roleHierarchy = { 
  applicant: 0,
  resident: 1, 
  admin: 2, 
  super_admin: 3 
};
```

## 2. Authentication & Type Changes

### TypeScript Type Updates




1. Update API query options:
```typescript
export interface UserQueryOptions {
  role?: UserRole;
  // other fields...
}
```

### Default Role Change


1. Update registration flow to reflect the new default role






## 3. Central Dashboard Implementation

### Dashboard Structure

The new dashboard will be organized into tabs:

1. **Overview** - Role-specific quick information
2. **Houses** - Houses the user has access to 
3. **Applications** - For applicants and admins
4. **Profile & Settings** - User account management

### Component Architecture

```
dashboard/
├── page.tsx                  # Main dashboard entry point
├── components/
│   ├── WelcomeCard.tsx       # Personalized welcome
│   ├── DashboardTabs.tsx     # Main tab container
│   ├── houses/
│   │   ├── HousesGrid.tsx    # Grid view of accessible houses
│   │   └── HouseCard.tsx     # Individual house card
│   ├── applications/
│   │   ├── ApplicationsList.tsx  # List of applications
│   │   └── ApplicationCard.tsx   # Individual application
│   ├── profile/
│   │   ├── ProfileForm.tsx   # User profile edit form
│   │   └── SecuritySettings.tsx  # Password/security
│   └── admin/
│       └── AdminOverview.tsx  # Admin-specific metrics
└── hooks/
    └── useDashboardData.tsx  # Custom hook for fetching data
```

### User Experience by Role

1. **Applicant**
   - See application status
   - Track interview scheduling
   - Upload documents
   - Update profile information
   - Browse houses (read-only)

2. **Resident**
   - View their house(s)
   - Access resident dashboard for each house
   - View upcoming events
   - Manage profile
   - View/pay bills

3. **Admin**
   - View houses they administrate
   - Access both resident and admin views for their houses
   - View application pipeline
   - See house metrics

4. **Super Admin**
   - View all houses in the system
   - Access all dashboards
   - View organization-wide metrics
   - Manage global settings

## 4. API & Data Access Changes

### New API Endpoints

1. `/api/applications/user` - Get applications for the current user
2. `/api/users/profile` (Update) - Enhanced profile management

### Data Access Patterns

See all 'lib/api' files.

## 5. Implementation Phases

### Phase 1: Authentication & Type Updates (1-2 days)
- Update UserRole type and interfaces
- Change default role for new users to 'applicant'
- Update role checking logic
- Add helper functions for role checks

### Phase 2: Central Dashboard Structure (2-3 days)
- Create main dashboard layout with tabs
- Implement role-specific dashboard components
- Build houses grid view
- Create conditional navigation

### Phase 3: Application Management (2-3 days)
- Build application listing and detail views
- Create application status tracking UI
- Implement interview scheduling interface
- Add document upload for applicants

### Phase 4: Profile & Settings (1-2 days)
- Implement profile editing form
- Create account settings interface
- Build notification preferences
- Add password change functionality

### Phase 5: Testing & Refinement (2-3 days)
- Test all user flows for each role
- Ensure correct access controls
- Optimize performance
- Polish UI for consistency

## 6. Migration Strategy

### Data Migration
- No schema changes needed for existing tables
- Update existing users with appropriate roles (if needed)

### User Experience Migration
- Notify users of new dashboard experience
- Consider a temporary "classic view" link
- Add helpful hints/tooltips for the new interface

### Routing Migration
- Preserve existing house-specific dashboard routes
- Add new central dashboard routes
- Update navigation components

## 7. Technical Considerations

### State Management
- Use React Context for sharing data between dashboard components
- Consider SWR for data fetching with stale-while-revalidate pattern

### Performance Optimization
- Implement virtualized lists for large data sets
- Use incremental loading for houses and applications
- Optimize image loading with next/image

### Mobile Responsiveness
- Ensure dashboard adapts to mobile views
- Create mobile-specific navigation pattern
- Test on various device sizes

## 8. Future Considerations

Once the central dashboard is implemented, we can explore:

1. Notification Center
   - Real-time notifications for application updates
   - House event notifications
   - System announcements

2. Dashboard Customization
   - Allow users to customize their dashboard layout
   - Pin favorite sections

3. Analytics Integration
   - User engagement metrics
   - Application conversion tracking
   - House occupancy analytics

4. API Expansion
   - GraphQL API for more efficient data fetching
   - Webhooks for external integrations 