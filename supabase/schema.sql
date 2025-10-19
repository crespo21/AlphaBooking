-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo TEXT,
    bio TEXT,
    services UUID[] DEFAULT '{}', -- Array of service IDs
    price_surcharge DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    confirmation_number VARCHAR(50) UNIQUE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    refund_amount DECIMAL(10,2),
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability table for staff schedules
CREATE TABLE IF NOT EXISTS availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blackout dates table
CREATE TABLE IF NOT EXISTS blackout_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create special dates table for different hours on specific dates
CREATE TABLE IF NOT EXISTS special_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_availability_staff_day ON availability(staff_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_date ON blackout_dates(date);
CREATE INDEX IF NOT EXISTS idx_special_dates_date ON special_dates(date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO services (id, name, description, price, duration) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Basic Haircut', 'A classic haircut to keep you looking sharp', 250.00, 30),
    ('550e8400-e29b-41d4-a716-446655440002', 'Premium Styling', 'Complete styling with premium products', 550.00, 60),
    ('550e8400-e29b-41d4-a716-446655440003', 'Beard Trim', 'Keep your beard looking neat and tidy', 120.00, 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff (id, name, photo, bio, services, price_surcharge) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'Alex Johnson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80', 'Specializes in modern haircuts with 5+ years of experience', ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], 40.00),
    ('650e8400-e29b-41d4-a716-446655440002', 'Sam Rivera', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80', 'Beard grooming specialist with attention to detail', ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'], 20.00),
    ('650e8400-e29b-41d4-a716-446655440003', 'Jordan Taylor', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80', 'Creative stylist specializing in color and premium treatments', ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'], 60.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO availability (staff_id, day_of_week, start_time, end_time) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 1, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440001', 2, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440001', 3, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440001', 4, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440001', 5, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440002', 1, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440002', 2, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440002', 3, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440002', 4, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440002', 5, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440003', 1, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440003', 2, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440003', 3, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440003', 4, '09:00', '17:00'),
    ('650e8400-e29b-41d4-a716-446655440003', 5, '09:00', '17:00')
ON CONFLICT DO NOTHING;

-- Insert sample blackout dates
INSERT INTO blackout_dates (date, reason) VALUES
    ('2023-12-25', 'Christmas Day'),
    ('2024-01-01', 'New Year Day'),
    ('2024-01-15', 'Holiday')
ON CONFLICT (date) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (confirmation_number, service_id, staff_id, date, time, customer_name, customer_email, customer_phone, total_price, status, payment_status, rating, review) VALUES
    ('A1B2C3D4', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '2025-10-25', '10:00', 'Jamie Smith', 'jamie.smith@example.com', '+27 82 123 4567', 290.00, 'confirmed', 'paid', 5, 'Excellent service! Very professional.'),
    ('E5F6G7H8', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', '2025-10-26', '13:30', 'Casey Jones', 'casey.jones@example.com', '+27 71 987 6543', 610.00, 'confirmed', 'paid', 4, 'Great styling, will come back!'),
    ('I9J0K1L2', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '2025-10-22', '09:00', 'Riley Wilson', 'riley.wilson@example.com', '+27 83 456 7890', 140.00, 'cancelled', 'refunded', NULL, NULL)
ON CONFLICT (confirmation_number) DO NOTHING;
