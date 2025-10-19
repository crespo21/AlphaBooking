#!/bin/bash

# ============================================
# Reset Database - Schema Only (No Data)
# ============================================
# This script resets your local database with clean schema
# NO test data is loaded
# ============================================

set -e

echo "🔄 Resetting database (schema only, no seed data)..."
echo ""

# Confirm action
read -p "⚠️  This will delete ALL data. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 1
fi

# Reset without seeding
supabase db reset --no-seed

echo ""
echo "✅ Database reset complete!"
echo ""
echo "📊 Database Status:"
echo "==================="

# Show empty tables
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -c "
    SELECT 'Services' as table_name, COUNT(*)::TEXT as records FROM services
    UNION ALL SELECT 'Staff', COUNT(*)::TEXT FROM staff
    UNION ALL SELECT 'Bookings', COUNT(*)::TEXT FROM bookings
    UNION ALL SELECT 'Business Hours', COUNT(*)::TEXT FROM business_hours
" -t -A -F ' = '

echo ""
echo "🎯 Database is clean (schema only)!"
echo ""
echo "To add test data, run: ./scripts/seed-local-db.sh"
