# Simplified Type System for Accelr8

## Overview

This document explains the simplified type system used in the Accelr8 codebase to handle data from our dual-database architecture (Sanity CMS and Supabase).

## Core Principles

1. **Direct Database Mapping**: Base types directly map to database tables
2. **Extension Pattern**: Combined types extend database types with optional content
3. **Separation of Concerns**: Clear separation between operational and content data
4. **Minimal Transformation**: Data is used in its native format wherever possible

## Type Hierarchy

```
SupabaseHouseOperations  <----- SanityHouse
       ^                         ^
       |                         |
       |                         |
      House ----------------------
```

In this pattern:
- `SupabaseHouseOperations` maps directly to the Supabase table
- `SanityHouse` represents content from Sanity
- `House` extends `SupabaseHouseOperations` and includes an optional `sanityHouse` property

## Type Definitions

### Base Database Types

These types directly reflect the tables in our Supabase database:

```typescript
export interface SupabaseHouseOperations {
  id: string;
  sanity_house_id: string;
  status: 'open' | 'planned' | 'closed';
  current_occupancy: number;
  wifi_network?: string;
  // ... more operational fields
  created_at: string;
  updated_at: string;
}

export interface SupabaseRoom {
  id: string;
  sanity_house_id: string;
  sanity_room_type_id: string;
  room_number: string;
  // ... more operational fields
  created_at: string;
  updated_at: string;
}

export interface SupabaseHouseEvent {
  id: string;
  sanity_event_id?: string;
  sanity_house_id: string;
  title: string;
  // ... more operational fields
  created_at: string;
  updated_at: string;
}
```

### Combined Types

These types extend the base types with optional Sanity content:

```typescript
export interface House extends SupabaseHouseOperations {
  sanityHouse?: SanityHouse;
}

export interface Room extends SupabaseRoom {
  sanityRoomType?: SanityRoomType;
}

export interface Event extends SupabaseHouseEvent {
  sanityEvent?: SanityEvent;
}
```

## Best Practices

### Accessing Properties

Access Supabase properties directly from the base type:

```typescript
function getHouseStatus(house: House): string {
  return house.status; // Directly from SupabaseHouseOperations
}
```

Access Sanity content through the optional property:

```typescript
function getHouseDescription(house: House): string {
  return house.sanityHouse?.shortDescription || 'No description available';
}
```

### Type Guards for Sanity Content

Use type guards when working with optional Sanity data:

```typescript
function hasFullContent(house: House): boolean {
  return !!house.sanityHouse;
}

function displayHouseImage(house: House): JSX.Element {
  if (house.sanityHouse?.mainImage) {
    return <SanityImage image={house.sanityHouse.mainImage} />;
  }
  return <DefaultHouseImage />;
}
```

## Using Data Enhancers

Instead of transformers, we now use "enhancers" to attach Sanity data and computed properties:

```typescript
// Example enhancer
export function enhanceHouseWithSanityData(
  houseOperations: SupabaseHouseOperations, 
  sanityHouse?: SanityHouse
): House {
  return {
    ...houseOperations,
    sanityHouse
  };
}
```

## Handling Extended Types

For cases where we need additional runtime properties not in the database:

```typescript
// Define extended type with additional properties
export interface EventWithParticipation extends Event {
  participationData: SupabaseEventParticipation;
}

// Create enhancer function that returns the extended type
export function addEventParticipationData(
  event: Event,
  participationData: SupabaseEventParticipation
): EventWithParticipation {
  return {
    ...event,
    participationData
  };
}
```

## Benefits of This Approach

1. **Simplicity**: Direct mapping to database tables makes the type system easier to understand
2. **Maintainability**: Changes to database schema can be easily reflected in types
3. **Type Safety**: Strong typing throughout the application
4. **Flexibility**: Easy to extend with additional computed or runtime properties
5. **Performance**: Minimal transformation overhead
6. **Clarity**: Clear separation between operational and content data

## Migration Guide

If you're working with older code that uses the previous type system:

1. Update imports to use the new simplified types
2. Replace transformer calls with enhancer functions
3. Update property access paths (old: `event.operationalData.status`, new: `event.status`)
4. For computed properties previously on the combined type, use enhancer functions to add them

## FAQ

### How do I handle data that exists in both Sanity and Supabase?

Always prefer the Supabase version for operational data. The Sanity version should only be used for rich content that doesn't exist in Supabase.

### What if I need to add computed properties?

Create enhancer functions that add computed properties while preserving the original object:

```typescript
function addHouseComputedProperties(house: House): HouseWithComputedProps {
  return {
    ...house,
    occupancyRate: house.current_occupancy / getTotalCapacity(house),
    isAtCapacity: house.current_occupancy >= getTotalCapacity(house)
  };
}
```

### How do I handle filtering and sorting?

For operational data, filter and sort directly on the properties from the Supabase type:

```typescript
const activeHouses = houses.filter(house => house.status === 'open');
const sortedRooms = rooms.sort((a, b) => 
  a.current_price && b.current_price 
    ? a.current_price - b.current_price 
    : 0
);
```

For content-related filtering, check the Sanity property first:

```typescript
const housesWithImages = houses.filter(house => !!house.sanityHouse?.mainImage);
``` 