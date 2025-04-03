# Accelr8 Authentication & Authorization System

This directory contains the core files for Accelr8's authentication and authorization system.

## Architecture Overview

Our authorization system follows a layered approach with several key components:

1. **NextJS Middleware** (`/src/middleware.ts`)
   - Intercepts requests before reaching components
   - Verifies authentication via Supabase session
   - Performs route-level permission checks
   - Handles resource-level access checks
   - Redirects unauthorized access

2. **Permission System** (`/src/lib/auth/permissions.ts`)
   - Defines all permissions as TypeScript types
   - Implements capability-based model with roles
   - Provides resource-specific permission checks
   - Offers helper functions: `can()`, `hasPermission()`, `getPermissions()`

3. **Route Configuration** (`/src/lib/auth/config.ts`)
   - Centrally defines all routes with permissions
   - Specifies public/protected status
   - Configures required permissions
   - Defines resource validations
   - Sets fallback URLs

4. **Centralized Types** (`/src/lib/auth/types.ts`)
   - Defines all auth-related types in one place
   - Ensures consistency across the application
   - Makes it easy to extend the type system

5. **Auth Context** (`/src/lib/auth/context.tsx`)
   - Provides React context for client components
   - Manages auth state
   - Offers auth methods for sign-in/sign-up
   - Exposes permission helpers

6. **Auth Hooks** (`/src/lib/auth/hooks.ts`)
   - React hooks for client components
   - Provides permission checking
   - Handles auth redirects

7. **Auth Guards**
   - Server-side: `AuthGuard` component and `requirePermission` function
   - Client-side: `RouteGuard` component 

8. **Auth Utilities** (`/src/lib/auth-utils.ts`)
   - Server-side auth helper functions
   - User profile management
   - Session management

9. **Barrel Exports** (`/src/lib/auth/index.ts`)
   - Exports all auth functionality from one place
   - Simplifies imports throughout the application
   - Makes refactoring easier

## Usage Examples

### Server Components

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

// Using the requirePermission function
import { requirePermission } from "@/components/auth/auth-guard";

export default async function HouseAdminPage({ params }) {
  const user = await requirePermission("manage_house", {
    id: params.houseId,
    type: "house"
  });
  
  return <div>House admin content</div>;
}
```

### Client Components

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

// Using permission hooks and context
import { usePermission, useAuth } from "@/lib/auth";

export default function EventActions({ event }) {
  const { hasPermission } = useAuth();
  const canEdit = usePermission("edit_events", { id: event.id, type: "event" });
  
  // Simple permission (no resource)
  const canAccessAdmin = hasPermission("access_admin");
  
  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canAccessAdmin && <button>Admin</button>}
    </div>
  );
}
```

## Best Practices

1. **Use Guards, Not Direct Checks**: Always use provided guards rather than implementing custom checks.

2. **Define Permissions Centrally**: If new permissions are needed, add them to the Permission type.

3. **Resource Validations**: For resource-specific permissions, always provide the resource object.

4. **Server vs. Client**: Choose appropriate guard based on whether you're in server or client component.

5. **Error Handling**: Provide fallback content or redirects for permission denied cases.

6. **Import from Barrel**: Always import from `@/lib/auth` rather than individual files when possible. 