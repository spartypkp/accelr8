# Accelr8 Authentication & Authorization Overhaul

## Overview

This document outlines the comprehensive overhaul of Accelr8's authentication and authorization system. We've redesigned the auth architecture to follow industry best practices, improve security, and ensure scalability as the application grows beyond a single house to multiple locations.

## Previous Implementation Issues

Our previous implementation had several limitations:

1. **Inconsistent Authorization Checks**: Auth checks were scattered throughout components with different implementations
2. **Limited Role Granularity**: Simple role-based access without fine-grained permission control
3. **Redundant Checks**: Both server and client components performed similar checks, creating duplication
4. **No Centralized Configuration**: Route protection was embedded in components rather than centrally defined
5. **Heavy Component Coupling**: Pages needed to understand auth details to protect themselves
6. **Inefficient Redirects**: Auth checks happened after component rendering began
7. **Resource-Level Access**: Difficult to implement permissions for specific resources (e.g., specific houses)

## New Architecture

The new authorization system follows a layered approach with several key components:

### 1. NextJS Middleware (`middleware.ts`)

The first line of defense - intercepts requests before they reach any component and performs:
- Authentication verification via Supabase session
- Route-level permission checks based on the centralized configuration
- Resource-level access checks (e.g., house-specific access)
- Appropriate redirects for unauthorized access

### 2. Permission System (`lib/auth/permissions.ts`)

A capability-based authorization model defining:
- All possible permissions as TypeScript types
- Role-based permission assignment
- Resource-specific permission checks
- Helper functions: `can()`, `hasPermission()`, `getPermissions()`

### 3. Route Configuration (`lib/auth/config.ts`)

A centralized definition of all routes with:
- Public/protected status
- Required permissions
- Resource validation requirements
- Fallback URLs for unauthorized access
- Parameter extraction for dynamic routes

### 4. Server-Side Protection (`components/auth/auth-guard.tsx`)

Server component protection with:
- `AuthGuard` component for protecting server component trees
- `requirePermission` function for server component internals
- Integration with the permission system

### 5. Client-Side Protection (`components/auth/route-guard.tsx`)

Client component protection with:
- `RouteGuard` component for protecting client components
- Integration with React hooks for state management
- Graceful loading and redirect handling

### 6. React Hooks (`lib/auth/hooks.ts`)

Enhanced React hooks for client components:
- `usePermission` to check specific permissions
- `useUserPermissions` to get all permissions for the current user
- Improved `useRequireAuth` and `useRequireAdmin` hooks

## Implementation Benefits

1. **Centralized Authorization Logic**: All auth decisions flow through a single permission system
2. **Improved Performance**: Unauthorized requests are rejected at the middleware level before component rendering
3. **Type Safety**: TypeScript ensures permission strings are used consistently throughout the application
4. **Fine-Grained Control**: Beyond roles, specific permissions can be granted for different actions
5. **Resource-Level Security**: Permissions can be checked against specific resources (e.g., houses)
6. **Consistent UI Experience**: Better handling of loading states during auth checks
7. **Scalable Permission Model**: Easy to add new permissions as application features grow
8. **Clear Separation of Concerns**: Auth logic is isolated from business logic

## Usage Examples

### Protecting Server Routes/Components

```tsx
// Using the AuthGuard component
import AuthGuard from "@/components/auth/auth-guard";

export default function AdminPage() {
  return (
    <AuthGuard requiredPermission="access_admin">
      <div>Admin content here</div>
    </AuthGuard>
  );
}

// Using the function directly
import { requirePermission } from "@/components/auth/auth-guard";

export default async function HouseAdminPage({ params }) {
  const user = await requirePermission("manage_house", {
    id: params.houseId,
    type: "house"
  });
  
  // User is authorized, continue with component logic
  return <div>House admin content</div>;
}
```

### Protecting Client Components

```tsx
// Using the RouteGuard component
import RouteGuard from "@/components/auth/route-guard";

export default function ResourceBookingForm({ houseId }) {
  return (
    <RouteGuard 
      requiredPermission="book_resources"
      resource={{ id: houseId, type: "house" }}
    >
      <div>Booking form here</div>
    </RouteGuard>
  );
}

// Using the hook
import { usePermission } from "@/lib/auth/hooks";

export default function EventActions({ event }) {
  const canEdit = usePermission("edit_events", { id: event.id, type: "event" });
  const canDelete = usePermission("delete_events", { id: event.id, type: "event" });
  
  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

## Remaining Work

1. **Fix Type Error in Route Config**: The permission `'manage_events'` in the route configuration is not defined in our Permission type. This should be replaced with one of the valid event permissions like `'edit_events'`.

2. **Update Page Components**: Existing page components should be updated to use the new auth guards where appropriate.

3. **UI for Permission Denied**: Create consistent UI/UX for handling permission denied cases.

4. **Testing**: Comprehensive testing of the authorization system:
   - Unit tests for permission functions
   - Integration tests for auth guards
   - E2E tests for protected routes

5. **Documentation & Training**: Create documentation for developers on how to use the auth system properly.

6. **Audit Existing Routes**: Review all existing routes to ensure they have proper protection.

7. **Custom Permission Messages**: Add support for custom error messages when permissions are denied.

8. **Role Transition Handling**: Implement proper handling when a user's role changes.

## Migration Strategy

1. **Middleware First**: The middleware provides app-wide protection without requiring all components to be updated at once.

2. **Gradual Component Updates**: Update components to use the new guards progressively, starting with the most sensitive routes.

3. **Auth Provider Updates**: Ensure the AuthProvider is updated to expose the necessary role information.

4. **Parallel Systems**: During migration, both systems can coexist, with the middleware providing baseline protection while components are updated.

## Best Practices for Developers

1. **Use Guards, Not Direct Checks**: Always use the provided guards rather than implementing custom checks.

2. **Define Permissions Centrally**: If new permissions are needed, add them to the central Permission type.

3. **Resource Validations**: For resource-specific permissions, always provide the resource object.

4. **Server vs. Client**: Choose the appropriate guard based on whether you're in a server or client component.

5. **Error Handling**: Always provide fallback content or redirects for permission denied cases.

## Conclusion

This auth overhaul provides a robust, scalable, and maintainable authentication and authorization system that follows industry best practices. By centralizing auth logic, leveraging NextJS middleware, and implementing a capability-based permission model, we've created a system that can grow with Accelr8's needs as it expands to multiple houses and more complex permission requirements. 