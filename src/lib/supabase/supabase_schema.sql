-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function for automatically updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Core user data extending auth.users
CREATE TABLE accelr8_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  phone_number TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- House operations data
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

-- Room instances
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_house_id TEXT NOT NULL,
  sanity_room_type_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  current_resident_id UUID REFERENCES accelr8_users(id),
  current_price DECIMAL(10,2),
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

-- Internal events
CREATE TABLE house_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sanity_event_id TEXT,
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

-- Event participation tracking
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

-- External event registration
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

-- Resident applications
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'draft', 
    'submitted', 
    'reviewing', 
    'interview_scheduled', 
    'interview_completed', 
    'approved', 
    'rejected', 
    'waitlisted',
    'accepted',
    'cancelled'
  )),
  preferred_move_in DATE,
  preferred_duration TEXT CHECK (preferred_duration IN ('1-3 months', '3-6 months', '6-12 months', '12+ months')),
  preferred_houses TEXT[],
  bio TEXT,
  responses JSONB,
  current_applicant_role TEXT,
  company TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  submitted_at TIMESTAMPTZ,
  referral_source TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES accelr8_users(id),
  reviewed_at TIMESTAMPTZ,
  assigned_house_id TEXT,
  assigned_room_id UUID,
  sanity_person_id TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application interviews
CREATE TABLE application_interviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES accelr8_users(id),
  scheduled_time TIMESTAMPTZ,
  completed_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  interview_notes TEXT,
  overall_impression TEXT CHECK (overall_impression IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_accelr8_users_updated_at BEFORE UPDATE ON accelr8_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_house_operations_updated_at BEFORE UPDATE ON house_operations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_house_events_updated_at BEFORE UPDATE ON house_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_participants_updated_at BEFORE UPDATE ON event_participants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_interviews_updated_at BEFORE UPDATE ON application_interviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    sanity_person_id TEXT,
    invited_by UUID REFERENCES auth.users(id),
    house_id UUID REFERENCES house_operations(id),
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Create a simplified INSERT policy using the correct WITH CHECK syntax
CREATE POLICY "Admins can insert invitations" 
ON user_invitations 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.jwt() ->> 'role' IN ('admin', 'super_admin')
);

-- Allow admins to view all invitations
CREATE POLICY "Admins can view invitations" 
ON user_invitations FOR SELECT 
TO authenticated 
USING (
  (auth.jwt() ->> 'role') IN ('admin', 'super_admin')
);

-- Allow users to view their own invitations
CREATE POLICY "Users can view their own invitations" 
ON user_invitations FOR SELECT 
TO authenticated 
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Allow admins to update invitations
CREATE POLICY "Admins can update invitations" 
ON user_invitations FOR UPDATE
TO authenticated 
USING (
  (auth.jwt() ->> 'role') IN ('admin', 'super_admin')
);

-- Allow users to update their own invitations when claiming
CREATE POLICY "Users can claim their invitations" 
ON user_invitations FOR UPDATE
TO authenticated 
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);