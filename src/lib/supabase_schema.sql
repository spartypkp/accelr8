-- Accelr8 Supabase Schema
-- Full database schema definition for Accelr8 application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Helper Functions
-- ===========================================

-- Function for automatically updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- Core User Tables
-- ===========================================

-- Extends Supabase auth.users with application-specific user data
CREATE TABLE accelr8_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  sanity_person_id TEXT, -- Reference to Sanity Person document for public profile
  role TEXT NOT NULL CHECK (role IN ('resident', 'admin', 'super_admin')),
  phone_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Houses & Accommodation
-- ===========================================

-- Tracks rooms within houses
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL, -- Reference to Sanity House document
  room_number TEXT NOT NULL,
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'double', 'shared', 'suite')),
  floor INTEGER,
  max_occupancy INTEGER DEFAULT 1,
  square_footage INTEGER,
  is_accessible BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  monthly_rate DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (sanity_house_id, room_number)
);

-- Tracks user residencies in houses
CREATE TABLE residencies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE CASCADE,
  sanity_house_id TEXT NOT NULL, -- Reference to Sanity House document
  room_id UUID REFERENCES rooms(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'upcoming', 'past', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount DECIMAL(10,2),
  rent_frequency TEXT CHECK (rent_frequency IN ('weekly', 'monthly')),
  security_deposit DECIMAL(10,2),
  move_in_notes TEXT,
  move_out_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Application Process
-- ===========================================

-- Manages user applications to join houses
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  sanity_house_id TEXT, -- Reference to Sanity House document (optional if applying generally)
  preferred_move_in DATE,
  preferred_duration TEXT CHECK (preferred_duration IN ('1-3 months', '3-6 months', '6-12 months', '12+ months')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'reviewing', 'interview', 'approved', 'rejected', 'waitlisted')),
  responses JSONB, -- Stores application form responses
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  referral_source TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES accelr8_users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Operational Tables
-- ===========================================

-- Tracks maintenance issues and their resolution
CREATE TABLE maintenance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL, -- Reference to Sanity House document
  room_id UUID REFERENCES rooms(id),
  requested_by UUID REFERENCES accelr8_users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  status TEXT NOT NULL CHECK (status IN ('open', 'assigned', 'in_progress', 'waiting_parts', 'completed', 'cancelled')),
  assigned_to TEXT, -- External contractor or staff name
  assigned_contact TEXT, -- Contact info for assignee
  estimated_completion DATE,
  actual_completion TIMESTAMPTZ,
  cost DECIMAL(10,2),
  resolution_notes TEXT,
  location TEXT, -- Area in the house (kitchen, bathroom, etc.)
  room_details TEXT, -- Specific room identifier or details
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on maintenance requests
CREATE TABLE maintenance_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- For admin-only visibility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manages bookings for shared resources
CREATE TABLE resource_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_resource_id TEXT NOT NULL, -- Reference to Sanity Resource document
  user_id UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  sanity_house_id TEXT NOT NULL, -- Reference to Sanity House document
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  guests INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Events & Communications
-- ===========================================

-- Manages house-specific internal events
CREATE TABLE internal_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL, -- Reference to Sanity House document
  created_by UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT, -- Location within the house or external address
  max_participants INTEGER,
  is_mandatory BOOLEAN DEFAULT FALSE,
  event_type TEXT CHECK (event_type IN ('social', 'workshop', 'house_meeting', 'maintenance', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks RSVPs for internal events
CREATE TABLE event_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES internal_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('attending', 'maybe', 'declined', 'no_response')),
  response_date TIMESTAMPTZ,
  attended BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Manages internal house announcements
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT, -- Reference to Sanity House document (NULL for org-wide)
  created_by UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  importance TEXT CHECK (importance IN ('low', 'medium', 'high', 'urgent')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks who has read announcements
CREATE TABLE announcement_reads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- ===========================================
-- Financial Tables
-- ===========================================

-- Tracks financial transactions
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  residency_id UUID REFERENCES residencies(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('rent', 'deposit', 'fee', 'refund')),
  payment_method TEXT CHECK (payment_method IN ('credit_card', 'bank_transfer', 'cash', 'other')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  due_date DATE,
  paid_date TIMESTAMPTZ,
  external_reference TEXT, -- For payment processor reference
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Logging & Tracking Tables
-- ===========================================

-- Tracks important user and admin activities for audit purposes
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES accelr8_users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- The type of entity being acted upon (room, resident, etc)
  entity_id TEXT NOT NULL, -- ID of the entity being acted upon
  description TEXT NOT NULL,
  metadata JSONB, -- Additional structured data about the activity
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Triggers for Updated At Timestamps
-- ===========================================

-- User tables
CREATE TRIGGER update_accelr8_users_updated_at
BEFORE UPDATE ON accelr8_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Housing tables
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residencies_updated_at
BEFORE UPDATE ON residencies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Application tables
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Operational tables
CREATE TRIGGER update_maintenance_requests_updated_at
BEFORE UPDATE ON maintenance_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_comments_updated_at
BEFORE UPDATE ON maintenance_comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_bookings_updated_at
BEFORE UPDATE ON resource_bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Maintenance tables
-- Event tables
CREATE TRIGGER update_internal_events_updated_at
BEFORE UPDATE ON internal_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_participants_updated_at
BEFORE UPDATE ON event_participants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Announcement tables
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Payment tables
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();