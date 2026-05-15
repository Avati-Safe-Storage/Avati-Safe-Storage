-- Supabase Schema for Avati Enterprise Storage Dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / STAFF
CREATE TYPE user_role AS ENUM ('super_admin', 'warehouse_supervisor', 'staff', 'client');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CUSTOMERS (Extended Client Data)
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  customer_code TEXT UNIQUE NOT NULL, -- e.g., AVT-CUS-001
  company_name TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  gst_pan TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. WAREHOUSE LOCATIONS
CREATE TABLE warehouse_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  zone TEXT NOT NULL, -- e.g., A, B, C
  rack TEXT NOT NULL, -- e.g., R1, R2
  shelf TEXT NOT NULL, -- e.g., S1, S2
  capacity_volume NUMERIC,
  current_volume NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'available', -- available, full, maintenance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. INVENTORY ITEMS
CREATE TABLE inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_code TEXT UNIQUE NOT NULL, -- e.g., AVT-ITM-1029
  customer_id UUID REFERENCES customers(id) NOT NULL,
  location_id UUID REFERENCES warehouse_locations(id),
  category TEXT NOT NULL,
  description TEXT,
  dimensions TEXT, -- LxWxH
  weight NUMERIC,
  is_fragile BOOLEAN DEFAULT false,
  qr_code_url TEXT,
  photo_urls TEXT[],
  status TEXT DEFAULT 'stored', -- stored, in_transit, retrieved, pending
  entry_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  retrieval_date TIMESTAMP WITH TIME ZONE
);

-- 5. RETRIEVAL REQUESTS
CREATE TABLE retrieval_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_code TEXT UNIQUE NOT NULL, -- e.g., AVT-RET-001
  customer_id UUID REFERENCES customers(id) NOT NULL,
  assigned_staff_id UUID REFERENCES profiles(id),
  items UUID[] NOT NULL, -- Array of inventory_items IDs
  delivery_address TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending_approval', -- pending_approval, approved, processing, in_transit, delivered
  otp_code TEXT,
  delivery_proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. INVOICES
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  subtotal NUMERIC NOT NULL,
  gst_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
  due_date DATE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. PAYMENTS
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- card, bank_transfer, upi, cash
  transaction_id TEXT,
  status TEXT DEFAULT 'completed',
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. ACTIVITY LOGS
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL, -- create_item, approve_retrieval, process_payment
  entity_type TEXT NOT NULL, -- inventory, retrieval, invoice
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- alert, info, success, warning
  is_read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE retrieval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Note: Policies will be created in production to restrict access based on user_role.
