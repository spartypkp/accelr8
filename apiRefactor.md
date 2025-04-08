# API Refactoring Plan: Accelr8 Dual-Database Architecture

## Overview

This document outlines the implementation plan for refactoring our API layer to support the dual-database architecture using Sanity CMS and Supabase. Our goal is to create a clean, maintainable structure that abstracts away the complexity of data integration while providing type-safe CRUD operations.

We've implemented a simplified type system where:
1. Core types directly reflect Supabase tables (operational data)
2. Combined types extend Supabase types with an optional Sanity property
3. Clear separation between operational and content data

This approach provides a clean, direct mapping between database tables and TypeScript types, while maintaining the ability to access rich content when needed.

## Directory Structure

```
src/app/
├── lib/
|   ├── types.ts    # Combined Types [DONE]
│   ├── api/                    # API helper functions
│   │   ├── index.ts            # Exports all API functions [DONE]
│   │   ├── houses.ts           # House entity operations [DONE]
│   │   ├── events.ts           # Event entity operations 
│   │   ├── users.ts            # User entity operations [DONE]
│   │   ├── rooms.ts            # Room entity operations [DONE]
│   │   ├── applications.ts     # Application entity operations [DONE]
│   │   └── shared/             # Shared utility functions
│   │       ├── error.ts        # Error handling utilities [DONE]
│   │       ├── cache.ts        # Caching strategies [DONE]
│   │       └── validation.ts   # Input validation [DONE]
│   │
│   ├── enhancers/              # Data enhancement utilities (renamed from transformers)
│   │   ├── index.ts            # Exports all enhancers
│   │   ├── houses.ts           # House enhancers 
│   │   ├── events.ts           # Event enhancers
│   │   ├── users.ts            # User enhancers 
│   │   ├── rooms.ts            # Room enhancers
│   │   └── applications.ts     # Application enhancers
│   │
│   ├── sanity/                 # Sanity client and utilities [DONE]
│   │   └── client.ts           # Sanity client initialization
│   │   └── sanity.types.ts     # Sanity types (auto-generated)
│   │
│   └── supabase/               # Supabase client and utilities [DONE]
│       └── supbase_schema.sql  # Supabase SQL Schema
│       └── client.ts           # Supabase client-side initialization
│       └── server.ts           # Supabase server-side initialization
│       └── middleware.ts       # Supabase middleware function

│
└
    api/                    # Next.js API routes
    ├── houses/             # House endpoints
    │   ├── route.ts        # GET (list), POST (create) [DONE]
    │   ├── [id]/
    │   │   └── route.ts    # GET (single), PUT, DELETE [DONE]
    │   └── active/
    │       └── route.ts    # GET active houses [DONE]
    │
    ├── events/             # Event endpoints
    │   ├── route.ts        # GET (list), POST (create)
    │   ├── [id]/
    │   │   └── route.ts    # GET (single), PUT, DELETE
    │   ├── house/
    │   │   └── [houseId]/
    │   │       └── route.ts # GET house-specific events
    │   ├── rsvp/
    │   │   └── route.ts     # POST RSVP for an event
    │   └── upcoming/
    │       └── route.ts     # GET upcoming events
    │
    ├── users/              # User endpoints
    │   ├── route.ts        # GET (list), POST (create) [DONE]
    │   ├── [id]/
    │   │   └── route.ts    # GET (single), PUT, DELETE [DONE]
    │   ├── profile/
    │   │   └── route.ts    # GET current user profile [DONE]
    │   └── house/
    │       └── [houseId]/
    │           └── route.ts # GET house residents [DONE]
    │
    ├── rooms/              # Room endpoints
    │   ├── route.ts        # GET (list), POST (create) [DONE]
    │   ├── [id]/
    │   │   └── route.ts    # GET (single), PUT, DELETE [DONE]
    │   ├── available/
    │   │   └── route.ts    # GET available rooms [DONE]
    │   └── house/
    │       └── [houseId]/
    │           └── route.ts # GET rooms by house [DONE]
    │
    ├── applications/       # Application endpoints
    │   ├── route.ts        # GET (list), POST (create) [DONE]
    │   ├── [id]/
    │   │   └── route.ts    # GET (single), PUT, DELETE [DONE]
    │   ├── status/
    │   │   └── [status]/
    │   │       └── route.ts # GET by status
    │   └── interviews/
    │       ├── route.ts     # POST create interview
    │       └── [id]/
    │           └── route.ts # GET, PUT, DELETE interview
    │
    │
    └── search/             # Search endpoints
        ├── residents/
        │   └── route.ts    # GET search residents
        └── resources/
            └── route.ts    # GET search resources
```

## Implementation Phases

### Phase 1: Core Infrastructure (1-2 days) [COMPLETED]

1. **Set up base directories and structure** [DONE]
   - Create the folder structure outlined above
   - Set up index files for exports
   - Establish base error handling and logging patterns

2. **Implement simplified type system** [DONE]
   - Create direct Supabase table type mappings
   - Implement combined types with optional Sanity properties
   - Update type imports across the codebase

3. **Create shared API utilities** [DONE]
   - Implement input validation helpers
   - Set up error handling patterns
   - Create caching utility functions

### Phase 2: Entity API Implementation (3-4 days) [COMPLETED]

Implement each entity's API layer in the following order based on dependency relationships:

1. **Users API (`users.ts`)** [DONE]
   - Authentication functions
   - User profile management
   - Permission checks

2. **Houses API (`houses.ts`)** [DONE]
   - House CRUD operations
   - House query functions (filtering, sorting)
   - House-specific utilities

3. **Rooms API (`rooms.ts`)** [DONE]
   - Room CRUD operations
   - Room availability functions
   - Room assignment helpers

4. **Events API (`events.ts`)** [DONE]
   - Event CRUD operations
   - Event participant management
   - RSVP handling

5. **Applications API (`applications.ts`)** [DONE]
   - Application CRUD operations
   - Application status management
   - Interview scheduling helpers

### Phase 3: Data Enhancers Implementation (1-2 days) [PENDING]

1. **Create base enhancer patterns** [DONE]
   - Define reusable data enhancement functions
   - Implement error handling for transformations
   - Set up validation during enhancement

2. **Implement entity-specific enhancers**
   - `enhancers/houses.ts`: Attach Sanity house data and compute metrics [PENDING]
   - `enhancers/users.ts`: Attach Sanity person data [DONE]
   - `enhancers/rooms.ts`: Attach Sanity room type data [DONE]
   - `enhancers/events.ts`: Attach Sanity event data and compute metrics [NEEDS UPDATE]
   - `enhancers/applications.ts`: Add computed application properties [PENDING]

### Phase 4: API Routes Implementation (2-3 days) [COMPLETED]

1. **Implement base API route patterns** [DONE]
   - Create error handling middleware
   - Implement authentication checks
   - Set up rate limiting and security headers

2. **Build entity-specific routes**
   - Houses API routes [DONE]
   - Users API routes [DONE]
   - Rooms API routes [DONE]
   - Events API routes [DONE]
   - Applications API routes [DONE]

## Recent Implementations

### Simplified Type System [NEW]

We have implemented a simplified type system with the following key features:

1. **Direct SQL Table Mapping**
   - Each type directly maps to its corresponding Supabase table
   - Properties use the same naming convention as SQL columns
   - Types accurately reflect database constraints and relationships

2. **Combined Types with Minimal Overhead**
   - Combined types simply extend the base Supabase type
   - Single optional property for Sanity data (e.g., `sanityHouse`, `sanityEvent`)
   - Clean separation between operational and content concerns

3. **Clear Type Hierarchy**
   - `Supabase*` types for raw database data
   - Combined interface types (e.g., `House`, `Event`) that extend the base types
   - Predictable pattern across all entity types

4. **Type-Safe Access Patterns**
   - Operational data (Supabase) is always available
   - Content data (Sanity) is accessed via optional properties
   - TypeScript provides proper type checking for both data sources

### Events API

We have successfully implemented the Events API with the following key features:

1. **Backend API Layer in `lib/api/events.ts`**
   - Created a complete CRUD operations set for Events
   - Implemented hybrid data sources (Sanity + Supabase)
   - Added RSVP handling functionality with attendance tracking
   - Created strongly typed interfaces: `EventQueryOptions`, `EventInput`, `RsvpInput`

2. **Events Transformer in `lib/transformers/events.ts`**
   - Implemented transformers to convert between Sanity and Supabase formats
   - Added utility functions for events metrics (registration percentage, etc.)
   - Created unified event model combining data from both sources
   - Handled participation tracking for user-specific views

3. **API Routes for Events**
   - `GET /api/events` - List events with robust filtering and pagination
   - `POST /api/events` - Create new events
   - `GET/PUT/DELETE /api/events/id` - Single event operations
   - `GET /api/events/house/houseId` - House-specific events
   - `GET /api/events/upcoming` - Upcoming events
   - `POST /api/events/rsvp` - Update RSVP status

4. **Validation Pattern with Zod**
   - Implemented comprehensive Zod schemas for validation
   - Added input validation for event creation/updates
   - Validated RSVP status updates

### Applications API

We have successfully implemented the Applications API with the following key features:

1. **Backend API Layer in `lib/api/applications.ts`**
   - Created a complete CRUD operations set for Applications
   - Defined strongly typed interfaces: `ApplicationQueryOptions`, `ApplicationInput`, `Application`
   - Implemented utility functions for house ID lookups

2. **API Routes for Applications**
   - `GET /api/applications` - List applications with filtering and pagination
   - `POST /api/applications` - Submit a new application with form data
   - `GET /api/applications/[id]` - Get a specific application by ID
   - `PATCH /api/applications/[id]` - Update an application's status

3. **Validation Pattern with Zod**
   - Implemented comprehensive Zod schemas for validation:
     - Query parameter validation for filtering and sorting
     - Application form data validation with detailed error messages
     - Status update validation
   - Leveraged the reusable `withValidation` helper for consistent validation

4. **Error Handling**
   - Used consistent error handling across all endpoints with `handleApiError`
   - Implemented detailed error messages for validation failures

## Detailed Implementation Plan

### API Helper Functions (`lib/api/`)

Each entity module will continue to export a complete set of CRUD operations with updated type signatures reflecting our new simplified type system:

```typescript
// houses.ts example structure
export async function createHouse(data: Partial<SupabaseHouseOperations>): Promise<House | null>;
export async function getHouse(id: string): Promise<House | null>;
export async function getHouses(options?: QueryOptions): Promise<House[]>;
export async function updateHouse(id: string, data: Partial<SupabaseHouseOperations>): Promise<House | null>;
export async function deleteHouse(id: string): Promise<boolean>;

// Additional query functions
export async function getHousesByLocation(city: string, state?: string): Promise<House[]>;
export async function getActiveHouses(): Promise<House[]>;
```

### Data Enhancers (`lib/enhancers/`)

Each enhancer module will contain functions for enriching base Supabase data with Sanity content and computed properties:

```typescript
// houses.ts example structure
export function enhanceHouseWithSanityData(
  houseOperations: SupabaseHouseOperations, 
  sanityHouse?: SanityHouse
): House {
  // Create a House object (which extends SupabaseHouseOperations)
  // and add the sanityHouse property
  return {
    ...houseOperations,
    sanityHouse
  };
}

// Utility functions for computed properties
export function addHouseComputedProperties(house: House): House {
  // Add computed properties while preserving the original house data
  return {
    ...house,
    // Any additional properties would be computed here
  };
}
```

### API Routes Implementation (`app/api/`)

#### 1. Houses API Routes [COMPLETED]

- **`/api/houses`**
  - `GET`: List houses with optional filters (status, location, etc.)
  - `POST`: Create a new house (requires admin)

- **`/api/houses/[id]`**
  - `GET`: Get a single house by ID with complete operational data
  - `PUT`: Update a house (requires admin)
  - `DELETE`: Delete a house (requires admin)

- **`/api/houses/active`**
  - `GET`: Get all currently active houses

#### 2. Users API Routes [COMPLETED]

- **`/api/users`**
  - `GET`: List users (admin only, with filtering)
  - `POST`: Create a new user (admin only)

- **`/api/users/[id]`**
  - `GET`: Get a user by ID
  - `PUT`: Update a user
  - `DELETE`: Delete a user (admin only)

- **`/api/users/profile`**
  - `GET`: Get the current authenticated user's profile

- **`/api/users/house/[houseId]`**
  - `GET`: Get all residents for a specific house

#### 3. Rooms API Routes [COMPLETED]

- **`/api/rooms`**
  - `GET`: List rooms with optional filters
  - `POST`: Create a new room (admin only)

- **`/api/rooms/[id]`**
  - `GET`: Get a single room by ID
  - `PUT`: Update a room
  - `DELETE`: Delete a room (admin only)

- **`/api/rooms/available`**
  - `GET`: Get all available rooms

- **`/api/rooms/house/[houseId]`**
  - `GET`: Get all rooms for a specific house

#### 4. Events API Routes [DONE]

- **`/api/events`**
  - `GET`: List events with filters (date range, type, etc.)
  - `POST`: Create a new event

- **`/api/events/[id]`**
  - `GET`: Get a single event by ID
  - `PUT`: Update an event
  - `DELETE`: Delete an event (creator or admin only)

- **`/api/events/house/[houseId]`**
  - `GET`: Get events for a specific house

- **`/api/events/rsvp`**
  - `POST`: RSVP for an event

- **`/api/events/upcoming`**
  - `GET`: Get upcoming events

#### 5. Applications API Routes [DONE]

- **`/api/applications`** [DONE]
  - `GET`: List applications (admin only)
  - `POST`: Submit a new application

- **`/api/applications/[id]`** [DONE]
  - `GET`: Get an application by ID
  - `PATCH`: Update an application status

- **`/api/applications/status/[status]`** [PENDING]
  - `GET`: Get applications by status

- **`/api/applications/interviews`** [PENDING]
  - `POST`: Schedule a new interview

- **`/api/applications/interviews/[id]`** [PENDING]
  - `GET`: Get interview details
  - `PUT`: Update interview status
  - `DELETE`: Cancel an interview

#### 6. Authentication API Routes [PENDING]

- **`/api/auth/login`**
  - `POST`: Login with email/password

- **`/api/auth/register`**
  - `POST`: Register a new user (for approved applications)

- **`/api/auth/logout`**
  - `POST`: Logout current user

- **`/api/auth/password-reset`**
  - `POST`: Request password reset

#### 7. Search API Routes [PENDING]

- **`/api/search/residents`**
  - `GET`: Search for residents by name, skills, etc.

- **`/api/search/resources`**
  - `GET`: Search for resources across houses

### Route Implementation Examples

Each route will handle specific HTTP methods and include proper error handling:

```typescript
// Example structure for houses/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const house = await getHouse(params.id);
    
    if (!house) {
      return NextResponse.json({ error: 'House not found' }, { status: 404 });
    }
    
    return NextResponse.json(house);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Validate input data
    const validatedData = validateHouseInput(data);
    
    const updatedHouse = await updateHouse(params.id, validatedData);
    
    if (!updatedHouse) {
      return NextResponse.json({ error: 'House not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedHouse);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteHouse(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'House not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Important Considerations

### 1. Error Handling [IMPLEMENTED]

Implement a consistent error handling strategy:

```typescript
// lib/api/shared/error.ts
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  // Default error handling
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
```

### 2. Transaction Management [IMPLEMENTED]

Updated for the new type system:

```typescript
// Example transaction-like pattern for house creation with the new type system
async function createHouseWithRollback(data: Partial<SupabaseHouseOperations>, 
                                       sanityData: any): Promise<House | null> {
  let sanityHouseId: string | null = null;
  
  try {
    // Create in Sanity first
    const sanityHouse = await createSanityHouse(sanityData);
    sanityHouseId = sanityHouse._id;
    
    try {
      // Create operational data in Supabase
      const houseOperations = await createHouseOperations({
        ...data,
        sanity_house_id: sanityHouseId,
      });
      
      // Return combined result using the enhancer
      return enhanceHouseWithSanityData(houseOperations, sanityHouse);
    } catch (supabaseError) {
      // Supabase failed, rollback Sanity
      if (sanityHouseId) {
        await deleteSanityHouse(sanityHouseId).catch(err => {
          console.error('Rollback failed:', err);
        });
      }
      throw supabaseError;
    }
  } catch (error) {
    console.error('House creation failed:', error);
    throw new ApiError(
      'Failed to create house',
      500,
      error
    );
  }
}
```

### 3. Caching Strategy [IMPLEMENTED]

Implement appropriate caching based on data type:

```typescript
// lib/api/shared/cache.ts
const CACHE_TIMES = {
  HOUSE: 60 * 5, // 5 minutes
  EVENT: 60, // 1 minute
  ROOM: 60 * 2, // 2 minutes
  USER: 60 * 10, // 10 minutes
  APPLICATION: 60 * 3 // 3 minutes
};

export function getCacheHeaders(entityType: keyof typeof CACHE_TIMES): ResponseInit {
  return {
    headers: {
      'Cache-Control': `s-maxage=${CACHE_TIMES[entityType]}, stale-while-revalidate`
    }
  };
}
```

### 4. Validation Strategy [IMPLEMENTED]

We've implemented a consistent validation pattern using Zod schemas:

```typescript
// lib/api/shared/validation.ts
export async function withValidation<T extends z.ZodType>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new ApiError(`Validation error: ${errorMessage}`, 400);
    }
    throw new ApiError('Invalid data provided', 400);
  }
}

// Usage example in route handlers
const validatedData = await withValidation(applicationSchema, formData);
```

### 5. Authorization Middleware [PENDING]

For protected routes, implement middleware to check permissions:

```typescript
// Example middleware for checking house admin rights
async function requireHouseAdmin(
  request: NextRequest,
  houseId: string
): Promise<NextResponse | null> {
  const session = await getSession(request);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const hasAccess = await checkHouseAdminAccess(session.user.id, houseId);
  
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'You do not have permission to perform this action' },
      { status: 403 }
    );
  }
  
  return null; // No error, proceed with the request
}
```

## Documentation

We'll create comprehensive documentation:

1. **API Reference**: Document all exported functions
2. **Type System Guide**: Explain the new simplified type structure and relationships
3. **Integration Examples**: Show how to use the API in components
4. **Migration Guide**: Help developers transition to the new type system

## Migration Plan

To migrate existing code to this new architecture:

1. Update transformers to data enhancers using the new pattern
2. Fix type errors in existing components one by one
3. Test each component thoroughly after migration
4. Remove old transformation patterns when no longer used

## Timeline

- **Phase 1 (Core Infrastructure)**: Days 1-2 [COMPLETE]
- **Phase 2 (Entity API Implementation)**: Days 3-6 [COMPLETE]
- **Phase 3 (Type System Simplification)**: Days 7-8 [COMPLETE]
- **Phase 4 (Data Enhancers Implementation)**: Days 9-10 [PENDING]
- **Phase 5 (API Routes Implementation)**: Days 11-12 [COMPLETE]
- **Testing & Documentation**: Days 13-14 [PENDING]

## Success Criteria

This refactoring will be considered successful when:

1. All entity operations go through the new API layer
2. Type safety is maintained throughout the application
3. The simplified type system eliminates previous type errors
4. Data enhancers correctly provide Sanity data when available
5. Error handling is consistent and robust
6. Performance is maintained or improved
7. Code is well-documented and maintainable 