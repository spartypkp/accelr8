

# Auth
## Supabase Table
```sql
create table auth.users (
  instance_id uuid null,
  id uuid not null,
  aud character varying(255) null,
  role character varying(255) null,
  email character varying(255) null,
  encrypted_password character varying(255) null,
  email_confirmed_at timestamp with time zone null,
  invited_at timestamp with time zone null,
  confirmation_token character varying(255) null,
  confirmation_sent_at timestamp with time zone null,
  recovery_token character varying(255) null,
  recovery_sent_at timestamp with time zone null,
  email_change_token_new character varying(255) null,
  email_change character varying(255) null,
  email_change_sent_at timestamp with time zone null,
  last_sign_in_at timestamp with time zone null,
  raw_app_meta_data jsonb null,
  raw_user_meta_data jsonb null,
  is_super_admin boolean null,
  created_at timestamp with time zone null,
  updated_at timestamp with time zone null,
  phone text null default null::character varying,
  phone_confirmed_at timestamp with time zone null,
  phone_change text null default ''::character varying,
  phone_change_token character varying(255) null default ''::character varying,
  phone_change_sent_at timestamp with time zone null,
  confirmed_at timestamp with time zone GENERATED ALWAYS as (LEAST(email_confirmed_at, phone_confirmed_at)) STORED null,
  email_change_token_current character varying(255) null default ''::character varying,
  email_change_confirm_status smallint null default 0,
  banned_until timestamp with time zone null,
  reauthentication_token character varying(255) null default ''::character varying,
  reauthentication_sent_at timestamp with time zone null,
  is_sso_user boolean not null default false,
  deleted_at timestamp with time zone null,
  is_anonymous boolean not null default false,
  constraint users_pkey primary key (id),
  constraint users_phone_key unique (phone),
  constraint users_email_change_confirm_status_check check (
    (
      (email_change_confirm_status >= 0)
      and (email_change_confirm_status <= 2)
    )
  )
) TABLESPACE pg_default;

create unique INDEX IF not exists confirmation_token_idx on auth.users using btree (confirmation_token) TABLESPACE pg_default
where
  ((confirmation_token)::text !~ '^[0-9 ]*$'::text);

create unique INDEX IF not exists email_change_token_current_idx on auth.users using btree (email_change_token_current) TABLESPACE pg_default
where
  (
    (email_change_token_current)::text !~ '^[0-9 ]*$'::text
  );

create unique INDEX IF not exists email_change_token_new_idx on auth.users using btree (email_change_token_new) TABLESPACE pg_default
where
  (
    (email_change_token_new)::text !~ '^[0-9 ]*$'::text
  );

create unique INDEX IF not exists reauthentication_token_idx on auth.users using btree (reauthentication_token) TABLESPACE pg_default
where
  (
    (reauthentication_token)::text !~ '^[0-9 ]*$'::text
  );

create unique INDEX IF not exists recovery_token_idx on auth.users using btree (recovery_token) TABLESPACE pg_default
where
  ((recovery_token)::text !~ '^[0-9 ]*$'::text);

create unique INDEX IF not exists users_email_partial_key on auth.users using btree (email) TABLESPACE pg_default
where
  (is_sso_user = false);

create index IF not exists users_instance_id_email_idx on auth.users using btree (instance_id, lower((email)::text)) TABLESPACE pg_default;

create index IF not exists users_instance_id_idx on auth.users using btree (instance_id) TABLESPACE pg_default;

create index IF not exists users_is_anonymous_idx on auth.users using btree (is_anonymous) TABLESPACE pg_default;
```

Notably, we are including extra role information inside the auth user metadata:
```typescript
// Create auth user with metadata
const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            role: 'resident', // Default role
            sanity_house_id: 'ID HERE'
        }
    }
});
```

The whole idea is we ONLY need to use the Supabase Auth 'users' table to do all authentication and authorization (role based access combined with row level access based on the house id).

# User (People) Management
## Supabase Table
```sql
create table public.accelr8_users (
  id uuid not null,
  emergency_contact_name text null,
  emergency_contact_phone text null,
  onboarding_completed boolean null default false,
  last_active timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint accelr8_users_pkey primary key (id),
  constraint accelr8_users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  
) TABLESPACE pg_default;

create trigger update_accelr8_users_updated_at BEFORE
update on accelr8_users for EACH row
execute FUNCTION update_updated_at_column ();
``` 
This is an extension of the special Supabase Auth 'users' table. This contains any extra information we should be storing in Supabase. This could be expanded to contain more information about connections to other attributes.
## Sanity Schema
```typescript
// schemas/person.ts
import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'person',
	title: 'Person',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Full Name',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'name',
				maxLength: 96,
			},
		}),
		defineField({
			name: 'email',
			title: 'Email',
			type: 'string',
		}),
		defineField({
			name: 'profileImage',
			title: 'Profile Image',
			type: 'image',
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alternative Text',
				},
			],
		}),
		defineField({
			name: 'role',
			title: 'Role',
			type: 'string',
			description: 'Job title or role in the organization',
		}),
		defineField({
			name: 'bio',
			title: 'Short Bio',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'fullBio',
			title: 'Full Bio',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'isTeamMember',
			title: 'Is Team Member',
			type: 'boolean',
			description: 'Is this person part of the Accelr8 team?',
			initialValue: false,
		}),
		defineField({
			name: 'isResident',
			title: 'Is Resident',
			type: 'boolean',
			description: 'Is this person a current resident?',
			initialValue: false,
		}),
		defineField({
			name: 'house',
			title: 'House',
			type: 'reference',
			to: [{ type: 'house' }],
			description: 'Which house is this resident part of?',
			hidden: ({ document }) => !document?.isResident,
		}),
		defineField({
			name: 'startDate',
			title: 'Start Date',
			type: 'date',
			description: 'When did this person join as resident or team member?',
		}),
		defineField({
			name: 'endDate',
			title: 'End Date',
			type: 'date',
			description: 'If former resident or team member, when did they leave?',
		}),
		defineField({
			name: 'socialLinks',
			title: 'Social Links',
			type: 'object',
			fields: [
				{ name: 'twitter', type: 'url', title: 'Twitter' },
				{ name: 'linkedin', type: 'url', title: 'LinkedIn' },
				{ name: 'github', type: 'url', title: 'GitHub' },
				{ name: 'website', type: 'url', title: 'Personal Website' },
			],
		}),
		defineField({
			name: 'skills',
			title: 'Skills',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
		}),
		defineField({
			name: 'company',
			title: 'Company/Project',
			type: 'string',
			description: 'Current company or project they are working on',
		}),
		defineField({
			name: 'displayOnWebsite',
			title: 'Display on Website',
			type: 'boolean',
			description: 'Show this person publicly on the website?',
			initialValue: true,
		}),
		defineField({
			name: 'displayOrder',
			title: 'Display Order',
			type: 'number',
			description: 'Order for team members display (lower numbers first)',
			hidden: ({ document }) => !document?.isTeamMember,
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'role',
			media: 'profileImage',
			isTeam: 'isTeamMember',
			isResident: 'isResident',
		},
		prepare(selection) {
			const { title, subtitle, media, isTeam, isResident } = selection;
			let status = [];
			if (isTeam) status.push('Team');
			if (isResident) status.push('Resident');

			return {
				title: title,
				subtitle: status.length > 0 ? `${subtitle} (${status.join(', ')})` : subtitle,
				media: media,
			};
		},
	},
});
```

# House
Idea: Each hacker house that Accelr8 manages.
## Supabase Schema
```sql
CREATE TABLE house_operations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'planned', 'closed')),
  current_occupancy INTEGER DEFAULT 0,
  wifi_network TEXT,
  wifi_password TEXT,
  access_code TEXT,
  emergency_contacts JSONB,
  maintenance_contacts JSONB,
  cleaning_schedule JSONB,
  operational_notes TEXT,
  last_inspection_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
## Sanity Schema
```typescript
export default defineType({
  name: 'house',
  title: 'House',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'House Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this house currently active?',
      initialValue: true,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'address', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'zipCode', type: 'string', title: 'Zip/Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
        { name: 'coordinates', type: 'geopoint', title: 'Coordinates' },
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Amenity Name' },
            { 
              name: 'category', 
              type: 'string',
              title: 'Category',
              options: {
                list: [
                  'technology', 'workspace', 'comfort', 
                  'kitchen', 'entertainment', 'services', 'other'
                ]
              }
            },
            { name: 'icon', type: 'string', title: 'Icon Code' },
          ],
        },
      ],
    }),
    defineField({
      name: 'capacity',
      title: 'Total Capacity',
      type: 'number',
      validation: Rule => Rule.min(1),
    }),
    defineField({
      name: 'neighborhoodDetails',
      title: 'Neighborhood Details',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'localResources',
      title: 'Local Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Resource Name' },
            { name: 'category', type: 'string', title: 'Category' },
            { name: 'address', type: 'string', title: 'Address' },
            { name: 'distance', type: 'string', title: 'Distance' },
            { name: 'website', type: 'url', title: 'Website' },
          ],
        },
      ],
    }),
    defineField({
      name: 'houseRules',
      title: 'House Rules',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location.city',
      media: 'mainImage',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title,
        subtitle: `${subtitle}${!active ? ' (Inactive)' : ''}`,
        media,
      };
    },
  },
});
```
## Composite Type
```typescript
interface House {
  // Sanity content
  id: string;  // Sanity document ID
  name: string;
  slug: string;
  mainImage?: SanityImage;
  galleryImages?: SanityImage[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {lat: number, lng: number};
  };
  shortDescription?: string;
  fullDescription?: PortableText[];
  amenities?: Array<{
    name: string;
    category: 'technology' | 'workspace' | 'comfort' | 'kitchen' | 'entertainment' | 'services' | 'other';
    icon?: string;
  }>;
  capacity: number;
  neighborhoodDetails?: PortableText[];
  localResources?: Array<{
    name: string;
    category: string;
    address?: string;
    distance?: string;
    website?: string;
  }>;
  houseRules?: PortableText[];
  active: boolean;
  
  // Operational data from Supabase
  operations?: {
    id: string;
    status: 'operational' | 'maintenance' | 'planned_closure' | 'renovation';
    currentOccupancy: number;
    wifiNetwork?: string;
    wifiPassword?: string;
    accessCode?: string;
    emergencyContacts?: Record<string, string>;
    maintenanceContacts?: Record<string, string>;
    cleaningSchedule?: Record<string, any>;
    operationalNotes?: string;
    lastInspectionDate?: string;
  };
}
```

# Room
Idea: Each room that belongs to a house. Can have a lot of different content information - or tie to a user/person.
## Supabase Schema
```sql
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL,
  sanity_room_type_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  current_resident_id UUID REFERENCES accelr8_users(id),
  current_price DECIMAL(10,2), -- Can override base price if needed
  lease_start_date DATE,
  lease_end_date DATE,
  last_maintenance_date DATE,
  maintenance_notes TEXT,
  last_cleaned_date DATE,
  inventory_items JSONB,
  special_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (sanity_house_id, room_number)
);
```
## Sanity Schema
```Typescript
export default defineType({
  name: 'roomType',
  title: 'Room Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Room Type Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Room Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        },
      ],
    }),
    defineField({
      name: 'basePrice',
      title: 'Base Price (Monthly)',
      type: 'number',
    }),
    defineField({
      name: 'capacity',
      title: 'Occupancy Capacity',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'squareFootage',
      title: 'Square Footage',
      type: 'number',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'floorPlan',
      title: 'Floor Plan',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      house: 'house.name',
      media: 'image',
    },
    prepare({ title, house, media }) {
      return {
        title,
        subtitle: house ? `${house}` : '',
        media,
      };
    },
  },
});

```
## Combined Type
```Typescript
interface Room {
  // Operational data
  id: string;                    // Supabase UUID
  roomNumber: string;
  floor?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentResidentId?: string;
  currentPrice?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  lastMaintenanceDate?: string;
  maintenanceNotes?: string;
  lastCleanedDate?: string;
  inventoryItems?: Record<string, any>;
  specialNotes?: string;
  
  // Content data from room type
  type: {
    id: string;                 // Sanity ID
    name: string;
    description?: string;
    image?: SanityImage;
    additionalImages?: SanityImage[];
    basePrice?: number;
    capacity: number;
    squareFootage?: number;
    features?: string[];
    floorPlan?: SanityImage;
  };
  
  // House data
  house: {
    id: string;                 // Sanity ID
    name: string;
    location: {
      city: string;
      state: string;
    };
  };
  
  // Computed properties
  isAvailable: boolean;         // derived from status
  pricePerMonth: number;        // currentPrice or type.basePrice
  daysUntilAvailable?: number;  // calculated from leaseEndDate if occupied
}
```

# Event
Idea: Events that the hacker house puts on. These should ideally belong to an individual hacker house. Could have 2 types - internal and external events. Internal is only for house residents
## Supabase Schema
```sql
-- For tracking internal or resident-only events not in Sanity
CREATE TABLE house_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_event_id TEXT, -- Optional link to Sanity event if it exists there
  sanity_house_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_mandatory BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES accelr8_users(id),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- For tracking RSVPs and attendance
CREATE TABLE event_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES house_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE CASCADE,
  rsvp_status TEXT NOT NULL CHECK (rsvp_status IN ('attending', 'maybe', 'declined', 'no_response')),
  rsvp_time TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- For external event registrations (when event is public)
CREATE TABLE external_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES house_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  registration_time TIMESTAMPTZ DEFAULT NOW(),
  checkin_time TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(event_id, email)
);

```
## Sanity Schema
```Typescript
export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hackathon', value: 'hackathon' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Social', value: 'social' },
          { title: 'Demo Day', value: 'demo' },
          { title: 'Pitch Night', value: 'pitch' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      description: 'Which house is hosting this event?',
    }),
    defineField({
      name: 'isGlobal',
      title: 'Global Event',
      type: 'boolean',
      description: 'Is this an organization-wide event?',
      initialValue: false,
    }),
    defineField({
      name: 'isPublic',
      title: 'Public Event',
      type: 'boolean',
      description: 'Is this event open to the public?',
      initialValue: true,
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Physical location or "Virtual"',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'role', type: 'string', title: 'Role/Title' },
            { name: 'bio', type: 'text', title: 'Bio' },
            { 
              name: 'image', 
              type: 'image', 
              title: 'Image',
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      description: 'External registration link (if applicable)',
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Maximum Participants',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventType: 'eventType',
      startDate: 'startDateTime',
      house: 'house.name',
      media: 'mainImage',
    },
    prepare({ title, eventType, startDate, house, media }) {
      const date = startDate ? new Date(startDate).toLocaleDateString() : '';
      return {
        title,
        subtitle: `${eventType ? eventType + ' | ' : ''}${date}${house ? ' | ' + house : ''}`,
        media,
      };
    },
  },
});
```

## Combined Type
```Typescript
interface Event {
  // Shared properties
  id: string;                // Sanity ID or Supabase UUID depending on source
  title: string;
  description?: string;
  startDateTime: string;     // ISO datetime string
  endDateTime: string;       // ISO datetime string
  location?: string;
  houseName?: string;
  houseId?: string;          // Sanity house ID
  
  // Properties from Sanity
  sanityData?: {
    slug?: string;
    eventType?: 'hackathon' | 'workshop' | 'social' | 'demo' | 'pitch' | 'other';
    isGlobal: boolean;
    isPublic: boolean;
    mainImage?: SanityImage;
    fullDescription?: PortableText[];
    speakers?: Array<{
      name: string;
      role?: string;
      bio?: string;
      image?: SanityImage;
    }>;
    registrationLink?: string;
    maxParticipants?: number;
  };
  
  // Properties from Supabase
  operationalData?: {
    isMandatory: boolean;
    createdBy?: {
      id: string;
      name?: string;
    };
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    currentParticipants: number;
    notes?: string;
    
    // For logged-in user
    userRsvpStatus?: 'attending' | 'maybe' | 'declined' | 'no_response';
    userAttended?: boolean;
  };
  
  // Computed properties
  isPast: boolean;          // Based on current time vs endDateTime
  isOngoing: boolean;       // Based on current time between start/end
  isUpcoming: boolean;      // Based on current time vs startDateTime
  daysUntil?: number;       // Days until event starts
}
```

# Applications
Idea: Holds information about people who have applied to live at an accelr8 house.
## Supabase Schema

## Sanity Schema
