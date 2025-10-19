-- ============================================
-- AlphaBooking Local Development Seed Data
-- ============================================
-- This file is ONLY executed in local development
-- It will NOT run in production deployments
-- ============================================

-- Clear existing data (for re-seeding)
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE availability CASCADE;
TRUNCATE TABLE staff CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE business_hours CASCADE;
TRUNCATE TABLE branding_settings CASCADE;

-- ============================================
-- Seed Services
-- ============================================
INSERT INTO services (id, name, description, price, duration, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Men''s Haircut', 'Classic haircut with styling', 250.00, 30, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Women''s Haircut', 'Professional cut and style', 350.00, 45, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Hair Coloring', 'Full color or highlights', 650.00, 120, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Beard Trim', 'Professional beard grooming', 150.00, 20, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Hair Treatment', 'Deep conditioning treatment', 450.00, 60, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Kids Haircut', 'Haircut for children under 12', 180.00, 25, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Styling', 'Special occasion styling', 300.00, 45, NOW(), NOW());

-- ============================================
-- Seed Staff Members
-- ============================================
INSERT INTO staff (id, name, photo, bio, services, price_surcharge, is_active, created_at, updated_at) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'Sarah Johnson',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'Senior stylist with 10 years of experience specializing in modern cuts and color.',
    ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007']::TEXT[],
    100.00,
    true,
    NOW(),
    NOW()
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    'Michael Chen',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'Master barber specializing in classic and contemporary men''s cuts.',
    ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006']::TEXT[],
    75.00,
    true,
    NOW(),
    NOW()
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    'Emily Rodriguez',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    'Color specialist with expertise in balayage and creative coloring techniques.',
    ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007']::TEXT[],
    120.00,
    true,
    NOW(),
    NOW()
),
(
    '660e8400-e29b-41d4-a716-446655440004',
    'James Wilson',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    'Versatile stylist with experience in all hair types and styles.',
    ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006']::TEXT[],
    50.00,
    true,
    NOW(),
    NOW()
);

-- ============================================
-- Seed Sample Bookings
-- ============================================
INSERT INTO bookings (
    id,
    confirmation_number,
    service_id,
    staff_id,
    date,
    time,
    customer_name,
    customer_email,
    customer_phone,
    total_price,
    status,
    payment_status,
    rating,
    review,
    created_at,
    updated_at
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    'BK-2025-001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440002',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'John Smith',
    'john.smith@email.com',
    '+27 82 123 4567',
    350.00,
    'confirmed',
    'paid',
    NULL,
    NULL,
    NOW(),
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'BK-2025-002',
    '550e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    CURRENT_DATE + INTERVAL '2 days',
    '14:30:00',
    'Lisa Anderson',
    'lisa.anderson@email.com',
    '+27 83 234 5678',
    450.00,
    'confirmed',
    'paid',
    NULL,
    NULL,
    NOW(),
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    'BK-2025-003',
    '550e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440003',
    CURRENT_DATE + INTERVAL '3 days',
    '11:00:00',
    'Maria Garcia',
    'maria.garcia@email.com',
    '+27 84 345 6789',
    770.00,
    'confirmed',
    'paid',
    5,
    'Emily is absolutely amazing! My hair color turned out perfect. Highly recommend!',
    NOW() - INTERVAL '2 days',
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440004',
    'BK-2025-004',
    '550e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440002',
    CURRENT_DATE - INTERVAL '3 days',
    '09:30:00',
    'David Brown',
    'david.brown@email.com',
    '+27 85 456 7890',
    225.00,
    'completed',
    'paid',
    4,
    'Great beard trim. Michael knows exactly what he''s doing.',
    NOW() - INTERVAL '5 days',
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440005',
    'BK-2025-005',
    '550e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440004',
    CURRENT_DATE + INTERVAL '1 day',
    '15:00:00',
    'Sarah Johnson',
    'sarah.j@email.com',
    '+27 86 567 8901',
    230.00,
    'confirmed',
    'paid',
    NULL,
    NULL,
    NOW(),
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440006',
    'BK-2025-006',
    '550e8400-e29b-41d4-a716-446655440007',
    '660e8400-e29b-41d4-a716-446655440001',
    CURRENT_DATE - INTERVAL '1 day',
    '16:00:00',
    'Jennifer Lee',
    'jennifer.lee@email.com',
    '+27 87 678 9012',
    400.00,
    'completed',
    'paid',
    5,
    'Sarah did an amazing job on my wedding hair. Everything was perfect!',
    NOW() - INTERVAL '3 days',
    NOW()
);

-- ============================================
-- Seed Business Hours
-- ============================================
INSERT INTO business_hours (day_of_week, is_open, open_time, close_time, created_at, updated_at) VALUES
('Monday', true, '09:00:00', '18:00:00', NOW(), NOW()),
('Tuesday', true, '09:00:00', '18:00:00', NOW(), NOW()),
('Wednesday', true, '09:00:00', '18:00:00', NOW(), NOW()),
('Thursday', true, '09:00:00', '20:00:00', NOW(), NOW()),
('Friday', true, '09:00:00', '20:00:00', NOW(), NOW()),
('Saturday', true, '08:00:00', '17:00:00', NOW(), NOW()),
('Sunday', false, NULL, NULL, NOW(), NOW());

-- ============================================
-- Seed Branding Settings
-- ============================================
INSERT INTO branding_settings (
    business_name,
    logo_url,
    primary_color,
    secondary_color,
    accent_color,
    created_at,
    updated_at
) VALUES (
    'AlphaBooking Salon & Spa',
    'https://via.placeholder.com/200x80?text=AlphaBooking',
    '#3B82F6',
    '#1E3A8A',
    '#F59E0B',
    NOW(),
    NOW()
);

-- ============================================
-- Seed Staff Availability (Sample Week)
-- ============================================
-- Sarah Johnson availability
INSERT INTO availability (staff_id, date, start_time, end_time, is_available, created_at, updated_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440001',
    CURRENT_DATE + (n || ' days')::INTERVAL,
    '09:00:00',
    '18:00:00',
    true,
    NOW(),
    NOW()
FROM generate_series(0, 6) AS n
WHERE EXTRACT(DOW FROM CURRENT_DATE + (n || ' days')::INTERVAL) NOT IN (0); -- Exclude Sundays

-- Michael Chen availability
INSERT INTO availability (staff_id, date, start_time, end_time, is_available, created_at, updated_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440002',
    CURRENT_DATE + (n || ' days')::INTERVAL,
    '09:00:00',
    '18:00:00',
    true,
    NOW(),
    NOW()
FROM generate_series(0, 6) AS n
WHERE EXTRACT(DOW FROM CURRENT_DATE + (n || ' days')::INTERVAL) NOT IN (0, 1); -- Exclude Sunday and Monday

-- Emily Rodriguez availability
INSERT INTO availability (staff_id, date, start_time, end_time, is_available, created_at, updated_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440003',
    CURRENT_DATE + (n || ' days')::INTERVAL,
    '10:00:00',
    '19:00:00',
    true,
    NOW(),
    NOW()
FROM generate_series(0, 6) AS n
WHERE EXTRACT(DOW FROM CURRENT_DATE + (n || ' days')::INTERVAL) NOT IN (0, 2); -- Exclude Sunday and Tuesday

-- James Wilson availability
INSERT INTO availability (staff_id, date, start_time, end_time, is_available, created_at, updated_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440004',
    CURRENT_DATE + (n || ' days')::INTERVAL,
    '08:00:00',
    '17:00:00',
    true,
    NOW(),
    NOW()
FROM generate_series(0, 6) AS n
WHERE EXTRACT(DOW FROM CURRENT_DATE + (n || ' days')::INTERVAL) NOT IN (0); -- Exclude Sundays

-- ============================================
-- Summary
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Seed data loaded successfully!';
    RAISE NOTICE '📊 Services: %', (SELECT COUNT(*) FROM services);
    RAISE NOTICE '👥 Staff: %', (SELECT COUNT(*) FROM staff);
    RAISE NOTICE '📅 Bookings: %', (SELECT COUNT(*) FROM bookings);
    RAISE NOTICE '⏰ Business Hours: %', (SELECT COUNT(*) FROM business_hours);
    RAISE NOTICE '🎨 Branding Settings: %', (SELECT COUNT(*) FROM branding_settings);
    RAISE NOTICE '📆 Availability Records: %', (SELECT COUNT(*) FROM availability);
END $$;
