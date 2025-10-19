#!/bin/bash

# ============================================
# Seed Local Database with Test Data
# ============================================
# This script manually loads test data into your local database
# Run this when you want sample data for development/testing
# ============================================

set -e

echo "🌱 Seeding local database with test data..."
echo ""

# Check if Supabase is running
if ! supabase status &> /dev/null; then
    echo "❌ Supabase is not running!"
    echo "   Start it with: supabase start"
    exit 1
fi

# Get database connection string
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Run seed file
echo "📂 Loading seed.sql..."
psql "$DB_URL" -f supabase/seed.sql

echo ""
echo "✅ Seed data loaded successfully!"
echo ""
echo "📊 Database Summary:"
echo "==================="

# Show counts
psql "$DB_URL" -c "
    SELECT 'Services' as item, COUNT(*)::TEXT as count FROM services
    UNION ALL SELECT 'Staff', COUNT(*)::TEXT FROM staff
    UNION ALL SELECT 'Bookings', COUNT(*)::TEXT FROM bookings
    UNION ALL SELECT 'Business Hours', COUNT(*)::TEXT FROM business_hours
    UNION ALL SELECT 'Branding Settings', COUNT(*)::TEXT FROM branding_settings
    UNION ALL SELECT 'Availability Records', COUNT(*)::TEXT FROM availability
" -t -A -F ' = '

echo ""
echo "🎯 Your local database is now populated with test data!"
echo "   View it at: http://127.0.0.1:54323"
