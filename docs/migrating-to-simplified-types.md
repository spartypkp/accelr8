# Migrating Components to the Simplified Type System

This guide provides examples for migrating your existing components from the previous complex type system to our new simplified type system.

## Common Migration Patterns

### Before and After Examples

#### Example 1: Accessing Event Properties

**Before:**

```tsx
function EventCard({ event }: { event: Event }) {
  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <time>{formatDate(event.startDateTime)}</time>
      
      {event.isUpcoming && (
        <div className="badge">Upcoming</div>
      )}
      
      <div className="status">
        Status: {event.operationalData?.status || 'Unknown'}
      </div>
      
      {event.operationalData?.isMandatory && (
        <div className="mandatory-badge">Mandatory</div>
      )}
      
      {event.sanityData?.mainImage && (
        <SanityImage image={event.sanityData.mainImage} />
      )}
    </div>
  );
}
```

**After:**

```tsx
function EventCard({ event }: { event: Event }) {
  // Calculate derived values that were previously on the Event type
  const startDate = new Date(event.start_time);
  const now = new Date();
  const isUpcoming = startDate > now;
  
  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <time>{formatDate(event.start_time)}</time>
      
      {isUpcoming && (
        <div className="badge">Upcoming</div>
      )}
      
      <div className="status">
        Status: {event.status}
      </div>
      
      {event.is_mandatory && (
        <div className="mandatory-badge">Mandatory</div>
      )}
      
      {event.sanityEvent?.mainImage && (
        <SanityImage image={event.sanityEvent.mainImage} />
      )}
    </div>
  );
}
```

#### Example 2: Using Data in a Form

**Before:**

```tsx
function HouseEditForm({ house }: { house: House }) {
  const [formData, setFormData] = useState({
    name: house.sanityData?.name || '',
    status: house.operationalData?.status || 'open',
    wifiNetwork: house.operationalData?.wifi_network || '',
    wifiPassword: house.operationalData?.wifi_password || '',
  });
  
  // ...form handling
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      {/* More form fields */}
    </form>
  );
}
```

**After:**

```tsx
function HouseEditForm({ house }: { house: House }) {
  const [formData, setFormData] = useState({
    name: house.sanityHouse?.name || '',
    status: house.status,
    wifiNetwork: house.wifi_network || '',
    wifiPassword: house.wifi_password || '',
  });
  
  // ...form handling
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      {/* More form fields */}
    </form>
  );
}
```

#### Example 3: Working with Extended Types

**Before:**

```tsx
function EventWithRSVP({ event, userRsvp }: { 
  event: Event, 
  userRsvp: SupabaseEventParticipation 
}) {
  // Previously we'd check both sources
  const status = event.operationalData?.status;
  const rsvpStatus = event.operationalData?.userParticipation?.rsvp_status;
  
  return (
    <div>
      <h2>{event.title}</h2>
      <div>
        Your RSVP: {rsvpStatus || 'Not responded'}
      </div>
    </div>
  );
}
```

**After:**

```tsx
import { EventWithParticipation } from '../lib/enhancers/events';

function EventWithRSVP({ event }: { event: EventWithParticipation }) {
  // Now rsvp data comes directly from the extended type
  const status = event.status;
  const rsvpStatus = event.participationData.rsvp_status;
  
  return (
    <div>
      <h2>{event.title}</h2>
      <div>
        Your RSVP: {rsvpStatus}
      </div>
    </div>
  );
}

// Usage:
// const event = await getEvent(id);
// const participationData = await getEventParticipation(id, userId);
// const eventWithParticipation = addEventParticipationData(event, participationData);
// <EventWithRSVP event={eventWithParticipation} />
```

## API Usage Migration

### Fetching Data

**Before:**

```tsx
// In a component or data fetching function
async function getEventDetails(id: string) {
  const res = await fetch(`/api/events/${id}`);
  const event: Event = await res.json();
  
  // Access was complex
  return {
    title: event.title,
    description: event.description,
    startTime: event.startDateTime,
    endTime: event.endDateTime,
    isCompleted: event.operationalData?.status === 'completed',
    hasRichContent: !!event.sanityData
  };
}
```

**After:**

```tsx
// In a component or data fetching function
async function getEventDetails(id: string) {
  const res = await fetch(`/api/events/${id}`);
  const event: Event = await res.json();
  
  // Access is more direct
  return {
    title: event.title,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    isCompleted: event.status === 'completed',
    hasRichContent: !!event.sanityEvent
  };
}
```

### Creating Data

**Before:**

```tsx
async function createNewEvent(formData: EventFormData) {
  // Complex transformation to match expected API input
  const eventInput = {
    title: formData.title,
    description: formData.description,
    startDateTime: formData.startDate,
    endDateTime: formData.endDate,
    location: formData.location,
    houseId: formData.houseId,
    operationalData: {
      isMandatory: formData.isMandatory,
      maxParticipants: formData.maxParticipants
    }
  };
  
  const res = await fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventInput)
  });
  
  return await res.json();
}
```

**After:**

```tsx
async function createNewEvent(formData: EventFormData) {
  // Direct mapping to Supabase structure
  const eventInput = {
    title: formData.title,
    description: formData.description,
    start_time: formData.startDate,
    end_time: formData.endDate,
    location: formData.location,
    sanity_house_id: formData.houseId,
    is_mandatory: formData.isMandatory,
    max_participants: formData.maxParticipants
  };
  
  const res = await fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventInput)
  });
  
  return await res.json();
}
```

## Handling Computed Properties

For properties that were previously computed and attached to the type:

### Using Utility Functions

**Before:**

```tsx
function EventCountdown({ event }: { event: Event }) {
  return (
    <div>
      {event.isUpcoming && event.daysUntil !== undefined && (
        <div className="countdown">
          Starting in {event.daysUntil} days
        </div>
      )}
    </div>
  );
}
```

**After:**

```tsx
import { calculateEventMetrics } from '../lib/enhancers/events';

function EventCountdown({ event }: { event: Event }) {
  const { daysUntil, isAvailable } = calculateEventMetrics(event);
  
  return (
    <div>
      {isAvailable && daysUntil !== undefined && (
        <div className="countdown">
          Starting in {daysUntil} days
        </div>
      )}
    </div>
  );
}
```

### Computing Properties in Components

**Before:**

```tsx
function EventOccupancy({ event }: { event: Event }) {
  return (
    <div className="occupancy">
      {event.operationalData?.currentParticipants || 0} / 
      {event.operationalData?.max_participants || 'unlimited'}
      
      {event.operationalData?.max_participants && 
       event.operationalData.currentParticipants >= event.operationalData.max_participants && (
        <div className="at-capacity">At capacity</div>
      )}
    </div>
  );
}
```

**After:**

```tsx
function EventOccupancy({ event }: { event: Event }) {
  const { isAtCapacity } = calculateEventMetrics(event);
  
  return (
    <div className="occupancy">
      {event.current_participants} / 
      {event.max_participants || 'unlimited'}
      
      {isAtCapacity && (
        <div className="at-capacity">At capacity</div>
      )}
    </div>
  );
}
```

## Best Practices for Migration

1. **Identify Property Paths**: List all the properties accessed from the old types
2. **Map to New Paths**: Create a mapping between old and new property paths
3. **Update One Component at a Time**: Make changes incrementally and test each component
4. **Extract Computed Properties**: Move calculations that were previously embedded in types to separate functions or hooks
5. **Use TypeScript Errors**: Let TypeScript guide you to the properties that need updating
6. **Test Edge Cases**: Especially test when Sanity data might be null or undefined

## Common Migration Challenges

### Challenge: Nested Optional Properties

**Before:**
```tsx
const imageUrl = event.sanityData?.mainImage?.asset?.url;
```

**After:**
```tsx
const imageUrl = event.sanityEvent?.mainImage?.asset?.url;
```

### Challenge: Renamed Properties

**Before:**
```tsx
const isStartingSoon = event.startDateTime && 
  new Date(event.startDateTime).getTime() - Date.now() < 24 * 60 * 60 * 1000;
```

**After:**
```tsx
const isStartingSoon = event.start_time && 
  new Date(event.start_time).getTime() - Date.now() < 24 * 60 * 60 * 1000;
```

### Challenge: Previously Computed Properties

**Before:**
```tsx
if (event.isUpcoming && !event.isPast) {
  // Do something with upcoming events
}
```

**After:**
```tsx
const now = new Date();
const startDate = new Date(event.start_time);
const endDate = new Date(event.end_time);
const isUpcoming = startDate > now;
const isPast = endDate < now;

if (isUpcoming && !isPast) {
  // Do something with upcoming events
}
```

Or better, use the enhancer:

```tsx
import { calculateEventMetrics } from '../lib/enhancers/events';

const { isAvailable } = calculateEventMetrics(event);
if (isAvailable) {
  // Do something with upcoming events
}
```

## Using with React Hooks

### Creating Custom Hooks for Common Calculations

```tsx
function useEventStatus(event: Event) {
  const now = new Date();
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  
  return {
    isUpcoming: startDate > now,
    isOngoing: startDate <= now && endDate >= now,
    isPast: endDate < now,
    daysUntil: startDate > now 
      ? Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) 
      : undefined
  };
}

// Usage
function EventComponent({ event }: { event: Event }) {
  const { isUpcoming, daysUntil } = useEventStatus(event);
  
  return (
    <div>
      {isUpcoming && daysUntil && (
        <div>Starting in {daysUntil} days</div>
      )}
    </div>
  );
}
```

## Conclusion

Migrating to the simplified type system may require some changes to your components, but the result will be:

1. Cleaner, more maintainable code
2. More direct access to data properties
3. Better separation of data access and UI logic
4. Fewer type errors and edge cases
5. More predictable patterns across the codebase

Remember to update your components incrementally and test thoroughly during the migration process. 